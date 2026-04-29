"""
Integration tests for new production modules
"""

import asyncio
import pytest
import sys
import os
import time

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from agents.shared.circuit_breaker import (
    CircuitBreaker,
    CircuitBreakerRegistry,
    CircuitBreakerOpenError,
    CircuitState,
)
from agents.shared.worker_pool import WorkerPool, ConcurrentTaskRunner
from agents.shared.llm_client import LLMClient, LLMConfig
from monitoring.observability import MetricsCollector, Tracer, StructuredFormatter
from config.schema import validate_config, AppConfigSchema


class TestCircuitBreaker:
    def test_starts_closed(self):
        cb = CircuitBreaker("test", failure_threshold=3)
        assert cb.state == CircuitState.CLOSED
        assert cb.can_execute() is True

    def test_opens_after_threshold(self):
        cb = CircuitBreaker("test", failure_threshold=3)
        for i in range(3):
            cb.record_failure("error")
        assert cb.state == CircuitState.OPEN
        assert cb.can_execute() is False

    def test_half_open_after_timeout(self):
        cb = CircuitBreaker("test", failure_threshold=2, recovery_timeout=0.1)
        cb.record_failure("e1")
        cb.record_failure("e2")
        assert cb.state == CircuitState.OPEN

        time.sleep(0.15)
        assert cb.state == CircuitState.HALF_OPEN
        assert cb.can_execute() is True

    def test_closes_after_successes(self):
        cb = CircuitBreaker(
            "test", failure_threshold=2, success_threshold=2, recovery_timeout=0.1
        )
        cb.record_failure("e1")
        cb.record_failure("e2")
        assert cb.state == CircuitState.OPEN

        time.sleep(0.15)
        assert cb.state == CircuitState.HALF_OPEN

        cb.record_success()
        cb.record_success()
        assert cb.state == CircuitState.CLOSED

    def test_reopens_on_half_open_failure(self):
        cb = CircuitBreaker("test", failure_threshold=2, recovery_timeout=0.1)
        cb.record_failure("e1")
        cb.record_failure("e2")
        time.sleep(0.15)
        assert cb.state == CircuitState.HALF_OPEN

        cb.record_failure("e3")
        assert cb.state == CircuitState.OPEN

    def test_execute_raises_on_open(self):
        cb = CircuitBreaker("test", failure_threshold=1)
        cb.record_failure("e1")

        async def dummy():
            return "ok"

        with pytest.raises(CircuitBreakerOpenError):
            asyncio.get_event_loop().run_until_complete(cb.execute(dummy))

    def test_execute_records_success(self):
        cb = CircuitBreaker("test")

        async def dummy():
            return 42

        result = asyncio.get_event_loop().run_until_complete(cb.execute(dummy))
        assert result == 42
        assert cb._stats.total_successes == 1

    def test_registry_manages_multiple(self):
        reg = CircuitBreakerRegistry()
        cb1 = reg.get_or_create("git")
        cb2 = reg.get_or_create("npm")
        assert cb1 is not cb2
        assert cb1.name == "git"
        assert cb2.name == "npm"

    def test_get_all_status(self):
        reg = CircuitBreakerRegistry()
        reg.get_or_create("git")
        reg.get_or_create("npm")
        status = reg.get_all_status()
        assert len(status) == 2

    def test_reset_all(self):
        reg = CircuitBreakerRegistry()
        cb = reg.get_or_create("test", failure_threshold=1)
        cb.record_failure("e1")
        assert cb.state == CircuitState.OPEN
        reg.reset_all()
        assert cb.state == CircuitState.CLOSED


class TestWorkerPool:
    @pytest.mark.asyncio
    async def test_concurrent_runner_processes_tasks(self):
        runner = ConcurrentTaskRunner(batch_size=3)

        async def task_fn(task):
            await asyncio.sleep(0.01)
            return {"done": task["id"]}

        tasks = [{"id": i} for i in range(5)]
        results = await runner.run(tasks, task_fn)

        assert len(results) == 5
        assert all(r["success"] for r in results)

    @pytest.mark.asyncio
    async def test_concurrent_runner_handles_failures(self):
        runner = ConcurrentTaskRunner(batch_size=2)

        async def task_fn(task):
            if task.get("fail"):
                raise ValueError("intentional failure")
            return {"done": task["id"]}

        tasks = [{"id": 1}, {"id": 2, "fail": True}, {"id": 3}]
        results = await runner.run(tasks, task_fn)

        successes = sum(1 for r in results if r.get("success"))
        failures = sum(1 for r in results if not r.get("success"))
        assert successes == 2
        assert failures == 1

    @pytest.mark.asyncio
    async def test_worker_pool_starts_and_shuts_down(self):
        pool = WorkerPool(max_workers=2)
        await pool.start()
        await pool.shutdown()
        assert len(pool._workers) == 0


class TestLLMClient:
    def test_template_fallback_code_generation(self):
        client = LLMClient(LLMConfig())
        result = client._template_generate(
            {"task_id": "T1", "description": "Add logging"},
            "",
        )
        assert "T1" in result
        assert "Add logging" in result

    def test_template_fallback_review(self):
        client = LLMClient(LLMConfig())
        result = client._template_review("def hello(): pass", {"title": "Test"})
        assert "score" in result
        assert "feedback" in result

    def test_template_fallback_fix(self):
        client = LLMClient(LLMConfig())
        result = client._template_fix("SyntaxError", "code", {"title": "Fix"})
        assert "SyntaxError" in result

    def test_usage_stats(self):
        client = LLMClient(LLMConfig())
        stats = client.get_usage_stats()
        assert "total_tokens" in stats
        assert "total_calls" in stats

    def test_no_api_key_uses_template(self):
        client = LLMClient(LLMConfig())
        assert client._use_api is False


