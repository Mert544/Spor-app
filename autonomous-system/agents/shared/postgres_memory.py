"""
PostgreSQL Persistent Memory Layer
Production-ready database-backed memory with connection pooling, retries, and migrations.
"""

import json
import hashlib
import logging
import asyncio
from datetime import datetime, timezone
from typing import Optional, Any
from contextlib import asynccontextmanager

logger = logging.getLogger(__name__)

try:
    import asyncpg

    HAS_ASYNCPG = True
except ImportError:
    HAS_ASYNCPG = False


class PostgresMemory:
    """
    PostgreSQL persistent memory with:
    - Connection pooling
    - Automatic retries on transient failures
    - Schema migrations
    - Bulk operations
    """

    def __init__(self, db_url: str, pool_size: int = 10, max_retries: int = 3):
        self.db_url = db_url
        self.pool_size = pool_size
        self.max_retries = max_retries
        self._pool = None
        self._initialized = False

    async def initialize(self):
        if not HAS_ASYNCPG:
            logger.error("asyncpg not installed — PostgreSQL disabled")
            return False

        try:
            self._pool = await asyncpg.create_pool(
                self.db_url,
                min_size=2,
                max_size=self.pool_size,
                command_timeout=60,
            )
            await self._run_migrations()
            self._initialized = True
            logger.info(f"PostgreSQL memory initialized (pool_size={self.pool_size})")
            return True
        except Exception as e:
            logger.warning(f"PostgreSQL init failed, using in-memory: {e}")
            return False

    @asynccontextmanager
    async def _get_connection(self):
        if not self._pool:
            raise RuntimeError("PostgreSQL not initialized")
        async with self._pool.acquire() as conn:
            yield conn

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
                created_at TIMESTAMPTZ DEFAULT NOW(),
                updated_at TIMESTAMPTZ DEFAULT NOW()
            );
            """,
            """
            CREATE INDEX IF NOT EXISTS idx_task_status ON task_history(status);
            """,
            """
            CREATE INDEX IF NOT EXISTS idx_task_assigned_at ON task_history(assigned_at DESC);
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
            CREATE INDEX IF NOT EXISTS idx_decision_type ON decisions(decision_type);
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
            """
            CREATE TABLE IF NOT EXISTS experiences (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                task_id VARCHAR(50),
                title TEXT,
                result JSONB,
                review JSONB,
                deploy JSONB,
                text TEXT,
                created_at TIMESTAMPTZ DEFAULT NOW()
            );
            """,
            """
            CREATE INDEX IF NOT EXISTS idx_experience_task ON experiences(task_id);
            """,
            """
            CREATE TABLE IF NOT EXISTS checkpoints (
                id INT PRIMARY KEY DEFAULT 1,
                cycle_count INT DEFAULT 0,
                state JSONB,
                timestamp TIMESTAMPTZ DEFAULT NOW()
            );
            """,
        ]
        for migration in migrations:
            async with self._get_connection() as conn:
                await conn.execute(migration)
        logger.info("Database migrations completed")

    async def _retry(self, func, *args, **kwargs):
        for attempt in range(self.max_retries):
            try:
                return await func(*args, **kwargs)
            except (asyncpg.PostgresConnectionError, asyncpg.InterfaceError):
                if attempt == self.max_retries - 1:
                    raise
                await asyncio.sleep(0.5 * (2**attempt))
                logger.warning(
                    f"DB operation failed, retry {attempt + 1}/{self.max_retries}"
                )

    async def save_task(self, task):
        async def _do():
            async with self._get_connection() as conn:
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
                        artifacts = EXCLUDED.artifacts,
                        updated_at = NOW()
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

        await self._retry(_do)

    async def get_task(self, task_id: str) -> Optional[dict]:
        async def _do():
            async with self._get_connection() as conn:
                return await conn.fetchrow(
                    "SELECT * FROM task_history WHERE task_id = $1", task_id
                )

        return await self._retry(_do)

    async def get_tasks_by_status(self, status: str) -> list:
        async def _do():
            async with self._get_connection() as conn:
                return await conn.fetch(
                    "SELECT * FROM task_history WHERE status = $1 ORDER BY assigned_at DESC",
                    status,
                )

        return await self._retry(_do)

    async def get_recent_tasks(self, limit: int = 20) -> list:
        async def _do():
            async with self._get_connection() as conn:
                return await conn.fetch(
                    "SELECT * FROM task_history ORDER BY assigned_at DESC LIMIT $1",
                    limit,
                )

        return await self._retry(_do)

    async def save_error(self, error):
        async def _do():
            async with self._get_connection() as conn:
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

        await self._retry(_do)

    async def save_decision(self, decision):
        async def _do():
            async with self._get_connection() as conn:
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

        await self._retry(_do)

    async def save_cycle_metrics(self, metrics):
        async def _do():
            async with self._get_connection() as conn:
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

        await self._retry(_do)

    async def store_experience(self, experience: dict):
        async def _do():
            async with self._get_connection() as conn:
                await conn.execute(
                    """
                    INSERT INTO experiences
                    (task_id, title, result, review, deploy, text)
                    VALUES ($1, $2, $3, $4, $5, $6)
                    """,
                    experience.get("task_id", ""),
                    experience.get("title", ""),
                    json.dumps(experience.get("result", {})),
                    json.dumps(experience.get("review", {})),
                    json.dumps(experience.get("deploy", {})),
                    experience.get("text", ""),
                )

        await self._retry(_do)

    async def save_checkpoint(self, cycle_count: int, state: dict):
        async def _do():
            async with self._get_connection() as conn:
                await conn.execute(
                    """
                    INSERT INTO checkpoints (id, cycle_count, state, timestamp)
                    VALUES (1, $1, $2, NOW())
                    ON CONFLICT (id) DO UPDATE SET
                        cycle_count = EXCLUDED.cycle_count,
                        state = EXCLUDED.state,
                        timestamp = NOW()
                    """,
                    cycle_count,
                    json.dumps(state),
                )

        await self._retry(_do)

    async def load_checkpoint(self) -> Optional[dict]:
        async def _do():
            async with self._get_connection() as conn:
                row = await conn.fetchrow("SELECT * FROM checkpoints WHERE id = 1")
                return row

        return await self._retry(_do)

    async def get_stats(self) -> dict:
        async def _do():
            async with self._get_connection() as conn:
                total = await conn.fetchval("SELECT COUNT(*) FROM task_history")
                completed = await conn.fetchval(
                    "SELECT COUNT(*) FROM task_history WHERE status = 'completed'"
                )
                failed = await conn.fetchval(
                    "SELECT COUNT(*) FROM task_history WHERE status = 'failed'"
                )
                in_progress = await conn.fetchval(
                    "SELECT COUNT(*) FROM task_history WHERE status = 'in_progress'"
                )
                errors = await conn.fetchval("SELECT COUNT(*) FROM error_solutions")
                decisions = await conn.fetchval("SELECT COUNT(*) FROM decisions")
                cycles = await conn.fetchval("SELECT COUNT(*) FROM cycle_metrics")
                experiences = await conn.fetchval("SELECT COUNT(*) FROM experiences")
                return {
                    "total_tasks": total,
                    "completed_tasks": completed,
                    "failed_tasks": failed,
                    "in_progress_tasks": in_progress,
                    "error_solutions": errors,
                    "decisions_made": decisions,
                    "cycles_completed": cycles,
                    "experiences_stored": experiences,
                }

        return await self._retry(_do)

    async def shutdown(self):
        if self._pool:
            await self._pool.close()
            logger.info("PostgreSQL connection pool closed")
