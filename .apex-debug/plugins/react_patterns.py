"""React/JS custom patterns for Apex Debug.

Detects common React anti-patterns and production risks.
"""

from apex_debug.core.finding import Finding, Severity
from apex_debug.engine.patterns.base import AbstractPattern


class ConsoleLogPattern(AbstractPattern):
    """Finds console.log statements that should not be in production."""

    name = "Console log in production"
    description = "Detects console.log/debug/warn/error that may leak info or clutter production"
    severity = Severity.LOW
    category = "style"

    def analyze_python_ast(self, node, source, filepath):
        return []

    def get_regex(self):
        return (
            r"console\.(log|debug|warn|error)\s*\(",
            "Console.{match} found in production code — consider removing or using a proper logger",
        )


class MissingKeyPropPattern(AbstractPattern):
    """Detects .map() without key prop in JSX."""

    name = "Missing key prop in list"
    description = "React lists rendered without key prop cause reconciliation issues"
    severity = Severity.MEDIUM
    category = "correctness"

    def analyze_python_ast(self, node, source, filepath):
        return []

    def get_regex(self):
        return (
            r"\.map\s*\(\s*\([^)]*\)\s*=>\s*<([A-Za-z][A-Za-z0-9]*)[^>]*>(?!.*key=)",
            "List render without key prop at {file}:{line} — add key={uniqueId} to <{match}>",
        )


class DebuggerStatementPattern(AbstractPattern):
    """Finds debugger; statements."""

    name = "Debugger statement"
    description = "debugger; should not be committed to production"
    severity = Severity.MEDIUM
    category = "style"

    def analyze_python_ast(self, node, source, filepath):
        return []

    def get_regex(self):
        return (
            r"debugger\s*;",
            "debugger; statement found at {file}:{line} — remove before production",
        )


class DangerouslySetInnerHTMLPattern(AbstractPattern):
    """Detects dangerouslySetInnerHTML usage (XSS risk)."""

    name = "dangerouslySetInnerHTML usage"
    description = "dangerouslySetInnerHTML can lead to XSS if content is not sanitized"
    severity = Severity.HIGH
    category = "security"

    def analyze_python_ast(self, node, source, filepath):
        return []

    def get_regex(self):
        return (
            r"dangerouslySetInnerHTML\s*=",
            "dangerouslySetInnerHTML at {file}:{line} — ensure content is sanitized to prevent XSS",
        )


class MissingAltPattern(AbstractPattern):
    """Detects <img> tags without alt attribute."""

    name = "Missing alt attribute"
    description = "Images without alt attributes hurt accessibility"
    severity = Severity.LOW
    category = "style"

    def analyze_python_ast(self, node, source, filepath):
        return []

    def get_regex(self):
        return (
            r"<img\s+[^>]*(?<!alt=)(?<!alt\s=)(?<!alt\s=\s)(?<!alt=\s)(?<!alt\s=\s)>(?!.*alt=)",
            "<img> without alt attribute at {file}:{line} — add alt for accessibility",
        )


class EvalUsagePattern(AbstractPattern):
    """Detects eval() usage in JS."""

    name = "eval() usage"
    description = "eval() can execute arbitrary code and is a security risk"
    severity = Severity.CRITICAL
    category = "security"

    def analyze_python_ast(self, node, source, filepath):
        return []

    def get_regex(self):
        return (
            r"(?<!\w)eval\s*\(",
            "eval() at {file}:{line} — avoid eval to prevent arbitrary code execution",
        )