class TestMetricsCollector:
    def test_increment_counter(self):
        mc = MetricsCollector()
        mc.increment("requests.total")
        mc.increment("requests.total")
        points = mc.get_all()
        total = sum(p.value for p in points if p.name == "requests.total")
        assert total == 2

    def test_set_gauge(self):
        mc = MetricsCollector()
        mc.set_gauge("cpu.usage", 75.5)
        points = mc.get_all()
        gauge = [p for p in points if p.name == "cpu.usage"]
        assert len(gauge) == 1
        assert gauge[0].value == 75.5

    def test_histogram_observation(self):
        mc = MetricsCollector()
        for v in [1.0, 2.0, 3.0, 4.0, 5.0]:
            mc.observe("response_time", v)
        summary = mc.histogram_summary("response_time")
        assert summary["count"] == 5
        assert summary["avg"] == 3.0
        assert summary["p50"] == 3.0

    def test_prometheus_format(self):
        mc = MetricsCollector()
        mc.increment("http_requests", labels={"method": "GET"})
        mc.set_gauge("active_connections", 10)
        output = mc.prometheus_format()
        assert 'http_requests{method="GET"}' in output
        assert "active_connections 10" in output

    def test_labels_isolation(self):
        mc = MetricsCollector()
        mc.increment("requests", labels={"method": "GET"})
        mc.increment("requests", labels={"method": "POST"})
        points = mc.get_all()
        assert len(points) == 2


class TestTracer:
    def test_start_and_end_span(self):
        t = Tracer()
        span_id = t.start_span("test_operation")
        time.sleep(0.01)
        t.end_span(span_id, "ok", {"result": "success"})

        spans = t.get_recent_spans()
        assert len(spans) == 1
        assert spans[0]["status"] == "ok"
        assert spans[0]["duration_seconds"] > 0

    def test_parent_child_spans(self):
        t = Tracer()
        parent_id = t.start_span("parent")
        child_id = t.start_span("child", parent_id=parent_id)
        t.end_span(child_id, "ok")
        t.end_span(parent_id, "ok")

        spans = t.get_recent_spans()
        child = [s for s in spans if s["name"] == "child"][0]
        assert child["parent_id"] == parent_id

    def test_trace_summary(self):
        t = Tracer()
        for i in range(5):
            sid = t.start_span(f"op_{i}")
            t.end_span(sid, "ok" if i < 4 else "error")

        summary = t.get_trace_summary()
        assert summary["total_spans"] == 5
        assert summary["ok"] == 4
        assert summary["error"] == 1


class TestSelfImprovementTuning:
    @pytest.mark.asyncio
    async def test_param_tuning_review_threshold(self):
        from agents.hermes.self_improvement import SelfImprovementLoop
        from agents.shared.memory import MemoryManager, CycleMetrics

        si = SelfImprovementLoop()
        memory = MemoryManager(use_database=False)

        for i in range(5):
            await memory.save_cycle_metrics(
                CycleMetrics(
                    cycle_number=i,
                    started_at="2026-04-16T00:00:00+00:00",
                    completed_at="2026-04-16T00:01:00+00:00",
                    tasks_completed=2,
                    tasks_failed=3,
                    avg_review_score=50,
                    retry_rate=0.4,
                    build_success_rate=0.95,
                )
            )

        improvements = await si.evaluate(memory)
        params = si.get_tuned_params()

        assert len(improvements) > 0
        assert params["review_threshold"] < 75

    @pytest.mark.asyncio
    async def test_param_tuning_excellent_performance(self):
        from agents.hermes.self_improvement import SelfImprovementLoop
        from agents.shared.memory import MemoryManager, CycleMetrics

        si = SelfImprovementLoop()
        memory = MemoryManager(use_database=False)

        for i in range(5):
            await memory.save_cycle_metrics(
                CycleMetrics(
                    cycle_number=i,
                    started_at="2026-04-16T00:00:00+00:00",
                    completed_at="2026-04-16T00:01:00+00:00",
                    tasks_completed=10,
                    tasks_failed=0,
                    avg_review_score=92,
                    retry_rate=0.0,
                    build_success_rate=1.0,
                    improvements_applied=[],
                )
            )

        improvements = await si.evaluate(memory)
        params = si.get_tuned_params()

        assert params["max_tasks_per_cycle"] > 5
        assert params["review_threshold"] > 75


class TestConfigSchema:
    def test_valid_config(self):
        raw = {
            "system": {"name": "test", "version": "1.0.0", "log_level": "INFO"},
            "hermes": {"cycle_interval_seconds": 300, "review_threshold": 75},
        }
        is_valid, errors = validate_config(raw)
        assert is_valid is True

    def test_invalid_log_level(self):
        raw = {
            "system": {"name": "test", "version": "1.0.0", "log_level": "INVALID"},
        }
        is_valid, errors = validate_config(raw)
        assert is_valid is False

    def test_invalid_version_format(self):
        raw = {
            "system": {"name": "test", "version": "abc"},
        }
        is_valid, errors = validate_config(raw)
        assert is_valid is False

    def test_out_of_range_values(self):
        raw = {
            "hermes": {"cycle_interval_seconds": 1},
        }
        is_valid, errors = validate_config(raw)
        assert is_valid is False


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
