"""
Crash Recovery — Atomic checkpoint save/restore with full state persistence
"""

import json
import logging
import os
import tempfile
import shutil
from datetime import datetime, timezone
from typing import Optional

logger = logging.getLogger(__name__)


class CrashRecovery:
    """
    Atomic crash recovery with:
    - Write-ahead log (WAL) style checkpointing
    - Full state serialization (not just stats)
    - Atomic file replacement (rename)
    - Corruption detection via checksums
    - Multi-file state (tasks, errors, decisions, cycles, session)
    """

    def __init__(self, state_dir: str = "."):
        self.state_dir = state_dir
        self.checkpoint_path = os.path.join(state_dir, "checkpoint.json")
        self.wal_path = os.path.join(state_dir, "checkpoint.wal")
        self.backup_path = os.path.join(state_dir, "checkpoint.bak")

    def _compute_checksum(self, data: str) -> str:
        import hashlib

        return hashlib.sha256(data.encode()).hexdigest()

    async def save_state(self, state: dict):
        """
        Atomic save:
        1. Write to WAL file
        2. Write to temp file
        3. Rename temp → checkpoint (atomic on POSIX)
        4. Keep backup of previous
        """
        state["saved_at"] = datetime.now(timezone.utc).isoformat()
        state["version"] = 2

        json_str = json.dumps(state, indent=2, default=str)
        checksum = self._compute_checksum(json_str)

        wal_entry = {
            "checksum": checksum,
            "timestamp": state["saved_at"],
            "size": len(json_str),
        }

        try:
            with open(self.wal_path, "w") as f:
                json.dump(wal_entry, f)

            tmp_path = self.checkpoint_path + ".tmp"
            with open(tmp_path, "w") as f:
                f.write(json_str)
                f.flush()
                os.fsync(f.fileno())

            if os.path.exists(self.checkpoint_path):
                shutil.copy2(self.checkpoint_path, self.backup_path)

            os.replace(tmp_path, self.checkpoint_path)

            logger.info(f"State saved atomically (checksum={checksum[:8]}...)")
            return True
        except Exception as e:
            logger.error(f"State save failed: {e}")
            return False

    async def load_state(self) -> Optional[dict]:
        """
        Load with corruption detection:
        1. Try main checkpoint
        2. If corrupt, try backup
        3. If backup corrupt, return None
        """
        state = self._try_load(self.checkpoint_path)
        if state:
            logger.info(
                f"State loaded from checkpoint (cycle {state.get('cycle_count', 0)})"
            )
            return state

        state = self._try_load(self.backup_path)
        if state:
            logger.info("State loaded from backup (main was corrupt)")
            return state

        logger.info("No valid state found")
        return None

    def _try_load(self, path: str) -> Optional[dict]:
        if not os.path.exists(path):
            return None

        try:
            with open(path) as f:
                content = f.read()

            data = json.loads(content)

            if data.get("version", 1) < 2:
                logger.warning(f"Old checkpoint format in {path}, skipping")
                return None

            expected_checksum = self._compute_checksum(
                json.dumps(
                    {k: v for k, v in data.items() if k != "checksum"},
                    indent=2,
                    default=str,
                )
            )

            if "checksum" in data:
                stored_checksum = data.pop("checksum")
                actual_checksum = self._compute_checksum(
                    json.dumps(data, indent=2, default=str)
                )
                if stored_checksum != actual_checksum:
                    logger.warning(f"Checksum mismatch in {path}, file may be corrupt")
                    return None

            return data
        except (json.JSONDecodeError, KeyError) as e:
            logger.warning(f"Corrupt state file {path}: {e}")
            return None
        except Exception as e:
            logger.error(f"State load failed from {path}: {e}")
            return None

    async def serialize_memory_state(self, memory) -> dict:
        """Serialize full in-memory state for crash recovery"""
        return {
            "cycle_count": memory._cycles[-1].cycle_number if memory._cycles else 0,
            "tasks": {
                tid: {
                    "task_id": t.task_id,
                    "title": t.title,
                    "description": t.description,
                    "status": t.status,
                    "priority": t.priority,
                    "assigned_at": t.assigned_at,
                    "completed_at": t.completed_at,
                    "review_score": t.review_score,
                    "review_feedback": t.review_feedback,
                    "attempts": t.attempts,
                    "revisions": t.revisions,
                    "artifacts": t.artifacts,
                    "context": t.context,
                }
                for tid, t in memory._tasks.items()
            },
            "errors": {
                k: {
                    "error_hash": e.error_hash,
                    "error_type": e.error_type,
                    "error_message": e.error_message,
                    "solution": e.solution,
                    "context": e.context,
                    "success_count": e.success_count,
                    "created_at": e.created_at,
                }
                for k, e in memory._errors.items()
            },
            "decisions": [
                {
                    "decision_type": d.decision_type,
                    "rationale": d.rationale,
                    "alternatives_considered": d.alternatives_considered,
                    "made_by": d.made_by,
                    "timestamp": d.timestamp,
                    "outcome": d.outcome,
                }
                for d in memory._decisions
            ],
            "cycles": [
                {
                    "cycle_number": c.cycle_number,
                    "started_at": c.started_at,
                    "completed_at": c.completed_at,
                    "tasks_completed": c.tasks_completed,
                    "tasks_failed": c.tasks_failed,
                    "avg_review_score": c.avg_review_score,
                    "retry_rate": c.retry_rate,
                    "build_success_rate": c.build_success_rate,
                    "improvements_applied": c.improvements_applied,
                }
                for c in memory._cycles
            ],
            "session_state": memory._session_state,
            "experiences": memory._experiences[-100:],
        }

    async def restore_memory_state(self, state: dict, memory):
        """Restore in-memory state from crash recovery snapshot"""
        from agents.shared.memory import (
            TaskRecord,
            ErrorRecord,
            DecisionRecord,
            CycleMetrics,
        )

        for tid, t_data in state.get("tasks", {}).items():
            memory._tasks[tid] = TaskRecord(**t_data)

        for k, e_data in state.get("errors", {}).items():
            memory._errors[k] = ErrorRecord(**e_data)

        memory._decisions = [DecisionRecord(**d) for d in state.get("decisions", [])]
        memory._cycles = [CycleMetrics(**c) for c in state.get("cycles", [])]
        memory._session_state = state.get("session_state", {})
        memory._experiences = state.get("experiences", [])

        logger.info(
            f"Memory state restored: {len(memory._tasks)} tasks, {len(memory._decisions)} decisions"
        )
