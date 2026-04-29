"""
Security Guard - Sistemin tehlikeli işlem yapmasını engelleyen güvenlik katmanı
"""

import re
import logging
from typing import Optional
from dataclasses import dataclass

logger = logging.getLogger(__name__)


@dataclass
class SecurityViolation:
    severity: str  # low, medium, high, critical
    rule: str
    description: str
    blocked_action: str


class SecurityGuard:
    """
    Güvenlik katmanı. Tüm ajan çıktıları buradan geçer.
    """

    CRITICAL_OPERATIONS = [
        "DROP TABLE",
        "DROP DATABASE",
        "DELETE FROM users",
        "TRUNCATE",
        "rm -rf /",
        "rm -rf /*",
        "chmod 777",
        "eval(",
        "exec(",
        "__import__(",
        "subprocess.call",
        "os.system",
        "pickle.loads",
        "yaml.load(",
    ]

    SECRET_PATTERNS = [
        (r'(?i)(api[_-]?key|apikey)\s*[=:]\s*["\'][A-Za-z0-9]{16,}["\']', "API Key"),
        (
            r'(?i)(secret[_-]?key|secret)\s*[=:]\s*["\'][A-Za-z0-9]{16,}["\']',
            "Secret Key",
        ),
        (r'(?i)(password|passwd|pwd)\s*[=:]\s*["\'][^\s"\']{8,}["\']', "Password"),
        (
            r'(?i)(aws[_-]?access[_-]?key)\s*[=:]\s*["\']AKIA[A-Za-z0-9]{16}["\']',
            "AWS Access Key",
        ),
        (r"(?i)(aws[_-]?secret)", "AWS Secret"),
        (r"(?i)(private[_-]?key)", "Private Key"),
        (r'(?i)(token)\s*[=:]\s*["\'][A-Za-z0-9]{20,}["\']', "Token"),
        (r"-----BEGIN (RSA |EC )?PRIVATE KEY-----", "PEM Private Key"),
        (r"ghp_[A-Za-z0-9]{36}", "GitHub Token"),
        (r"sk-[A-Za-z0-9]{32,}", "OpenAI/Anthropic API Key"),
    ]

    RATE_LIMITS = {
        "git_push": {"max": 20, "window_seconds": 3600},
        "deploy": {"max": 10, "window_seconds": 3600},
        "api_calls": {"max": 1000, "window_seconds": 3600},
        "file_writes": {"max": 500, "window_seconds": 3600},
        "file_deletes": {"max": 50, "window_seconds": 3600},
        "db_write": {"max": 5000, "window_seconds": 3600},
    }

    ALLOWED_FILE_EXTENSIONS = {
        ".py",
        ".js",
        ".jsx",
        ".ts",
        ".tsx",
        ".css",
        ".html",
        ".json",
        ".yaml",
        ".yml",
        ".md",
        ".txt",
        ".sh",
        ".sql",
        ".env.example",
        ".toml",
        ".lock",
        ".gradle",
        ".xml",
        ".plist",
        ".swift",
        ".kt",
        ".dockerfile",
        ".gitignore",
        ".gitattributes",
    }

    DANGEROUS_EXTENSIONS = {
        ".exe",
        ".dll",
        ".so",
        ".dylib",
        ".bin",
        ".bat",
        ".cmd",
        ".ps1",
        ".vbs",
        ".scr",
        ".msi",
    }

    def __init__(self):
        self._operation_counts: dict[str, list[float]] = {}
        self._violations: list[SecurityViolation] = []
        self._max_violations = 1000
        self._system_paused = False

    def validate_plan(self, plan: dict) -> tuple[bool, list[SecurityViolation]]:
        """Plan güvenli mi?"""
        violations = []

        tasks = plan.get("tasks", [])
        for task in tasks:
            desc = task.get("description", "")
            title = task.get("title", "")
            text = f"{title} {desc}"

            # Critical operation check
            for op in self.CRITICAL_OPERATIONS:
                if op.lower() in text.lower():
                    v = SecurityViolation(
                        severity="critical",
                        rule="critical_operation",
                        description=f"Critical operation detected: {op}",
                        blocked_action=f"Task: {task.get('task_id', 'unknown')}",
                    )
                    violations.append(v)

            # Secret leak check
            for pattern, secret_type in self.SECRET_PATTERNS:
                if re.search(pattern, text):
                    v = SecurityViolation(
                        severity="high",
                        rule="secret_in_task",
                        description=f"Possible {secret_type} in task description",
                        blocked_action=f"Task: {task.get('task_id', 'unknown')}",
                    )
                    violations.append(v)

        return len(violations) == 0, violations

    def validate_code(
        self, code: str, file_path: str
    ) -> tuple[bool, list[SecurityViolation]]:
        """Yazılan kod güvenli mi?"""
        violations = []

        # File extension check
        ext = file_path.rsplit(".", 1)[-1] if "." in file_path else ""
        full_ext = f".{ext}"

        if full_ext in self.DANGEROUS_EXTENSIONS:
            violations.append(
                SecurityViolation(
                    severity="critical",
                    rule="dangerous_extension",
                    description=f"Dangerous file type: {full_ext}",
                    blocked_action=f"File: {file_path}",
                )
            )

        # Secret scan
        for pattern, secret_type in self.SECRET_PATTERNS:
            if re.search(pattern, code):
                violations.append(
                    SecurityViolation(
                        severity="high",
                        rule="hardcoded_secret",
                        description=f"Possible hardcoded {secret_type}",
                        blocked_action=f"File: {file_path}",
                    )
                )

        # Dangerous function calls
        dangerous_calls = [
            "eval(",
            "exec(",
            "os.system(",
            "subprocess.call(",
            "__import__(",
        ]
        for call in dangerous_calls:
            if call in code:
                violations.append(
                    SecurityViolation(
                        severity="medium",
                        rule="dangerous_function",
                        description=f"Dangerous function call: {call}",
                        blocked_action=f"File: {file_path}",
                    )
                )

        # SQL injection patterns
        sql_patterns = [
            r'execute\(f["\']',
            r"cursor\.execute\(.*%.*%",
            r"cursor\.execute\(.*\+.*",
        ]
        for pattern in sql_patterns:
            if re.search(pattern, code):
                violations.append(
                    SecurityViolation(
                        severity="high",
                        rule="sql_injection",
                        description="Possible SQL injection vulnerability",
                        blocked_action=f"File: {file_path}",
                    )
                )

        return len(violations) == 0, violations

    def check_rate_limit(self, operation_type: str) -> tuple[bool, str]:
        """Rate limit kontrolü"""
        import time

        now = time.time()

        if operation_type not in self.RATE_LIMITS:
            return True, ""

        limit = self.RATE_LIMITS[operation_type]
        window = limit["window_seconds"]
        max_count = limit["max"]

        if operation_type not in self._operation_counts:
            self._operation_counts[operation_type] = []

        # Clean old entries
        self._operation_counts[operation_type] = [
            t for t in self._operation_counts[operation_type] if now - t < window
        ]

        if len(self._operation_counts[operation_type]) >= max_count:
            return (
                False,
                f"Rate limit exceeded for {operation_type}: {max_count}/{window}s",
            )

        self._operation_counts[operation_type].append(now)
        return True, ""

    def record_operation(self, operation_type: str) -> tuple[bool, str]:
        """Rate limit'i uygula. Aşıldığında (False, mesaj) döner."""
        allowed, message = self.check_rate_limit(operation_type)
        if not allowed:
            logger.warning(f"Rate limit exceeded for {operation_type}: {message}")
        return allowed, message

    def detect_infinite_loop(self, recent_task_ids: list[str]) -> bool:
        """Son 10 görevde aynı görev 3+ kez tekrarlanıyorsa sonsuz döngü"""
        if len(recent_task_ids) < 10:
            return False

        from collections import Counter

        counts = Counter(recent_task_ids[-10:])
        most_common_id, most_common_count = counts.most_common(1)[0]

        if most_common_count >= 4:
            logger.warning(
                f"Potential infinite loop detected: task {most_common_id} repeated {most_common_count} times"
            )
            return True
        return False

    def record_violation(self, violation: SecurityViolation):
        self._violations.append(violation)
        if len(self._violations) > self._max_violations:
            self._violations = self._violations[-self._max_violations :]

        if violation.severity == "critical":
            self._system_paused = True
            logger.critical(
                f"CRITICAL security violation: {violation.description}. System paused."
            )

    def get_violations(self, limit: int = 50) -> list[SecurityViolation]:
        return self._violations[-limit:]

    def is_paused(self) -> bool:
        return self._system_paused

    def resume_system(self):
        self._system_paused = False
        logger.info("System resumed by admin")

    def get_stats(self) -> dict:
        return {
            "total_violations": len(self._violations),
            "critical_violations": sum(
                1 for v in self._violations if v.severity == "critical"
            ),
            "high_violations": sum(1 for v in self._violations if v.severity == "high"),
            "system_paused": self._system_paused,
        }
