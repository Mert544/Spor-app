"""
Tests for all agent modules — Hermes, Clawbot, and shared infrastructure
"""

import asyncio
import pytest
import sys
import os
import tempfile
import json

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from agents.shared.message_bus import MessageBus, Message, MessagePayload, MessageType
from agents.shared.memory import MemoryManager, TaskRecord, ErrorRecord, DecisionRecord
from agents.shared.security import SecurityGuard, SecurityViolation
from agents.hermes.analyzer import CodebaseAnalyzer
from agents.hermes.planner import TaskPlanner
from agents.hermes.reviewer import CodeReviewer
from agents.hermes.self_improvement import SelfImprovementLoop
from agents.hermes.strategist import HermesAgent
from agents.clawbot.builder import ClawbotBuilder
from agents.clawbot.deployer import ClawbotDeployer
from agents.clawbot.fixer import ClawbotFixer
from agents.clawbot.tester import ClawbotTester
from config.config import load_config, AppConfig


class TestCodebaseAnalyzer:
    @pytest.fixture
    def analyzer(self):
        return CodebaseAnalyzer(
            os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        )

    @pytest.mark.asyncio
    async def test_analyze_returns_summary(self, analyzer):
        result = await analyzer.analyze()
        assert "summary" in result
        assert "total_files" in result["summary"]
        assert "total_lines" in result["summary"]
        assert "languages" in result["summary"]

    @pytest.mark.asyncio
    async def test_analyze_counters_reset_between_calls(self, analyzer):
        result1 = await analyzer.analyze()
        result2 = await analyzer.analyze()
        assert result1["summary"]["total_files"] == result2["summary"]["total_files"]
        assert result1["summary"]["total_lines"] == result2["summary"]["total_lines"]

    @pytest.mark.asyncio
    async def test_analyze_detects_languages(self, analyzer):
        result = await analyzer.analyze()
        langs = result["summary"]["languages"]
        assert ".py" in langs

    @pytest.mark.asyncio
    async def test_analyze_returns_recommendations(self, analyzer):
        result = await analyzer.analyze()
        assert "recommendations" in result
        assert isinstance(result["recommendations"], list)

    @pytest.mark.asyncio
    async def test_analyze_returns_tech_debt(self, analyzer):
        result = await analyzer.analyze()
        assert "tech_debt" in result
        assert "estimated_hours" in result["tech_debt"]


class TestTaskPlanner:
    @pytest.fixture
    def planner(self):
        return TaskPlanner()

    def test_create_plan_generates_tasks(self, planner):
        analysis = {
            "summary": {
                "total_files": 10,
                "total_lines": 500,
                "languages": {".py": 5, ".js": 5},
                "quality_score": 60,
                "test_coverage": 20,
                "tech_debt_hours": 5,
                "dependency_issues": 0,
            },
            "recommendations": [
                {
                    "priority": 1,
                    "type": "test_coverage",
                    "description": "Test coverage düşük",
                },
            ],
        }
        plan = planner.create_plan(analysis)
        assert "tasks" in plan
        assert "rationale" in plan

    def test_deduplication_prevents_duplicate_tasks(self, planner):
        analysis = {
            "summary": {
                "total_files": 10,
                "total_lines": 500,
                "languages": {".py": 10},
                "quality_score": 60,
                "test_coverage": 20,
                "tech_debt_hours": 5,
                "dependency_issues": 0,
            },
            "recommendations": [
                {"priority": 1, "type": "test_coverage", "description": "Add tests"},
            ],
        }
        completed = {("test_coverage", ("file1.py",))}
        plan = planner.create_plan(analysis, completed)
        for task in plan.get("tasks", []):
            assert task.get("category") != "test_coverage" or "file1.py" not in str(
                task.get("files_affected", [])
            )

    def test_mark_completed_adds_to_dedup(self, planner):
        planner.mark_completed("TASK-001", ["file1.py"], "test_coverage")
        key = ("test_coverage", ("file1.py",))
        assert key in planner._completed_tasks

    def test_priority_ordering(self, planner):
        analysis = {
            "summary": {
                "total_files": 10,
                "total_lines": 500,
                "languages": {".py": 10},
                "quality_score": 40,
                "test_coverage": 10,
                "tech_debt_hours": 20,
                "dependency_issues": 3,
            },
            "recommendations": [
                {"priority": 1, "type": "code_quality", "description": "Low quality"},
                {"priority": 2, "type": "tech_debt", "description": "High debt"},
            ],
        }
        plan = planner.create_plan(analysis)
        tasks = plan.get("tasks", [])
        if len(tasks) >= 2:
            assert tasks[0].get("priority", 99) <= tasks[1].get("priority", 99)


