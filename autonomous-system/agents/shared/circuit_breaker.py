"""
Circuit Breaker — Prevents cascade failures from external services
"""

import time
import logging
from enum import Enum
from typing import Optional, Callable, Any
from dataclasses import dataclass, field

logger = logging.getLogger(__name__)


class CircuitState(Enum):
    CLOSED = "closed"
    OPEN = "open"
    HALF_OPEN = "half_open"


@dataclass
class CircuitBreakerStats:
    total_calls: int = 0
    total_failures: int = 0
    total_successes: int = 0
    last_failure_time: float = 0
    last_success_time: float = 0
    consecutive_failures: int = 0
    consecutive_successes: int = 0


class CircuitBreaker:
    """
    Circuit breaker with 3 states:
    - CLOSED: Normal operation, requests pass through
    - OPEN: Requests blocked, fail fast
    - HALF_OPEN: Testing recovery, limited requests allowed

    Transitions:
    - CLOSED → OPEN: After failure_threshold consecutive failures
    - OPEN → HALF_OPEN: After recovery_timeout seconds
    - HALF_OPEN → CLOSED: After success_threshold consecutive successes
    - HALF_OPEN → OPEN: On any failure
    """

    def __init__(
        self,
        name: str,
        failure_threshold: int = 5,
        success_threshold: int = 3,
        recovery_timeout: float = 60.0,
    ):
        self.name = name
        self.failure_threshold = failure_threshold
        self.success_threshold = success_threshold
        self.recovery_timeout = recovery_timeout
        self._state = CircuitState.CLOSED
        self._stats = CircuitBreakerStats()
        self._last_state_change = time.time()

    @property
    def state(self) -> CircuitState:
        if self._state == CircuitState.OPEN:
            if time.time() - self._last_state_change >= self.recovery_timeout:
                self._transition_to(CircuitState.HALF_OPEN)
        return self._state

    def _transition_to(self, new_state: CircuitState):
        old_state = self._state
        self._state = new_state
        self._last_state_change = time.time()
        logger.info(f"Circuit '{self.name}': {old_state.value} → {new_state.value}")

    def record_success(self):
        self._stats.total_calls += 1
        self._stats.total_successes += 1
        self._stats.last_success_time = time.time()
        self._stats.consecutive_failures = 0
        self._stats.consecutive_successes += 1

        if self._state == CircuitState.HALF_OPEN:
            if self._stats.consecutive_successes >= self.success_threshold:
                self._transition_to(CircuitState.CLOSED)

    def record_failure(self, error: str = ""):
        self._stats.total_calls += 1
        self._stats.total_failures += 1
        self._stats.last_failure_time = time.time()
        self._stats.consecutive_successes = 0
        self._stats.consecutive_failures += 1

        if self._state == CircuitState.HALF_OPEN:
            self._transition_to(CircuitState.OPEN)
        elif self._state == CircuitState.CLOSED:
            if self._stats.consecutive_failures >= self.failure_threshold:
                logger.warning(
                    f"Circuit '{self.name}' OPENED after {self._stats.consecutive_failures} consecutive failures"
                )
                self._transition_to(CircuitState.OPEN)

    def can_execute(self) -> bool:
        state = self.state
        if state == CircuitState.CLOSED:
            return True
        elif state == CircuitState.OPEN:
            return False
        else:
            return True

    async def execute(self, fn: Callable, *args, **kwargs) -> Any:
        if not self.can_execute():
            raise CircuitBreakerOpenError(
                f"Circuit '{self.name}' is OPEN. Retry after {self.recovery_timeout}s"
            )

        try:
            result = await fn(*args, **kwargs)
            self.record_success()
            return result
        except Exception as e:
            self.record_failure(str(e))
            raise

    def get_status(self) -> dict:
        return {
            "name": self.name,
            "state": self.state.value,
            "total_calls": self._stats.total_calls,
            "total_failures": self._stats.total_failures,
            "total_successes": self._stats.total_successes,
            "consecutive_failures": self._stats.consecutive_failures,
            "consecutive_successes": self._stats.consecutive_successes,
            "failure_threshold": self.failure_threshold,
            "recovery_timeout": self.recovery_timeout,
        }

    def reset(self):
        self._transition_to(CircuitState.CLOSED)
        self._stats = CircuitBreakerStats()
        logger.info(f"Circuit '{self.name}' reset")


class CircuitBreakerOpenError(Exception):
    pass


class CircuitBreakerRegistry:
    """Manages multiple circuit breakers by service name"""

    def __init__(self):
        self._breakers: dict[str, CircuitBreaker] = {}

    def get_or_create(
        self,
        name: str,
        failure_threshold: int = 5,
        success_threshold: int = 3,
        recovery_timeout: float = 60.0,
    ) -> CircuitBreaker:
        if name not in self._breakers:
            self._breakers[name] = CircuitBreaker(
                name=name,
                failure_threshold=failure_threshold,
                success_threshold=success_threshold,
                recovery_timeout=recovery_timeout,
            )
        return self._breakers[name]

    def get_all_status(self) -> list[dict]:
        return [cb.get_status() for cb in self._breakers.values()]

    def reset_all(self):
        for cb in self._breakers.values():
            cb.reset()
