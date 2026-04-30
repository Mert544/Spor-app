"""
Memory Layer - Kısa ve uzun süreli hafıza yönetimi
- Kısa süreli: In-memory state + Redis cache
- Uzun süreli: PostgreSQL + pgvector (semantic search)
"""

import json
import hashlib
import logging
from datetime import datetime, timezone
from typing import Optional, Any
from dataclasses import dataclass, field

logger = logging.getLogger(__name__)


@dataclass
class TaskRecord:
    task_id: str
    title: str
    description: str
    status: str  # pending, in_progress, review, completed, failed, cancelled
    priority: int
    assigned_at: str
    completed_at: Optional[str] = None
    review_score: int = 0
    review_feedback: str = ""
    attempts: int = 0
    revisions: int = 0
    artifacts: dict = field(default_factory=dict)
    context: dict = field(default_factory=dict)


@dataclass
class ErrorRecord:
    error_hash: str
    error_type: str
    error_message: str
    solution: str
    context: dict = field(default_factory=dict)
    success_count: int = 1
    created_at: str = field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat()
    )


@dataclass
class DecisionRecord:
    decision_type: str
    rationale: str
    alternatives_considered: list = field(default_factory=list)
    made_by: str = ""
    timestamp: str = field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat()
    )
    outcome: str = "pending"


@dataclass
class CycleMetrics:
    cycle_number: int
    started_at: str
    completed_at: str = ""
    tasks_completed: int = 0
    tasks_failed: int = 0
    avg_review_score: float = 0.0
    retry_rate: float = 0.0
    build_success_rate: float = 0.0
    improvements_applied: list = field(default_factory=list)


