"""
Hermes Agent - Ana karar verme motoru
Tüm Hermes modüllerini koordine eder
"""

import logging
from datetime import datetime, timezone
from typing import Optional

from agents.shared.message_bus import MessageBus, Message, MessagePayload, MessageType
from agents.shared.memory import MemoryManager, TaskRecord, DecisionRecord, CycleMetrics
from agents.shared.security import SecurityGuard
from .analyzer import CodebaseAnalyzer
from .planner import TaskPlanner
from .reviewer import CodeReviewer
from .self_improvement import SelfImprovementLoop

logger = logging.getLogger(__name__)


class HermesAgent:
    """
    Stratejist ajan. Proje analiz eder, plan yapar, kaliteyi denetler,
    kendini geliştirir.
    """

    def __init__(
        self,
        message_bus: MessageBus,
        memory: MemoryManager,
        security: SecurityGuard,
        project_root: str = ".",
    ):
        self.message_bus = message_bus
        self.memory = memory
        self.security = security
        self.project_root = project_root

        self.analyzer = CodebaseAnalyzer(project_root)
        self.planner = TaskPlanner()
        self.reviewer = CodeReviewer()
        self.self_improvement = SelfImprovementLoop()

        self._cycle_count = 0
        self._is_running = False

    async def start(self):
        self._is_running = True
        logger.info("Hermes agent started")

    async def stop(self):
        self._is_running = False
        logger.info("Hermes agent stopped")

    async def run_cycle(self) -> dict:
        """
        Tek bir analiz-plan-review döngüsü çalıştır.
        """
        self._cycle_count += 1
        cycle_start = datetime.now(timezone.utc).isoformat()
        cycle_metrics = CycleMetrics(
            cycle_number=self._cycle_count,
            started_at=cycle_start,
        )

        logger.info(f"=== Cycle {self._cycle_count} started ===")

        try:
            # 1. Codebase analiz et
            analysis = await self.analyzer.analyze()
            logger.info(f"Analysis complete: {analysis.get('summary', {})}")

            # 2. Plan oluştur (completed task'ları geçir — deduplication)
            completed_tasks = set()
            for t in await self.memory.get_tasks_by_status("completed"):
                key = (
                    "unknown",  # category bilgisi task'ta yok
                    tuple(sorted(t.artifacts.get("files_changed", []) or [])),
                )
                completed_tasks.add(key)

            plan = self.planner.create_plan(analysis, completed_tasks)
            logger.info(
                f"Plan created: {len(plan.get('tasks', []))} tasks (deduplicated)"
            )

            # 3. Güvenlik kontrolü
            is_safe, violations = self.security.validate_plan(plan)
            if not is_safe:
                for v in violations:
                    self.security.record_violation(v)
                    logger.warning(f"Security violation: {v.description}")
                plan = self.planner.revise_plan(plan, violations)

            # 4. Görevleri Clawbot'a gönder
            tasks = plan.get("tasks", [])
            for task in tasks:
                message = Message(
                    from_agent="hermes",
                    to_agent="clawbot",
                    type=MessageType.TASK_ASSIGN.value,
                    payload=MessagePayload(
                        task_id=task["task_id"],
                        title=task["title"],
                        description=task["description"],
                        priority=task.get("priority", 3),
                        acceptance_criteria=task.get("acceptance_criteria", []),
                        files_affected=task.get("files_affected", []),
                        branch=task.get("branch", ""),
                        context=task.get("context", {}),
                    ),
                )
                await self.message_bus.send(message)

                # Task'ı memory'e kaydet
                await self.memory.save_task(
                    TaskRecord(
                        task_id=task["task_id"],
                        title=task["title"],
                        description=task["description"],
                        status="pending",
                        priority=task.get("priority", 3),
                        assigned_at=datetime.now(timezone.utc).isoformat(),
                    )
                )

            # 5. Kararı kaydet
            await self.memory.save_decision(
                DecisionRecord(
                    decision_type="cycle_plan",
                    rationale=plan.get("rationale", ""),
                    alternatives_considered=plan.get("alternatives", []),
                    made_by="hermes",
                    outcome="dispatched",
                )
            )

            cycle_metrics.tasks_completed = len(tasks)
            return {
                "cycle": self._cycle_count,
                "tasks_dispatched": len(tasks),
                "plan": plan,
                "analysis": analysis,
            }

        except Exception as e:
            logger.error(f"Cycle {self._cycle_count} failed: {e}")
            return {"cycle": self._cycle_count, "error": str(e)}

        finally:
            cycle_metrics.completed_at = datetime.now(timezone.utc).isoformat()
            await self.memory.save_cycle_metrics(cycle_metrics)

    async def review_result(self, task_id: str, result: dict) -> dict:
        """
        Clawbot'un tamamladığı görevi incele ve puanla.
        """
        review = self.reviewer.review(task_id, result)

        # DEBUG: Log full review details
        logger.info(
            f"Review {task_id}: score={review['score']}, passed={review['passed']}, "
            f"criteria={review['criteria_scores']}, feedback={review['feedback']}"
        )

        # Review sonucunu memory'e kaydet
        task = await self.memory.get_task(task_id)
        if task:
            task.review_score = review["score"]
            task.review_feedback = review["feedback"]
            task.status = "completed" if review["score"] >= 75 else "failed"
            task.completed_at = datetime.now(timezone.utc).isoformat()
            await self.memory.save_task(task)

        # Karar kaydet
        await self.memory.save_decision(
            DecisionRecord(
                decision_type="code_review",
                rationale=review["feedback"],
                made_by="hermes",
                outcome="passed" if review["score"] >= 75 else "revision_needed",
            )
        )

        return review

    async def generate_revision_request(self, task_id: str, review: dict) -> Message:
        """Revizyon talebi oluştur"""
        return Message(
            from_agent="hermes",
            to_agent="clawbot",
            type=MessageType.REVISION_REQUEST.value,
            payload=MessagePayload(
                task_id=task_id,
                score=review["score"],
                feedback=review["feedback"],
            ),
        )

    async def self_improve(self):
        """Self-improvement loop'u çalıştır"""
        improvements = await self.self_improvement.evaluate(self.memory)
        if improvements:
            logger.info(f"Self-improvement applied: {len(improvements)} changes")
            for imp in improvements:
                await self.memory.save_decision(
                    DecisionRecord(
                        decision_type="self_improvement",
                        rationale=imp["description"],
                        made_by="hermes",
                        outcome="applied",
                    )
                )
        return improvements

    def get_status(self) -> dict:
        return {
            "agent": "hermes",
            "running": self._is_running,
            "cycles_completed": self._cycle_count,
            "memory_stats": self.memory.get_stats(),
            "security_stats": self.security.get_stats(),
        }
