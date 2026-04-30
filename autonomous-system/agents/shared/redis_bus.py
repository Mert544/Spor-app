"""
Redis Message Bus — Production pub/sub + task queue
"""

import json
import uuid
import asyncio
import logging
from datetime import datetime, timezone
from typing import Callable, Optional, Any

logger = logging.getLogger(__name__)

try:
    import redis.asyncio as aioredis

    HAS_REDIS = True
except ImportError:
    HAS_REDIS = False


class RedisMessageBus:
    """
    Redis-backed message bus with:
    - Pub/sub for real-time messaging
    - Task queue with retries
    - Dead letter queue
    - Message deduplication
    - TTL-based expiration
    """

    def __init__(
        self, redis_url: str = "redis://localhost:6379", max_pending: int = 10000
    ):
        self.redis_url = redis_url
        self.max_pending = max_pending
        self._redis = None
        self._subscribers: dict[str, list[Callable]] = {}
        self._running = False
        self._pubsub = None
        self._task_queue = "task:queue"
        self._dead_letter = "task:dead_letter"
        self._seen_ids = "msg:seen_ids"
        self._seen_ids_ttl = 3600

    async def initialize(self):
        if not HAS_REDIS:
            logger.error("redis package not installed — Redis disabled")
            return False

        try:
            self._redis = aioredis.from_url(
                self.redis_url,
                decode_responses=True,
                max_connections=20,
            )
            await self._redis.ping()
            self._running = True
            logger.info("Redis message bus initialized")
            return True
        except Exception as e:
            logger.warning(f"Redis connection failed: {e}")
            return False

    async def _is_duplicate(self, message_id: str) -> bool:
        added = await self._redis.sadd(self._seen_ids, message_id)
        if added:
            await self._redis.expire(self._seen_ids, self._seen_ids_ttl)
        return not added

    async def send(self, message: dict) -> bool:
        if not self._running:
            return False

        if await self._is_duplicate(message.get("message_id", "")):
            logger.debug(f"Duplicate message dropped: {message['message_id']}")
            return False

        channel = f"agent:{message.get('to_agent', '')}"
        await self._redis.publish(channel, json.dumps(message))

        if message.get("requires_ack", True):
            await self._redis.hset(
                "msg:pending_acks",
                message["message_id"],
                json.dumps(message),
            )
            await self._redis.expire(
                "msg:pending_acks", message.get("ttl_seconds", 3600)
            )

        pending_count = await self._redis.hlen("msg:pending_acks")
        if pending_count > self.max_pending:
            logger.warning(
                f"Pending acks queue full ({pending_count}), dropping oldest"
            )
            oldest = await self._redis.hkeys("msg:pending_acks")
            if oldest:
                await self._redis.hdel("msg:pending_acks", oldest[0])

        logger.info(
            f"Redis message sent: {message.get('type')} to {message.get('to_agent')}"
        )
        return True

    async def enqueue_task(self, task: dict, priority: int = 3):
        score = priority * 1000000 + int(datetime.now(timezone.utc).timestamp())
        await self._redis.zadd(self._task_queue, {json.dumps(task): score})
        logger.info(f"Task enqueued: {task.get('task_id')} (priority={priority})")

    async def dequeue_task(self, timeout: float = 5.0) -> Optional[dict]:
        result = await self._redis.bzpopmin(self._task_queue, timeout=int(timeout))
        if result:
            _, task_json = result
            return json.loads(task_json)
        return None

    async def move_to_dead_letter(self, task: dict, error: str):
        task["dead_letter_error"] = error
        task["dead_letter_at"] = datetime.now(timezone.utc).isoformat()
        await self._redis.lpush(self._dead_letter, json.dumps(task))
        await self._redis.ltrim(self._dead_letter, 0, 999)
        logger.warning(
            f"Task moved to dead letter queue: {task.get('task_id')} — {error}"
        )

    async def acknowledge(self, message_id: str) -> bool:
        removed = await self._redis.hdel("msg:pending_acks", message_id)
        return removed > 0

    def subscribe(self, agent_name: str, callback: Callable):
        if agent_name not in self._subscribers:
            self._subscribers[agent_name] = []
        self._subscribers[agent_name].append(callback)

    async def start_listening(self):
        if not self._running:
            return

        self._pubsub = self._redis.pubsub()
        for agent_name in self._subscribers:
            await self._pubsub.subscribe(f"agent:{agent_name}")

        async for message in self._pubsub.listen():
            if message["type"] == "message":
                agent_name = message["channel"].replace("agent:", "")
                try:
                    data = json.loads(message["data"])
                    for callback in self._subscribers.get(agent_name, []):
                        await callback(data)
                except Exception as e:
                    logger.error(f"Redis message handler failed: {e}")

    async def get_pending_acks(self) -> list:
        acks = await self._redis.hgetall("msg:pending_acks")
        return [json.loads(v) for v in acks.values()]

    async def get_dead_letter_count(self) -> int:
        return await self._redis.llen(self._dead_letter)

    async def shutdown(self):
        self._running = False
        if self._pubsub:
            await self._pubsub.close()
        if self._redis:
            await self._redis.close()
        logger.info("Redis message bus shut down")
