"""
Tests for the autonomous development system
"""

import asyncio
import pytest
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from agents.shared.message_bus import MessageBus, Message, MessagePayload, MessageType
from agents.shared.memory import MemoryManager, TaskRecord, ErrorRecord, DecisionRecord
from agents.shared.security import SecurityGuard, SecurityViolation


class TestMessageBus:
    @pytest.fixture
    def bus(self):
        return MessageBus(use_redis=False)

    @pytest.mark.asyncio
    async def test_send_and_receive(self, bus):
        received = []

        async def handler(msg):
            received.append(msg)

        bus.subscribe("clawbot", handler)

        msg = Message(
            from_agent="hermes",
            to_agent="clawbot",
            type=MessageType.TASK_ASSIGN.value,
            payload=MessagePayload(
                task_id="TASK-001",
                title="Test task",
                description="A test task",
                priority=1,
            ),
        )

        await bus.send(msg)
        assert len(received) == 1
        assert received[0].payload.task_id == "TASK-001"

    @pytest.mark.asyncio
    async def test_message_serialization(self):
        msg = Message(
            from_agent="hermes",
            to_agent="clawbot",
            type=MessageType.TASK_ASSIGN.value,
            payload=MessagePayload(
                task_id="TASK-001",
                title="Test",
                priority=1,
            ),
        )

        json_str = msg.to_json()
        restored = Message.from_json(json_str)

        assert restored.message_id == msg.message_id
        assert restored.payload.task_id == "TASK-001"
        assert restored.from_agent == "hermes"

    @pytest.mark.asyncio
    async def test_acknowledge(self, bus):
        msg = Message(
            from_agent="hermes",
            to_agent="clawbot",
            type=MessageType.TASK_ASSIGN.value,
            payload=MessagePayload(task_id="TASK-001"),
        )

        await bus.send(msg)
        assert len(bus.get_pending_acks()) == 1

        await bus.acknowledge(msg.message_id)
        assert len(bus.get_pending_acks()) == 0


class TestMemoryManager:
    @pytest.fixture
    def memory(self):
        return MemoryManager(use_database=False)

    @pytest.mark.asyncio
    async def test_save_and_get_task(self, memory):
        task = TaskRecord(
            task_id="TASK-001",
            title="Test task",
            description="A test",
            status="pending",
            priority=1,
            assigned_at="2026-04-16T00:00:00",
        )

        await memory.save_task(task)
        retrieved = await memory.get_task("TASK-001")

        assert retrieved is not None
        assert retrieved.title == "Test task"
        assert retrieved.status == "pending"

    @pytest.mark.asyncio
    async def test_get_tasks_by_status(self, memory):
        for i in range(5):
            await memory.save_task(
                TaskRecord(
                    task_id=f"TASK-{i:03d}",
                    title=f"Task {i}",
                    description="",
                    status="completed" if i < 3 else "failed",
                    priority=1,
                    assigned_at="2026-04-16T00:00:00",
                )
            )

        completed = await memory.get_tasks_by_status("completed")
        failed = await memory.get_tasks_by_status("failed")

        assert len(completed) == 3
        assert len(failed) == 2

    @pytest.mark.asyncio
    async def test_error_storage(self, memory):
        error = ErrorRecord(
            error_hash="abc123",
            error_type="build_error",
            error_message="Cannot find module",
            solution="Install the module",
        )

        await memory.save_error(error)
        found = await memory.find_similar_error("Cannot find module")

        assert found is not None
        assert found.solution == "Install the module"

    @pytest.mark.asyncio
    async def test_session_state(self, memory):
        await memory.set_session_state("current_cycle", 5)
        value = await memory.get_session_state("current_cycle")
        assert value == 5

    @pytest.mark.asyncio
    async def test_stats(self, memory):
        await memory.save_task(
            TaskRecord(
                task_id="TASK-001",
                title="Test",
                description="",
                status="completed",
                priority=1,
                assigned_at="2026-04-16T00:00:00",
            )
        )

        stats = memory.get_stats()
        assert stats["total_tasks"] == 1
        assert stats["completed_tasks"] == 1


class TestSecurityGuard:
    @pytest.fixture
    def guard(self):
        return SecurityGuard()

    def test_validate_safe_plan(self, guard):
        plan = {
            "tasks": [
                {
                    "task_id": "TASK-001",
                    "title": "Add feature",
                    "description": "Add a new feature to the app",
                }
            ]
        }

        is_safe, violations = guard.validate_plan(plan)
        assert is_safe is True
        assert len(violations) == 0

    def test_validate_dangerous_plan(self, guard):
        plan = {
            "tasks": [
                {
                    "task_id": "TASK-001",
                    "title": "Delete data",
                    "description": "Run DROP TABLE users",
                }
            ]
        }

        is_safe, violations = guard.validate_plan(plan)
        assert is_safe is False
        assert len(violations) > 0

    def test_validate_code_with_secrets(self, guard):
        code = """
API_KEY = "sk-abcdefghijklmnopqrstuvwxyz123456"
password = "mysecretpassword123"
"""
        is_safe, violations = guard.validate_code(code, "config.py")
        assert is_safe is False

    def test_validate_clean_code(self, guard):
        code = """
def hello():
    print("Hello, world!")
"""
        is_safe, violations = guard.validate_code(code, "hello.py")
        assert is_safe is True

    def test_rate_limit(self, guard):
        # First 20 should pass
        for i in range(20):
            ok, _ = guard.check_rate_limit("git_push")
            assert ok is True

        # 21st should fail
        ok, msg = guard.check_rate_limit("git_push")
        assert ok is False
        assert "Rate limit exceeded" in msg

    def test_infinite_loop_detection(self, guard):
        # Same task repeated 5 times in last 10
        recent = ["TASK-001"] * 5 + [
            "TASK-002",
            "TASK-003",
            "TASK-004",
            "TASK-005",
            "TASK-006",
        ]
        assert guard.detect_infinite_loop(recent) is True

        # Normal distribution
        recent = [f"TASK-{i:03d}" for i in range(10)]
        assert guard.detect_infinite_loop(recent) is False


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
