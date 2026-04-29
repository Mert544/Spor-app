"""
FastAPI REST API — Monitoring, control, and metrics endpoint
"""

import logging
import asyncio
from datetime import datetime, timezone
from typing import Optional
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.responses import PlainTextResponse
from pydantic import BaseModel

logger = logging.getLogger(__name__)


class TaskCreateRequest(BaseModel):
    title: str
    description: str
    priority: int = 3
    category: str = "general"
    files_affected: list[str] = []


class TaskResponse(BaseModel):
    task_id: str
    title: str
    status: str
    priority: int
    review_score: int = 0
    attempts: int = 0


class SystemStatus(BaseModel):
    running: bool
    cycle_count: int
    tasks_completed: int
    tasks_failed: int
    avg_review_score: float
    uptime_seconds: int
    tuned_params: dict
    circuit_breakers: list[dict]


class PauseRequest(BaseModel):
    reason: str = "Manual pause by admin"


class ResumeRequest(BaseModel):
    pass


class APIController:
    """
    FastAPI application with endpoints for:
    - System status and control
    - Metrics (Prometheus format)
    - Task management
    - Circuit breaker status
    - Rollback operations
    """

    def __init__(self):
        self.app = None
        self.supervisor = None
        self.metrics_collector = None
        self.tracer = None
        self.circuit_registry = None
        self._start_time = datetime.now(timezone.utc)

    def initialize(
        self,
        supervisor,
        metrics_collector=None,
        tracer=None,
        circuit_registry=None,
    ):
        self.supervisor = supervisor
        self.metrics_collector = metrics_collector
        self.tracer = tracer
        self.circuit_registry = circuit_registry

        @asynccontextmanager
        async def lifespan(app: FastAPI):
            logger.info("API server started")
            yield
            logger.info("API server stopped")

        self.app = FastAPI(
            title="Autonomous Dev System API",
            version="1.0.0",
            lifespan=lifespan,
        )

        self._register_routes()

    def _register_routes(self):
        @self.app.get("/")
        async def root():
            return {
                "service": "autonomous-dev",
                "version": "1.0.0",
                "status": "running" if self.supervisor._running else "stopped",
            }

        @self.app.get("/status", response_model=SystemStatus)
        async def get_status():
            if not self.supervisor:
                raise HTTPException(
                    status_code=503, detail="Supervisor not initialized"
                )

            stats = self.supervisor.memory.get_stats()
            uptime = int(
                (datetime.now(timezone.utc) - self._start_time).total_seconds()
            )

            tuned = {}
            if hasattr(self.supervisor.hermes.self_improvement, "get_tuned_params"):
                tuned = self.supervisor.hermes.self_improvement.get_tuned_params()

            cb_status = []
            if self.circuit_registry:
                cb_status = self.circuit_registry.get_all_status()

            return SystemStatus(
                running=self.supervisor._running,
                cycle_count=self.supervisor._cycle_count,
                tasks_completed=stats.get("completed_tasks", 0),
                tasks_failed=stats.get("failed_tasks", 0),
                avg_review_score=0.0,
                uptime_seconds=uptime,
                tuned_params=tuned,
                circuit_breakers=cb_status,
            )

        @self.app.get("/metrics")
        async def prometheus_metrics():
            if not self.metrics_collector:
                return PlainTextResponse("# No metrics collector configured\n")
            return PlainTextResponse(self.metrics_collector.prometheus_format())

        @self.app.get("/tasks")
        async def list_tasks(status: Optional[str] = None, limit: int = 50):
            if not self.supervisor:
                raise HTTPException(
                    status_code=503, detail="Supervisor not initialized"
                )

            if status:
                tasks = await self.supervisor.memory.get_tasks_by_status(status)
            else:
                tasks = await self.supervisor.memory.get_recent_tasks(limit)

            return [
                TaskResponse(
                    task_id=t.task_id,
                    title=t.title,
                    status=t.status,
                    priority=t.priority,
                    review_score=t.review_score,
                    attempts=t.attempts,
                )
                for t in tasks[:limit]
            ]

        @self.app.get("/tasks/{task_id}")
        async def get_task(task_id: str):
            if not self.supervisor:
                raise HTTPException(
                    status_code=503, detail="Supervisor not initialized"
                )

            task = await self.supervisor.memory.get_task(task_id)
            if not task:
                raise HTTPException(status_code=404, detail=f"Task {task_id} not found")

            return TaskResponse(
                task_id=task.task_id,
                title=task.title,
                status=task.status,
                priority=task.priority,
                review_score=task.review_score,
                attempts=task.attempts,
            )

        @self.app.post("/tasks", status_code=201)
        async def create_task(request: TaskCreateRequest):
            if not self.supervisor:
                raise HTTPException(
                    status_code=503, detail="Supervisor not initialized"
                )

            task_id = f"MANUAL-{datetime.now(timezone.utc).strftime('%Y%m%d%H%M%S')}"

            from agents.shared.memory import TaskRecord

            task = TaskRecord(
                task_id=task_id,
                title=request.title,
                description=request.description,
                status="pending",
                priority=request.priority,
                assigned_at=datetime.now(timezone.utc).isoformat(),
                context={
                    "category": request.category,
                    "files_affected": request.files_affected,
                },
            )
            await self.supervisor.memory.save_task(task)

            return {"task_id": task_id, "status": "pending"}

        @self.app.post("/pause")
        async def pause_system(request: PauseRequest):
            if not self.supervisor:
                raise HTTPException(
                    status_code=503, detail="Supervisor not initialized"
                )

            self.supervisor.security.record_violation(
                __import__("dataclasses").dataclass(
                    type(
                        "V",
                        (),
                        {
                            "severity": "high",
                            "rule": "admin_pause",
                            "description": request.reason,
                            "blocked_action": "system",
                        },
                    )
                )()
            )
            return {"status": "paused", "reason": request.reason}

        @self.app.post("/resume")
        async def resume_system(request: ResumeRequest = None):
            if not self.supervisor:
                raise HTTPException(
                    status_code=503, detail="Supervisor not initialized"
                )

            self.supervisor.security.resume_system()
            return {"status": "resumed"}

        @self.app.post("/cycle/run")
        async def run_single_cycle():
            if not self.supervisor:
                raise HTTPException(
                    status_code=503, detail="Supervisor not initialized"
                )

            result = await self.supervisor.hermes.run_cycle()
            return result

        @self.app.get("/circuits")
        async def get_circuit_breakers():
            if not self.circuit_registry:
                return {"circuits": []}
            return {"circuits": self.circuit_registry.get_all_status()}

        @self.app.post("/circuits/reset")
        async def reset_circuit_breakers():
            if not self.circuit_registry:
                raise HTTPException(
                    status_code=503, detail="Circuit registry not initialized"
                )
            self.circuit_registry.reset_all()
            return {"status": "all circuits reset"}

        @self.app.get("/self-improvement")
        async def get_self_improvement():
            if not self.supervisor:
                raise HTTPException(
                    status_code=503, detail="Supervisor not initialized"
                )

            si = self.supervisor.hermes.self_improvement
            return {
                "tuned_params": si.get_tuned_params(),
                "history": si.get_improvement_history()[-10:],
                "active": si.get_active_improvements(),
            }

        @self.app.get("/traces")
        async def get_traces(limit: int = 50):
            if not self.tracer:
                return {"traces": []}
            return {
                "summary": self.tracer.get_trace_summary(),
                "spans": self.tracer.get_recent_spans(limit),
            }

        @self.app.get("/security")
        async def get_security_status():
            if not self.supervisor:
                raise HTTPException(
                    status_code=503, detail="Supervisor not initialized"
                )
            return self.supervisor.security.get_stats()

        @self.app.get("/health")
        async def health_check():
            return {
                "status": "healthy",
                "uptime_seconds": int(
                    (datetime.now(timezone.utc) - self._start_time).total_seconds()
                ),
            }


api_controller = APIController()
