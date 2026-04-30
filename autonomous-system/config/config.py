"""
Configuration loader — loads and validates agents.yaml
"""

import os
import logging
from dataclasses import dataclass, field
from typing import Optional

logger = logging.getLogger(__name__)

try:
    import yaml

    HAS_YAML = True
except ImportError:
    HAS_YAML = False


@dataclass
class SystemConfig:
    name: str = "autonomous-dev"
    version: str = "1.0.0"
    project_root: str = "."
    log_level: str = "INFO"


@dataclass
class HermesConfig:
    cycle_interval_seconds: int = 300
    max_tasks_per_cycle: int = 5
    review_threshold: int = 75
    self_improvement_enabled: bool = True


@dataclass
class ClawbotConfig:
    max_retries: int = 3
    max_revisions: int = 2
    auto_fix_enabled: bool = True
    build_timeout_seconds: int = 300
    test_timeout_seconds: int = 120


@dataclass
class SecurityConfig:
    rate_limits: dict = field(
        default_factory=lambda: {
            "git_push": "20/hour",
            "deploy": "10/hour",
            "api_calls": "1000/hour",
            "file_writes": "500/hour",
        }
    )
    critical_operations_blocked: bool = True
    secret_scan_enabled: bool = True


@dataclass
class MemoryConfig:
    use_database: bool = False
    db_url: str = "postgresql://user:pass@localhost:5432/autonomous_dev"
    redis_url: str = "redis://localhost:6379"
    max_task_history: int = 10000
    max_error_solutions: int = 5000


@dataclass
class MonitoringConfig:
    enabled: bool = True
    metrics_interval_seconds: int = 60
    alert_on: list = field(
        default_factory=lambda: [
            "security_violation",
            "cycle_failure",
            "infinite_loop",
            "high_error_rate",
        ]
    )


@dataclass
class AppConfig:
    system: SystemConfig = field(default_factory=SystemConfig)
    hermes: HermesConfig = field(default_factory=HermesConfig)
    clawbot: ClawbotConfig = field(default_factory=ClawbotConfig)
    security: SecurityConfig = field(default_factory=SecurityConfig)
    memory: MemoryConfig = field(default_factory=MemoryConfig)
    monitoring: MonitoringConfig = field(default_factory=MonitoringConfig)


def load_config(config_path: Optional[str] = None) -> AppConfig:
    """
    Load configuration from YAML file.
    Falls back to defaults if file not found or invalid.
    """
    if config_path is None:
        config_path = os.path.join(
            os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
            "config",
            "agents.yaml",
        )

    config = AppConfig()

    if not os.path.exists(config_path):
        logger.warning(f"Config file not found: {config_path}, using defaults")
        return config

    if not HAS_YAML:
        logger.warning("PyYAML not installed, using defaults")
        return config

    try:
        with open(config_path, "r") as f:
            raw = yaml.safe_load(f)

        if not raw or not isinstance(raw, dict):
            logger.warning(f"Empty or invalid config: {config_path}, using defaults")
            return config

        if "system" in raw:
            for k, v in raw["system"].items():
                if hasattr(config.system, k):
                    setattr(config.system, k, v)

        if "hermes" in raw:
            for k, v in raw["hermes"].items():
                if hasattr(config.hermes, k):
                    setattr(config.hermes, k, v)

        if "clawbot" in raw:
            for k, v in raw["clawbot"].items():
                if hasattr(config.clawbot, k):
                    setattr(config.clawbot, k, v)

        if "security" in raw:
            for k, v in raw["security"].items():
                if hasattr(config.security, k):
                    setattr(config.security, k, v)

        if "memory" in raw:
            for k, v in raw["memory"].items():
                if hasattr(config.memory, k):
                    setattr(config.memory, k, v)

        if "monitoring" in raw:
            for k, v in raw["monitoring"].items():
                if hasattr(config.monitoring, k):
                    setattr(config.monitoring, k, v)

        logger.info(f"Config loaded from {config_path}")

    except Exception as e:
        logger.error(f"Failed to load config: {e}, using defaults")

    return config
