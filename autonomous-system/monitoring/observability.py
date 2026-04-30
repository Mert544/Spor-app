"""
Observability — Structured logging, Prometheus metrics, and OpenTelemetry traces
"""

import json
import logging
import time
import threading
from datetime import datetime, timezone
from typing import Optional
from dataclasses import dataclass, field


@dataclass
class MetricPoint:
    name: str
    value: float
    labels: dict = field(default_factory=dict)
    timestamp: str = field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat()
    )


class MetricsCollector:
    """
    Prometheus-compatible metrics collector.
    Tracks counters, gauges, and histograms in-memory.
    """

    def __init__(self):
        self._counters: dict[str, float] = {}
        self._gauges: dict[str, float] = {}
        self._histograms: dict[str, list[float]] = {}
        self._lock = threading.Lock()

    def increment(self, name: str, value: float = 1.0, labels: dict = None):
        with self._lock:
            key = self._label_key(name, labels)
            self._counters[key] = self._counters.get(key, 0) + value

    def set_gauge(self, name: str, value: float, labels: dict = None):
        with self._lock:
            key = self._label_key(name, labels)
            self._gauges[key] = value

    def observe(self, name: str, value: float, labels: dict = None):
        with self._lock:
            key = self._label_key(name, labels)
            if key not in self._histograms:
                self._histograms[key] = []
            self._histograms[key].append(value)

    def histogram_summary(self, name: str, labels: dict = None) -> dict:
        with self._lock:
            key = self._label_key(name, labels)
            values = self._histograms.get(key, [])
            if not values:
                return {"count": 0, "sum": 0, "avg": 0}
            values_sorted = sorted(values)
            return {
                "count": len(values),
                "sum": sum(values),
                "avg": sum(values) / len(values),
                "p50": values_sorted[len(values_sorted) // 2],
                "p95": values_sorted[int(len(values_sorted) * 0.95)],
                "p99": values_sorted[int(len(values_sorted) * 0.99)],
            }

    def get_all(self) -> list[MetricPoint]:
        points = []
        with self._lock:
            for key, value in self._counters.items():
                name, labels = self._parse_key(key)
                points.append(MetricPoint(name=name, value=value, labels=labels))
            for key, value in self._gauges.items():
                name, labels = self._parse_key(key)
                points.append(MetricPoint(name=name, value=value, labels=labels))
        return points

    def prometheus_format(self) -> str:
        lines = []
        for point in self.get_all():
            label_str = ""
            if point.labels:
                label_str = (
                    "{" + ",".join(f'{k}="{v}"' for k, v in point.labels.items()) + "}"
                )
            lines.append(f"{point.name}{label_str} {point.value}")
        return "\n".join(lines)

    def _label_key(self, name: str, labels: dict = None) -> str:
        if not labels:
            return name
        label_parts = ",".join(f"{k}={v}" for k, v in sorted(labels.items()))
        return f"{name}[{label_parts}]"

    def _parse_key(self, key: str) -> tuple[str, dict]:
        if "[" not in key:
            return key, {}
        name, label_part = key.rsplit("[", 1)
        label_part = label_part.rstrip("]")
        labels = {}
        for pair in label_part.split(","):
            k, v = pair.split("=", 1)
            labels[k] = v
        return name, labels


class StructuredFormatter(logging.Formatter):
    """JSON structured log formatter"""

    def format(self, record: logging.LogRecord) -> str:
        log_entry = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "module": record.module,
            "function": record.funcName,
            "line": record.lineno,
        }
        if record.exc_info and record.exc_info[0]:
            log_entry["exception"] = self.formatException(record.exc_info)
        if hasattr(record, "extra"):
            log_entry["extra"] = record.extra
        return json.dumps(log_entry, default=str)


class Tracer:
    """
    Lightweight distributed tracer.
    Creates spans with parent-child relationships.
    """

    def __init__(self):
        self._spans: list[dict] = []
        self._active_spans: dict[str, dict] = {}

    def start_span(self, name: str, parent_id: str = None) -> str:
        span_id = f"span-{len(self._spans)}"
        span = {
            "span_id": span_id,
            "name": name,
            "parent_id": parent_id,
            "start_time": time.time(),
            "end_time": None,
            "status": "running",
            "attributes": {},
        }
        self._active_spans[span_id] = span
        return span_id

    def end_span(self, span_id: str, status: str = "ok", attributes: dict = None):
        span = self._active_spans.get(span_id)
        if span:
            span["end_time"] = time.time()
            span["duration_seconds"] = round(span["end_time"] - span["start_time"], 4)
            span["status"] = status
            if attributes:
                span["attributes"].update(attributes)
            self._spans.append(span)
            del self._active_spans[span_id]

    def get_recent_spans(self, limit: int = 50) -> list:
        return self._spans[-limit:]

    def get_trace_summary(self) -> dict:
        total = len(self._spans)
        ok = sum(1 for s in self._spans if s["status"] == "ok")
        error = sum(1 for s in self._spans if s["status"] == "error")
        avg_duration = (
            sum(s.get("duration_seconds", 0) for s in self._spans) / total
            if total > 0
            else 0
        )
        return {
            "total_spans": total,
            "ok": ok,
            "error": error,
            "avg_duration_seconds": round(avg_duration, 4),
        }


metrics = MetricsCollector()
tracer = Tracer()
