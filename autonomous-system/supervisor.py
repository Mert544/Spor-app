"""
Supervisor - Ana orchestrator. 7/24 çalışan döngüyü yönetir.
"""

import asyncio
import json
import logging
import os
import signal
import sys
import time
from datetime import datetime, timezone
from typing import Optional

from agents.hermes.strategist import HermesAgent
from agents.clawbot.builder import ClawbotBuilder
from agents.clawbot.tester import ClawbotTester
from agents.clawbot.deployer import ClawbotDeployer
from agents.clawbot.fixer import ClawbotFixer
from agents.shared.message_bus import MessageBus, Message, MessagePayload, MessageType
from agents.shared.memory import MemoryManager, TaskRecord
from agents.shared.security import SecurityGuard
from agents.shared.crash_recovery import CrashRecovery
from agents.shared.worker_pool import ConcurrentTaskRunner
from agents.shared.circuit_breaker import CircuitBreakerRegistry, CircuitBreaker
from agents.shared.llm_client import LLMClient, LLMConfig
from config.config import load_config, AppConfig

try:
    from monitoring.observability import metrics, tracer

    HAS_OBSERVABILITY = True
except ImportError:
    HAS_OBSERVABILITY = False

logger = logging.getLogger(__name__)


class Supervisor:
    """
    Ana orchestrator. Hermes ve Clawbot'u koordine eder,
    hata yönetimi yapar, checkpoint'leri yönetir.
    """

    def __init__(
        self,
        project_root: str = ".",
        cycle_interval_seconds: int = 300,
        max_retries: int = 3,
        max_revisions: int = 2,
        max_concurrent_tasks: int = 1,
    ):
        self.project_root = project_root
        self.cycle_interval = cycle_interval_seconds
        self.max_retries = max_retries
        self.max_revisions = max_revisions
        self.max_concurrent_tasks = max_concurrent_tasks

        # Initialize components
        self.message_bus = MessageBus()
        self.memory = MemoryManager()
        self.security = SecurityGuard()

        self.hermes = HermesAgent(
            message_bus=self.message_bus,
            memory=self.memory,
            security=self.security,
            project_root=project_root,
        )

        # LLM Client — gerçek kod üretimi için
        self.llm = LLMClient(
            LLMConfig(
                provider=os.environ.get("LLM_PROVIDER", "openai"),
                model=os.environ.get("LLM_MODEL", "gpt-4o-mini"),
                api_key=os.environ.get("LLM_API_KEY", ""),
                base_url=os.environ.get("LLM_BASE_URL", ""),
                temperature=0.3,
                max_tokens=4096,
            )
        )

        self.builder = ClawbotBuilder(project_root, llm_client=self.llm)
        self.builder.set_security_guard(self.security)
        self.tester = ClawbotTester(project_root)
        self.deployer = ClawbotDeployer(project_root)
        self.fixer = ClawbotFixer(project_root, llm_client=self.llm)

        # Reviewer'a da LLM ekle
        self.hermes.reviewer.set_llm_client(self.llm)

        # Worker pool for concurrent task execution
        self.task_runner = ConcurrentTaskRunner(batch_size=max_concurrent_tasks)

        # Circuit breakers for external services
        self.circuits = CircuitBreakerRegistry()
        self.circuits.get_or_create("git", failure_threshold=5, recovery_timeout=120)
        self.circuits.get_or_create("npm", failure_threshold=3, recovery_timeout=60)
        self.circuits.get_or_create("deploy", failure_threshold=2, recovery_timeout=300)
        self.circuits.get_or_create("llm", failure_threshold=5, recovery_timeout=120)

        self._running = False
        self._cycle_count = 0
        self._recovery = CrashRecovery(project_root)
        self._start_time = datetime.now(timezone.utc)

    async def start(self):
        """Sistemi başlat"""
        self._running = True
        logger.info("=" * 60)
        logger.info("AUTONOMOUS DEVELOPMENT SYSTEM STARTING")
        logger.info("=" * 60)

        # Initialize components
        await self.message_bus.initialize()
        await self.memory.initialize()
        await self.hermes.start()

        # Register message handlers
        self.message_bus.subscribe("clawbot", self._handle_clawbot_message)

        # Load checkpoint if exists
        await self._load_checkpoint()

        # Register signal handlers (not supported on Windows)
        if sys.platform != "win32":
            loop = asyncio.get_event_loop()
            for sig in (signal.SIGINT, signal.SIGTERM):
                loop.add_signal_handler(
                    sig, lambda: asyncio.create_task(self.shutdown())
                )

        # Start main loop
        logger.info("Main loop started")
        await self._main_loop()

    async def _main_loop(self):
        """Ana döngü — asla durmaz"""
        while self._running:
            try:
                span_id = None
                if HAS_OBSERVABILITY:
                    span_id = tracer.start_span(
                        "cycle", f"cycle-{self._cycle_count + 1}"
                    )
                    metrics.increment("cycles.total")

                # Check security pause
                if self.security.is_paused():
                    logger.warning(
                        "System paused due to security violation. Waiting for resume..."
                    )
                    await asyncio.sleep(30)
                    continue

                cycle_start = time.time()

                # 1. HERMES: Analyze + Plan + Dispatch
                cycle_result = await self.hermes.run_cycle()
                self._cycle_count += 1

                tasks = cycle_result.get("plan", {}).get("tasks", [])
                logger.info(f"Cycle {self._cycle_count}: {len(tasks)} tasks dispatched")

                if HAS_OBSERVABILITY:
                    metrics.increment("tasks.dispatched", len(tasks))

                # 2. Process tasks (concurrent if max_concurrent_tasks > 1)
                if self.max_concurrent_tasks > 1:
                    await self._process_tasks_concurrent(tasks)
                else:
                    for task in tasks:
                        await self._process_task(task)

                # 3. HERMES: Self-improvement
                await self.hermes.self_improve()

                # 4. Save checkpoint
                await self._save_checkpoint()

                # 5. Record cycle metrics
                elapsed = time.time() - cycle_start
                if HAS_OBSERVABILITY:
                    metrics.set_gauge("cycle.duration_seconds", elapsed)
                    metrics.observe("cycle.duration_seconds", elapsed)

                # 6. Wait for next cycle
                wait_time = max(0, self.cycle_interval - elapsed)
                if wait_time > 0:
                    logger.info(f"Waiting {wait_time:.0f}s until next cycle")
                    await asyncio.sleep(wait_time)

                if span_id and HAS_OBSERVABILITY:
                    tracer.end_span(span_id, "ok", {"tasks": len(tasks)})

            except Exception as e:
                logger.error(f"Main loop error: {e}", exc_info=True)
                if HAS_OBSERVABILITY:
                    metrics.increment("cycles.errors")
                await asyncio.sleep(30)

    async def _process_tasks_concurrent(self, tasks: list):
        """Process multiple tasks concurrently using worker pool"""
        if not tasks:
            return

        async def _process_one(task: dict) -> dict:
            return await self._process_task(task)

        results = await self.task_runner.run(tasks, _process_one)

        completed = sum(1 for r in results if r.get("success"))
        failed = len(results) - completed

        if HAS_OBSERVABILITY:
            metrics.increment("tasks.completed", completed)
            metrics.increment("tasks.failed", failed)

        logger.info(f"Concurrent batch: {completed} completed, {failed} failed")

    async def _process_task(self, task: dict) -> dict:
        """Tek bir görevi işle"""
        task_id = task.get("task_id", "")
        max_attempts = self.max_retries
        max_revs = self.max_revisions

        task_span = None
        if HAS_OBSERVABILITY:
            task_span = tracer.start_span("process_task", task_id)

        for attempt in range(max_attempts):
            try:
                # Update task status
                task_record = await self.memory.get_task(task_id)
                if task_record:
                    task_record.status = "in_progress"
                    task_record.attempts = attempt + 1
                    await self.memory.save_task(task_record)

                # CLAWBOT: Execute (with circuit breaker)
                build_cb = self.circuits.get_or_create("git")
                build_result = await build_cb.execute(self.builder.execute_task, task)

                if build_result["status"] == "failed":
                    # Try to fix
                    fix_result = await self.fixer.fix_task(
                        task, {"error": build_result.get("error", "")}
                    )
                    if fix_result["fix_applied"]:
                        logger.info(f"Fix applied for {task_id}, retrying...")
                        continue
                    else:
                        logger.warning(
                            f"Task {task_id} failed after {attempt + 1} attempts"
                        )
                        await self._mark_task_failed(
                            task_id, build_result.get("error", "Build failed")
                        )
                        if task_span and HAS_OBSERVABILITY:
                            tracer.end_span(
                                task_span, "failed", {"error": "build_failed"}
                            )
                        return {"success": False, "error": "build_failed"}

                # CLAWBOT: Run tests (builder simulated değilse)
                if not build_result.get("artifacts", {}).get("test_results"):
                    test_results = await self.tester.run_tests(task_id)
                    build_result["artifacts"]["test_results"] = [test_results]

                # Security scan
                security_scan = await self.tester.run_security_scan()
                build_result["artifacts"]["security_scan"] = security_scan

                # HERMES: Review
                review = await self.hermes.review_result(task_id, build_result)

                if review["score"] >= 75:
                    # Passed — deploy
                    deploy_cb = self.circuits.get_or_create("deploy")
                    deploy_result = await deploy_cb.execute(
                        self.deployer.deploy, task_id, build_result
                    )
                    build_result["artifacts"]["deploy"] = deploy_result

                    # Store experience
                    await self.memory.store_experience(
                        {
                            "task_id": task_id,
                            "title": task.get("title", ""),
                            "result": build_result,
                            "review": review,
                            "deploy": deploy_result,
                            "text": f"{task.get('title', '')}: {task.get('description', '')}",
                        }
                    )

                    logger.info(f"Task {task_id} completed (score: {review['score']})")
                    # Planner'a bildir — deduplication
                    self.hermes.planner.mark_completed(
                        task_id,
                        build_result.get("artifacts", {}).get("files_changed", []),
                        task.get("category", "unknown"),
                    )

                    if HAS_OBSERVABILITY:
                        metrics.increment("tasks.completed")
                        metrics.set_gauge(
                            "task.review_score", review["score"], {"task_id": task_id}
                        )
                        if task_span:
                            tracer.end_span(task_span, "ok", {"score": review["score"]})

                    return {"success": True, "score": review["score"]}
                else:
                    # Failed review — revision
                    if attempt < max_revs:
                        revision_msg = await self.hermes.generate_revision_request(
                            task_id, review
                        )
                        await self.message_bus.send(revision_msg)

                        if task_record:
                            task_record.revisions += 1
                            await self.memory.save_task(task_record)

                        logger.info(f"Task {task_id} revision {attempt + 1}/{max_revs}")
                        continue
                    else:
                        logger.warning(
                            f"Task {task_id} failed review after {max_revs} revisions"
                        )
                        await self._mark_task_failed(
                            task_id, f"Review score: {review['score']}"
                        )
                        if task_span and HAS_OBSERVABILITY:
                            tracer.end_span(
                                task_span, "failed", {"score": review["score"]}
                            )
                        return {"success": False, "error": "review_failed"}

            except Exception as e:
                logger.error(f"Task {task_id} processing error: {e}")
                if attempt == max_attempts - 1:
                    await self._mark_task_failed(task_id, str(e))
                    if task_span and HAS_OBSERVABILITY:
                        tracer.end_span(task_span, "error", {"error": str(e)})
                    return {"success": False, "error": str(e)}

        return {"success": False, "error": "max_attempts_exceeded"}

    async def _handle_clawbot_message(self, message: Message):
        """Clawbot'tan gelen mesajları işle"""
        if message.type == MessageType.TASK_COMPLETE.value:
            logger.info(f"Task completed: {message.payload.task_id}")
        elif message.type == MessageType.TASK_FAILED.value:
            logger.warning(
                f"Task failed: {message.payload.task_id} — {message.payload.error}"
            )
        elif message.type == MessageType.PROGRESS_UPDATE.value:
            logger.info(
                f"Progress: {message.payload.task_id} — {message.payload.feedback}"
            )

        await self.message_bus.acknowledge(message.message_id)

    async def _mark_task_failed(self, task_id: str, error: str):
        """Görevi başarısız olarak işaretle"""
        task = await self.memory.get_task(task_id)
        if task:
            task.status = "failed"
            task.completed_at = datetime.now(timezone.utc).isoformat()
            await self.memory.save_task(task)

        if HAS_OBSERVABILITY:
            metrics.increment("tasks.failed")

    async def _save_checkpoint(self):
        """Mevcut durumu atomic olarak kaydet"""
        state = await self._recovery.serialize_memory_state(self.memory)
        state["cycle_count"] = self._cycle_count
        state["timestamp"] = datetime.now(timezone.utc).isoformat()
        state["circuit_breakers"] = self.circuits.get_all_status()
        await self._recovery.save_state(state)

    async def _load_checkpoint(self):
        """Checkpoint'ten durumu geri yükle"""
        saved_state = await self._recovery.load_state()
        if saved_state:
            self._cycle_count = saved_state.get("cycle_count", 0)
            await self._recovery.restore_memory_state(saved_state, self.memory)
            logger.info(f"Checkpoint loaded: cycle {self._cycle_count}")

    async def shutdown(self):
        """Sistemi güvenli şekilde kapat"""
        logger.info("Shutting down autonomous system...")
        self._running = False
        await self.hermes.stop()
        await self._save_checkpoint()
        await self.message_bus.shutdown()
        await self.memory.shutdown()
        logger.info("System shut down complete")