class MemoryManager:
    """
    Hafıza yöneticisi.
    - In-memory storage (dev)
    - PostgreSQL + Redis (production)
    """

    def __init__(
        self, use_database: bool = False, db_url: str = "", redis_url: str = ""
    ):
        self.use_database = use_database
        self.db_url = db_url
        self.redis_url = redis_url

        # In-memory stores
        self._tasks: dict[str, TaskRecord] = {}
        self._errors: dict[str, ErrorRecord] = {}
        self._decisions: list[DecisionRecord] = []
        self._cycles: list[CycleMetrics] = []
        self._session_state: dict[str, Any] = {}
        self._experiences: list[dict] = []

        # Limits
        self._max_errors = 5000
        self._max_decisions = 2000
        self._max_experiences = 10000

    async def initialize(self):
        if self.use_database:
            await self._init_database()
        logger.info("Memory manager initialized")

    async def _init_database(self):
        # PostgreSQL + pgvector initialization
        try:
            import asyncpg

            self._db_pool = await asyncpg.create_pool(self.db_url)
            await self._run_migrations()
            logger.info("Database connection established")
        except Exception as e:
            logger.warning(f"Database init failed, using in-memory: {e}")
            self.use_database = False

    async def _run_migrations(self):
        migrations = [
            """
            CREATE TABLE IF NOT EXISTS task_history (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                task_id VARCHAR(50) UNIQUE NOT NULL,
                title TEXT NOT NULL,
                description TEXT,
                status VARCHAR(20),
                priority INT,
                assigned_at TIMESTAMPTZ,
                completed_at TIMESTAMPTZ,
                review_score INT,
                review_feedback TEXT,
                attempts INT DEFAULT 0,
                revisions INT DEFAULT 0,
                artifacts JSONB,
                context JSONB,
                embedding VECTOR(1536)
            );
            """,
            """
            CREATE TABLE IF NOT EXISTS error_solutions (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                error_hash VARCHAR(64) UNIQUE NOT NULL,
                error_type VARCHAR(100),
                error_message TEXT,
                solution TEXT,
                context JSONB,
                success_count INT DEFAULT 1,
                created_at TIMESTAMPTZ DEFAULT NOW()
            );
            """,
            """
            CREATE TABLE IF NOT EXISTS decisions (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                decision_type VARCHAR(50),
                rationale TEXT,
                alternatives_considered JSONB,
                made_by VARCHAR(20),
                timestamp TIMESTAMPTZ DEFAULT NOW(),
                outcome VARCHAR(20)
            );
            """,
            """
            CREATE TABLE IF NOT EXISTS cycle_metrics (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                cycle_number INT,
                started_at TIMESTAMPTZ,
                completed_at TIMESTAMPTZ,
                tasks_completed INT,
                tasks_failed INT,
                avg_review_score FLOAT,
                retry_rate FLOAT,
                build_success_rate FLOAT,
                improvements_applied JSONB
            );
            """,
        ]
        for migration in migrations:
            async with self._db_pool.acquire() as conn:
                await conn.execute(migration)

    # ── Task Management ──

    async def save_task(self, task: TaskRecord):
        self._tasks[task.task_id] = task
        if self.use_database:
            await self._save_task_db(task)

    async def get_task(self, task_id: str) -> Optional[TaskRecord]:
        return self._tasks.get(task_id)

    async def get_tasks_by_status(self, status: str) -> list[TaskRecord]:
        return [t for t in self._tasks.values() if t.status == status]

    async def get_recent_tasks(self, limit: int = 20) -> list[TaskRecord]:
        sorted_tasks = sorted(
            self._tasks.values(),
            key=lambda t: t.assigned_at,
            reverse=True,
        )
        return sorted_tasks[:limit]

    async def _save_task_db(self, task: TaskRecord):
        async with self._db_pool.acquire() as conn:
            await conn.execute(
                """
                INSERT INTO task_history
                (task_id, title, description, status, priority, assigned_at,
                 completed_at, review_score, review_feedback, attempts, revisions,
                 artifacts, context)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
                ON CONFLICT (task_id) DO UPDATE SET
                    status = EXCLUDED.status,
                    completed_at = EXCLUDED.completed_at,
                    review_score = EXCLUDED.review_score,
                    review_feedback = EXCLUDED.review_feedback,
                    attempts = EXCLUDED.attempts,
                    revisions = EXCLUDED.revisions,
                    artifacts = EXCLUDED.artifacts
                """,
                task.task_id,
                task.title,
                task.description,
                task.status,
                task.priority,
                task.assigned_at,
                task.completed_at,
                task.review_score,
                task.review_feedback,
                task.attempts,
                task.revisions,
                json.dumps(task.artifacts),
                json.dumps(task.context),
            )

    # ── Error Management ──

    async def save_error(self, error: ErrorRecord):
        self._errors[error.error_hash] = error
        if len(self._errors) > self._max_errors:
            oldest_keys = list(self._errors.keys())[:100]
            for key in oldest_keys:
                del self._errors[key]
        if self.use_database:
            await self._save_error_db(error)

    async def find_similar_error(
        self, error_message: str, threshold: float = 0.85
    ) -> Optional[ErrorRecord]:
        error_hash = self._compute_hash(error_message)
        if error_hash in self._errors:
            return self._errors[error_hash]

        # Fuzzy match on error type
        for err in self._errors.values():
            if err.error_type in error_message or error_message in err.error_message:
                return err
        return None

    async def _save_error_db(self, error: ErrorRecord):
        async with self._db_pool.acquire() as conn:
            await conn.execute(
                """
                INSERT INTO error_solutions
                (error_hash, error_type, error_message, solution, context, success_count)
                VALUES ($1, $2, $3, $4, $5, $6)
                ON CONFLICT (error_hash) DO UPDATE SET
                    success_count = error_solutions.success_count + 1
                """,
                error.error_hash,
                error.error_type,
                error.error_message,
                error.solution,
                json.dumps(error.context),
                error.success_count,
            )

    def _compute_hash(self, text: str) -> str:
        return hashlib.sha256(text.encode()).hexdigest()

    # ── Decision Management ──

    async def save_decision(self, decision: DecisionRecord):
        self._decisions.append(decision)
        if len(self._decisions) > self._max_decisions:
            self._decisions = self._decisions[-self._max_decisions :]
        if self.use_database:
            await self._save_decision_db(decision)

    async def get_decisions(
        self, decision_type: str = None, limit: int = 50
    ) -> list[DecisionRecord]:
        decisions = self._decisions
        if decision_type:
            decisions = [d for d in decisions if d.decision_type == decision_type]
        return decisions[-limit:]

    async def _save_decision_db(self, decision: DecisionRecord):
        async with self._db_pool.acquire() as conn:
            await conn.execute(
                """
                INSERT INTO decisions
                (decision_type, rationale, alternatives_considered, made_by, outcome)
                VALUES ($1, $2, $3, $4, $5)
                """,
                decision.decision_type,
                decision.rationale,
                json.dumps(decision.alternatives_considered),
                decision.made_by,
                decision.outcome,
            )

    # ── Cycle Metrics ──

    async def save_cycle_metrics(self, metrics: CycleMetrics):
        self._cycles.append(metrics)
        if self.use_database:
            await self._save_cycle_db(metrics)

    def get_cycle_history(self, limit: int = 30) -> list[CycleMetrics]:
        return self._cycles[-limit:]

    async def _save_cycle_db(self, metrics: CycleMetrics):
        async with self._db_pool.acquire() as conn:
            await conn.execute(
                """
                INSERT INTO cycle_metrics
                (cycle_number, started_at, completed_at, tasks_completed,
                 tasks_failed, avg_review_score, retry_rate, build_success_rate,
                 improvements_applied)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                """,
                metrics.cycle_number,
                metrics.started_at,
                metrics.completed_at,
                metrics.tasks_completed,
                metrics.tasks_failed,
                metrics.avg_review_score,
                metrics.retry_rate,
                metrics.build_success_rate,
                json.dumps(metrics.improvements_applied),
            )

    # ── Session State ──

    async def set_session_state(self, key: str, value: Any):
        self._session_state[key] = value

    async def get_session_state(self, key: str, default: Any = None) -> Any:
        return self._session_state.get(key, default)

    async def get_all_session_state(self) -> dict:
        return dict(self._session_state)

    # ── Experience Storage (for self-improvement) ──

    async def store_experience(self, experience: dict):
        self._experiences.append(experience)
        if len(self._experiences) > self._max_experiences:
            self._experiences = self._experiences[-self._max_experiences :]

    async def find_similar_experience(self, query: str, limit: int = 5) -> list[dict]:
        results = []
        query_lower = query.lower()
        for exp in reversed(self._experiences):
            exp_text = json.dumps(exp).lower()
            if query_lower in exp_text:
                results.append(exp)
                if len(results) >= limit:
                    break
        return results

    # ── Statistics ──

    def get_stats(self) -> dict:
        total_tasks = len(self._tasks)
        completed = sum(1 for t in self._tasks.values() if t.status == "completed")
        failed = sum(1 for t in self._tasks.values() if t.status == "failed")
        in_progress = sum(1 for t in self._tasks.values() if t.status == "in_progress")

        return {
            "total_tasks": total_tasks,
            "completed_tasks": completed,
            "failed_tasks": failed,
            "in_progress_tasks": in_progress,
            "error_solutions": len(self._errors),
            "decisions_made": len(self._decisions),
            "cycles_completed": len(self._cycles),
            "experiences_stored": len(self._experiences),
        }

    async def shutdown(self):
        if self.use_database and hasattr(self, "_db_pool"):
            await self._db_pool.close()