class TestCodeReviewer:
    @pytest.fixture
    def reviewer(self):
        return CodeReviewer()

    def test_review_scores_build_success(self, reviewer):
        result = {
            "artifacts": {
                "build_success": True,
                "build_time_seconds": 5,
                "files_changed": ["file1.py"],
            }
        }
        review = reviewer.review("TASK-001", result)
        assert "score" in review
        assert "criteria_scores" in review

    def test_review_penalizes_build_failure(self, reviewer):
        result = {
            "artifacts": {
                "build_success": False,
                "build_time_seconds": 5,
                "files_changed": [],
            }
        }
        review = reviewer.review("TASK-001", result)
        assert review["score"] < 60

    def test_review_scores_security_clean(self, reviewer):
        result = {
            "artifacts": {
                "build_success": True,
                "security_scan": {"violations": []},
                "files_changed": ["file1.py"],
            }
        }
        review = reviewer.review("TASK-001", result)
        security_score = review["criteria_scores"].get("security", 0)
        assert security_score >= 80

    def test_review_penalizes_security_violations(self, reviewer):
        result = {
            "artifacts": {
                "build_success": True,
                "security_scan": {"critical": 1},
                "files_changed": ["file1.py"],
            }
        }
        review = reviewer.review("TASK-001", result)
        security_score = review["criteria_scores"].get("security", 100)
        assert security_score == 0

    def test_review_passed_flag(self, reviewer):
        result = {
            "artifacts": {
                "build_success": True,
                "files_changed": ["file1.py"],
            }
        }
        review = reviewer.review("TASK-001", result)
        assert "passed" in review
        assert isinstance(review["passed"], bool)


class TestSelfImprovementLoop:
    @pytest.fixture
    def improvement(self):
        return SelfImprovementLoop()

    @pytest.mark.asyncio
    async def test_evaluate_returns_list(self, improvement):
        memory = MemoryManager(use_database=False)
        results = await improvement.evaluate(memory)
        assert isinstance(results, list)


class TestClawbotBuilder:
    @pytest.fixture
    def builder(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            subprocess_init(tmpdir)
            b = ClawbotBuilder(tmpdir)
            yield b

    @pytest.mark.asyncio
    async def test_execute_task_creates_tracking_file(self, builder):
        task = {
            "task_id": "TASK-TEST-001",
            "title": "Test task",
            "description": "A test task for builder",
            "files_affected": [],
            "branch": "task/test-001",
        }
        result = await builder.execute_task(task)
        assert result["status"] in ("completed", "failed")
        assert ".autonomous" in str(
            result.get("artifacts", {}).get("files_changed", [])
        )

    @pytest.mark.asyncio
    async def test_execute_task_failed_status_on_no_git(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            b = ClawbotBuilder(tmpdir)
            task = {
                "task_id": "TASK-TEST-002",
                "title": "Test",
                "description": "No git repo",
                "files_affected": [],
                "branch": "task/test",
            }
            result = await b.execute_task(task)
            # Without git, build should still succeed (graceful degradation)
            # but no commit hash should be present
            assert result["status"] == "completed"
            assert result["artifacts"]["commit_hash"].startswith("no_commit")

    def test_security_guard_integration(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            subprocess_init(tmpdir)
            b = ClawbotBuilder(tmpdir)
            guard = SecurityGuard()
            b.set_security_guard(guard)
            assert b._security is guard


class TestClawbotDeployer:
    @pytest.mark.asyncio
    async def test_deploy_no_target_returns_failure(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            deployer = ClawbotDeployer(tmpdir)
            result = await deployer.deploy("TASK-001", {"artifacts": {}})
            assert result["success"] is False
            assert "No deployment target" in result["log"]


class TestClawbotFixer:
    @pytest.fixture
    def fixer(self):
        return ClawbotFixer(".")

    def test_classify_error(self, fixer):
        error = "No module named 'xyz'"
        classification = fixer._classify_error(error)
        assert classification == "import_error"

    def test_classify_build_error(self, fixer):
        error = "npm ERR! code ELIFECYCLE\nbuild failed"
        classification = fixer._classify_error(error)
        assert classification == "build_error"

    def test_classify_unknown_error(self, fixer):
        error = "Something went wrong"
        classification = fixer._classify_error(error)
        assert classification == "unknown"


class TestClawbotTester:
    @pytest.fixture
    def tester(self):
        return ClawbotTester(".")

    @pytest.mark.asyncio
    async def test_run_tests_returns_result(self, tester):
        result = await tester.run_tests("TASK-001")
        assert "passed" in result
        assert "failed" in result
        assert "total" in result

    @pytest.mark.asyncio
    async def test_run_security_scan_returns_result(self, tester):
        result = await tester.run_security_scan()
        assert "critical" in result
        assert "details" in result


class TestConfigLoading:
    def test_load_config_returns_defaults(self):
        config = load_config("/nonexistent/path/agents.yaml")
        assert isinstance(config, AppConfig)
        assert config.hermes.review_threshold == 75
        assert config.clawbot.max_retries == 3

    def test_load_config_from_project(self):
        config_path = os.path.join(
            os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
            "config",
            "agents.yaml",
        )
        if os.path.exists(config_path):
            config = load_config(config_path)
            assert config.hermes.cycle_interval_seconds == 300
            assert config.security.secret_scan_enabled is True


class TestSecurityGuardEnforcement:
    def test_record_operation_enforces_rate_limit(self):
        guard = SecurityGuard()
        for i in range(20):
            ok, _ = guard.record_operation("git_push")
            assert ok is True

        ok, msg = guard.record_operation("git_push")
        assert ok is False
        assert "Rate limit exceeded" in msg


def subprocess_init(tmpdir):
    """Initialize a git repo in temp directory for builder tests"""
    import subprocess

    subprocess.run(["git", "init"], cwd=tmpdir, capture_output=True)
    subprocess.run(
        ["git", "config", "user.email", "test@test.com"],
        cwd=tmpdir,
        capture_output=True,
    )
    subprocess.run(
        ["git", "config", "user.name", "Test"], cwd=tmpdir, capture_output=True
    )


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
