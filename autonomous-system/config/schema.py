"""
Pydantic Config Schema — Validates config at startup
"""

import logging
from typing import Optional
from pydantic import BaseModel, Field, field_validator, model_validator

logger = logging.getLogger(__name__)


class SystemConfigSchema(BaseModel):
    name: str = Field(default="autonomous-dev", min_length=1, max_length=50)
    version: str = Field(default="1.0.0", pattern=r"^\d+\.\d+\.\d+$")
    project_root: str = Field(default=".")
    log_level: str = Field(default="INFO")

    @field_validator("log_level")
    @classmethod
    def validate_log_level(cls, v):
        valid = {"DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"}
        if v.upper() not in valid:
            raise ValueError(f"log_level must be one of {valid}")
        return v.upper()


class HermesConfigSchema(BaseModel):
    cycle_interval_seconds: int = Field(default=300, ge=10, le=3600)
    max_tasks_per_cycle: int = Field(default=5, ge=1, le=50)
    review_threshold: int = Field(default=75, ge=0, le=100)
    self_improvement_enabled: bool = Field(default=True)


class ClawbotConfigSchema(BaseModel):
    max_retries: int = Field(default=3, ge=1, le=10)
    max_revisions: int = Field(default=2, ge=0, le=5)
    auto_fix_enabled: bool = Field(default=True)
    build_timeout_seconds: int = Field(default=300, ge=30, le=1800)
    test_timeout_seconds: int = Field(default=120, ge=10, le=600)


class SecurityConfigSchema(BaseModel):
    rate_limits: dict = Field(default_factory=dict)
    critical_operations_blocked: bool = Field(default=True)
    secret_scan_enabled: bool = Field(default=True)


class MemoryConfigSchema(BaseModel):
    use_database: bool = Field(default=False)
    db_url: str = Field(default="postgresql://user:pass@localhost:5432/autonomous_dev")
    redis_url: str = Field(default="redis://localhost:6379")
    max_task_history: int = Field(default=10000, ge=100)
    max_error_solutions: int = Field(default=5000, ge=100)

    @model_validator(mode="before")
    @classmethod
    def validate_db_url(cls, values):
        if (
            isinstance(values, dict)
            and values.get("use_database")
            and not values.get("db_url", "").startswith("postgresql://")
        ):
            raise ValueError("db_url must start with postgresql://")
        return values


class MonitoringConfigSchema(BaseModel):
    enabled: bool = Field(default=True)
    metrics_interval_seconds: int = Field(default=60, ge=10, le=300)
    alert_on: list[str] = Field(
        default_factory=lambda: [
            "security_violation",
            "cycle_failure",
            "infinite_loop",
            "high_error_rate",
        ]
    )


class AppConfigSchema(BaseModel):
    system: SystemConfigSchema = Field(default_factory=SystemConfigSchema)
    hermes: HermesConfigSchema = Field(default_factory=HermesConfigSchema)
    clawbot: ClawbotConfigSchema = Field(default_factory=ClawbotConfigSchema)
    security: SecurityConfigSchema = Field(default_factory=SecurityConfigSchema)
    memory: MemoryConfigSchema = Field(default_factory=MemoryConfigSchema)
    monitoring: MonitoringConfigSchema = Field(default_factory=MonitoringConfigSchema)


def validate_config(raw_config: dict) -> tuple[bool, list[str]]:
    """
    Validate raw config dict against Pydantic schema.
    Returns (is_valid, list_of_errors).
    """
    try:
        AppConfigSchema(**raw_config)
        return True, []
    except Exception as e:
        errors = str(e).split("\n")
        logger.warning(f"Config validation failed: {errors}")
        return False, errors
