"""
Message Bus - Ajanlar arası asenkron iletişim katmanı
Redis Pub/Sub + Task Queue tabanlı mesajlaşma altyapısı
"""

import json
import uuid
import asyncio
import logging
from datetime import datetime, timezone
from typing import Callable, Optional, Any
from dataclasses import dataclass, field, asdict
from enum import Enum

logger = logging.getLogger(__name__)


class MessageType(Enum):
    # Task lifecycle
    TASK_ASSIGN = "task_assign"
    TASK_COMPLETE = "task_complete"
    TASK_FAILED = "task_failed"
    TASK_CANCEL = "task_cancel"

    # Review cycle
    REVIEW_REQUEST = "review_request"
    REVIEW_RESULT = "review_result"
    REVISION_REQUEST = "revision_request"

    # System
    BLOCKER_REPORT = "blocker_report"
    PROGRESS_UPDATE = "progress_update"
    SELF_IMPROVEMENT = "self_improvement"
    HEARTBEAT = "heartbeat"
    SYSTEM_ALERT = "system_alert"


@dataclass
class MessagePayload:
    task_id: str
    title: str = ""
    description: str = ""
    priority: int = 3
    acceptance_criteria: list = field(default_factory=list)
    files_affected: list = field(default_factory=list)
    branch: str = ""
    context: dict = field(default_factory=dict)
    error: str = ""
    score: int = 0
    feedback: str = ""
    artifacts: dict = field(default_factory=dict)
    metrics: dict = field(default_factory=dict)


@dataclass
class Message:
    message_id: str = field(default_factory=lambda: str(uuid.uuid4()))
    timestamp: str = field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat()
    )
    from_agent: str = ""
    to_agent: str = ""
    type: str = ""
    payload: MessagePayload = field(default_factory=lambda: MessagePayload(task_id=""))
    requires_ack: bool = True
    ttl_seconds: int = 3600
    retry_count: int = 0
    max_retries: int = 3

    def to_json(self) -> str:
        return json.dumps(
            {
                "message_id": self.message_id,
                "timestamp": self.timestamp,
                "from_agent": self.from_agent,
                "to_agent": self.to_agent,
                "type": self.type,
                "payload": {
                    "task_id": self.payload.task_id,
                    "title": self.payload.title,
                    "description": self.payload.description,
                    "priority": self.payload.priority,
                    "acceptance_criteria": self.payload.acceptance_criteria,
                    "files_affected": self.payload.files_affected,
                    "branch": self.payload.branch,
                    "context": self.payload.context,
                    "error": self.payload.error,
                    "score": self.payload.score,
                    "feedback": self.payload.feedback,
                    "artifacts": self.payload.artifacts,
                    "metrics": self.payload.metrics,
                },
                "requires_ack": self.requires_ack,
                "ttl_seconds": self.ttl_seconds,
                "retry_count": self.retry_count,
                "max_retries": self.max_retries,
            }
        )

    @classmethod
    def from_json(cls, json_str: str) -> "Message":
        data = json.loads(json_str)
        payload_data = data.get("payload", {})
        return cls(
            message_id=data.get("message_id", str(uuid.uuid4())),
            timestamp=data.get("timestamp", datetime.now(timezone.utc).isoformat()),
            from_agent=data.get("from_agent", ""),
            to_agent=data.get("to_agent", ""),
            type=data.get("type", ""),
            payload=MessagePayload(
                task_id=payload_data.get("task_id", ""),
                title=payload_data.get("title", ""),
                description=payload_data.get("description", ""),
                priority=payload_data.get("priority", 3),
                acceptance_criteria=payload_data.get("acceptance_criteria", []),
                files_affected=payload_data.get("files_affected", []),
                branch=payload_data.get("branch", ""),
                context=payload_data.get("context", {}),
                error=payload_data.get("error", ""),
                score=payload_data.get("score", 0),
                feedback=payload_data.get("feedback", ""),
                artifacts=payload_data.get("artifacts", {}),
                metrics=payload_data.get("metrics", {}),
            ),
            requires_ack=data.get("requires_ack", True),
            ttl_seconds=data.get("ttl_seconds", 3600),
            retry_count=data.get("retry_count", 0),
            max_retries=data.get("max_retries", 3),
        )


class MessageBus:
    """
    Ajanlar arası mesajlaşma sistemi.
    - In-memory queue (dev)
    - Redis-backed (production)
    """

    def __init__(
        self, use_redis: bool = False, redis_url: str = "redis://localhost:6379"
    ):
        self.use_redis = use_redis
        self.redis_url = redis_url
        self._redis = None
        self._subscribers: dict[str, list[Callable]] = {}
        self._pending_acks: dict[str, Message] = {}
        self._message_log: list[Message] = []
        self._max_log_size = 10000

    async def initialize(self):
        if self.use_redis:
            try:
                import redis.asyncio as redis

                self._redis = redis.from_url(self.redis_url, decode_responses=True)
                await self._redis.ping()
                logger.info("Redis connection established")
            except Exception as e:
                logger.warning(
                    f"Redis connection failed, falling back to in-memory: {e}"
                )
                self.use_redis = False

    async def send(self, message: Message) -> bool:
        """Mesaj gönder"""
        self._log_message(message)

        if self.use_redis and self._redis:
            channel = f"agent:{message.to_agent}"
            await self._redis.publish(channel, message.to_json())

        # In-memory delivery
        if message.to_agent in self._subscribers:
            for callback in self._subscribers[message.to_agent]:
                try:
                    await callback(message)
                except Exception as e:
                    logger.error(f"Subscriber callback failed: {e}")

        if message.requires_ack:
            self._pending_acks[message.message_id] = message

        logger.info(
            f"Message sent: {message.type} from {message.from_agent} to {message.to_agent}"
        )
        return True

    def subscribe(self, agent_name: str, callback: Callable):
        """Bir ajanın mesajlarını dinle"""
        if agent_name not in self._subscribers:
            self._subscribers[agent_name] = []
        self._subscribers[agent_name].append(callback)

    async def acknowledge(self, message_id: str) -> bool:
        """Mesaj alındı onayı"""
        if message_id in self._pending_acks:
            del self._pending_acks[message_id]
            return True
        return False

    async def wait_for(
        self, filter_fn: Callable, timeout: float = 300.0
    ) -> Optional[Message]:
        """Belirli bir mesajı bekle"""
        result_queue = asyncio.Queue()

        def matcher(msg):
            if filter_fn(msg):
                result_queue.put_nowait(msg)

        temp_name = f"temp_{uuid.uuid4().hex[:8]}"
        self.subscribe(temp_name, matcher)

        try:
            return await asyncio.wait_for(result_queue.get(), timeout=timeout)
        except asyncio.TimeoutError:
            logger.warning(f"Timeout waiting for message with filter")
            return None
        finally:
            if temp_name in self._subscribers:
                self._subscribers[temp_name].remove(matcher)

    def _log_message(self, message: Message):
        self._message_log.append(message)
        if len(self._message_log) > self._max_log_size:
            self._message_log = self._message_log[-self._max_log_size :]

    def get_message_history(self, limit: int = 100) -> list[Message]:
        return self._message_log[-limit:]

    def get_pending_acks(self) -> list[Message]:
        return list(self._pending_acks.values())

    async def shutdown(self):
        if self._redis:
            await self._redis.close()
