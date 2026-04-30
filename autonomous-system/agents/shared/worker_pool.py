"""
Multi-Agent Concurrency — Parallel task execution with worker pool
"""

import asyncio
import logging
from typing import Callable, Optional
from dataclasses import dataclass, field
from datetime import datetime, timezone

logger = logging.getLogger(__name__)


@dataclass
class WorkerStats:
    worker_id: int
    tasks_completed: int = 0
    tasks_failed: int = 0
    current_task: str = ""
    is_busy: bool = False
    last_heartbeat: str = field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat()
    )


class WorkerPool:
    """
    Async worker pool for parallel task execution.
    - Configurable concurrency
    - Task queue with priority
    - Worker health monitoring
    - Graceful shutdown
    """

    def __init__(self, max_workers: int = 4, queue_size: int = 100):
        self.max_workers = max_workers
        self.queue_size = queue_size
        self._queue: asyncio.PriorityQueue = asyncio.PriorityQueue(maxsize=queue_size)
        self._workers: list[asyncio.Task] = []
        self._stats: list[WorkerStats] = [
            WorkerStats(worker_id=i) for i in range(max_workers)
        ]
        self._running = False
        self._semaphore = asyncio.Semaphore(max_workers)

    async def start(self):
        self._running = True
        for i in range(self.max_workers):
            task = asyncio.create_task(self._worker_loop(i))
            self._workers.append(task)
        logger.info(f"Worker pool started with {self.max_workers} workers")

    async def submit(self, priority: int, task_fn: Callable, task_id: str, **kwargs):
        """
        Submit a task to the queue.
        Lower priority number = higher priority.
        """
        try:
            await self._queue.put((priority, task_fn, task_id, kwargs))
            logger.debug(f"Task submitted: {task_id} (priority={priority})")
            return True
        except asyncio.QueueFull:
            logger.warning(f"Queue full, task dropped: {task_id}")
            return False

    async def _worker_loop(self, worker_id: int):
        stats = self._stats[worker_id]
        while self._running:
            try:
                item = await asyncio.wait_for(self._queue.get(), timeout=1.0)
            except asyncio.TimeoutError:
                continue

            priority, task_fn, task_id, kwargs = item
            stats.is_busy = True
            stats.current_task = task_id
            stats.last_heartbeat = datetime.now(timezone.utc).isoformat()

            try:
                async with self._semaphore:
                    result = await task_fn(**kwargs)
                stats.tasks_completed += 1
                logger.info(f"Worker {worker_id}: {task_id} completed")
            except Exception as e:
                stats.tasks_failed += 1
                logger.error(f"Worker {worker_id}: {task_id} failed: {e}")
                result = {"error": str(e)}
            finally:
                stats.is_busy = False
                stats.current_task = ""
                self._queue.task_done()

    async def wait_all_done(self):
        await self._queue.join()
        logger.info("All tasks in queue completed")

    async def shutdown(self, timeout: float = 30.0):
        self._running = False
        for worker in self._workers:
            worker.cancel()
        await asyncio.gather(*self._workers, return_exceptions=True)
        self._workers.clear()
        logger.info("Worker pool shut down")

    def get_stats(self) -> list[dict]:
        return [
            {
                "worker_id": s.worker_id,
                "tasks_completed": s.tasks_completed,
                "tasks_failed": s.tasks_failed,
                "is_busy": s.is_busy,
                "current_task": s.current_task,
                "last_heartbeat": s.last_heartbeat,
            }
            for s in self._stats
        ]

    def queue_size(self) -> int:
        return self._queue.qsize()


class ConcurrentTaskRunner:
    """
    Run multiple tasks concurrently with configurable batch size.
    """

    def __init__(self, batch_size: int = 5):
        self.batch_size = batch_size
        self._semaphore = asyncio.Semaphore(batch_size)

    async def run(self, tasks: list[dict], task_fn: Callable) -> list[dict]:
        """
        Run tasks in parallel, max batch_size at a time.
        Returns list of results in order.
        """

        async def _run_one(task: dict) -> dict:
            async with self._semaphore:
                try:
                    result = await task_fn(task)
                    return {
                        "task_id": task.get("task_id", ""),
                        "success": True,
                        "result": result,
                    }
                except Exception as e:
                    return {
                        "task_id": task.get("task_id", ""),
                        "success": False,
                        "error": str(e),
                    }

        coros = [_run_one(t) for t in tasks]
        results = await asyncio.gather(*coros, return_exceptions=True)

        final_results = []
        for r in results:
            if isinstance(r, Exception):
                final_results.append({"success": False, "error": str(r)})
            else:
                final_results.append(r)

        return final_results
