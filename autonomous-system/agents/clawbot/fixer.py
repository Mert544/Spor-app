"""
Clawbot Fixer - Hata düzeltici modül
LLM entegrasyonu ile gerçek hata düzeltme önerileri üretir.
"""

import os
import subprocess
import logging
import re

logger = logging.getLogger(__name__)


class ClawbotFixer:
    """
    Hatalı görevleri düzeltir.
    - Build hatalarını analiz eder
    - Test hatalarını çözer
    - Alternatif yaklaşım dener
    - LLM ile akıllı düzeltme önerileri üretir
    """

    def __init__(self, project_root: str = ".", llm_client=None):
        self.project_root = project_root
        self._llm = llm_client

    def set_llm_client(self, llm_client):
        """LLMClient referansı ayarla — gerçek fix önerileri için"""
        self._llm = llm_client

    async def fix_task(self, task: dict, error_info: dict) -> dict:
        """
        Başarısız görevi düzeltmeye çalış.
        """
        task_id = task.get("task_id", "")
        error = error_info.get("error", "")
        error_type = self._classify_error(error)

        logger.info(f"Attempting to fix task {task_id}: error_type={error_type}")

        fix_result = {
            "task_id": task_id,
            "error_type": error_type,
            "fix_applied": False,
            "fix_description": "",
            "files_modified": [],
        }

        try:
            if error_type == "build_error":
                fix_result = await self._fix_build_error(task, error, fix_result)
            elif error_type == "test_failure":
                fix_result = await self._fix_test_failure(task, error, fix_result)
            elif error_type == "lint_error":
                fix_result = await self._fix_lint_error(task, error, fix_result)
            elif error_type == "import_error":
                fix_result = await self._fix_import_error(task, error, fix_result)
            else:
                fix_result["fix_description"] = (
                    f"Unknown error type, manual review needed: {error_type}"
                )

        except Exception as e:
            fix_result["fix_description"] = f"Fix attempt failed: {str(e)}"

        return fix_result

    def _classify_error(self, error: str) -> str:
        """Hata tipini sınıflandır"""
        error_lower = error.lower()

        if any(
            p in error_lower for p in ["syntaxerror", "parse error", "unexpected token"]
        ):
            return "syntax_error"
        if any(
            p in error_lower
            for p in [
                "module not found",
                "cannot find module",
                "importerror",
                "no module named",
            ]
        ):
            return "import_error"
        if any(p in error_lower for p in ["typeerror", "type error", "attributeerror"]):
            return "type_error"
        if any(
            p in error_lower
            for p in ["build failed", "compilation failed", "exit code 1"]
        ):
            return "build_error"
        if any(
            p in error_lower
            for p in ["test failed", "assertionerror", "expect", "failed"]
        ):
            return "test_failure"
        if any(p in error_lower for p in ["lint", "eslint", "prettier"]):
            return "lint_error"

        return "unknown"

    async def _fix_build_error(self, task: dict, error: str, fix_result: dict) -> dict:
        """Build hatasını düzelt — LLM ile kod düzeltme"""
        fixes_applied = []

        # Check for missing dependencies
        missing_deps = re.findall(r"Cannot find module '([^']+)'", error)
        for dep in missing_deps:
            try:
                subprocess.run(
                    ["npm", "install", dep],
                    cwd=self.project_root,
                    capture_output=True,
                    timeout=60,
                )
                fixes_applied.append(f"Installed missing dependency: {dep}")
            except Exception:
                pass

        # Check for missing imports
        missing_imports = re.findall(r"'([^']+)' is not defined", error)
        for imp in missing_imports:
            fixes_applied.append(f"Need to add import for: {imp}")

        # LLM-based fix for affected files
        if self._llm and task.get("files_affected"):
            for filepath in task.get("files_affected", []):
                full_path = os.path.join(self.project_root, filepath)
                if os.path.exists(full_path):
                    try:
                        with open(full_path, "r", encoding="utf-8") as f:
                            code = f.read()
                        fixed_code = self._llm._template_fix(error, code, task)
                        if fixed_code != code:
                            with open(full_path, "w", encoding="utf-8") as f:
                                f.write(fixed_code)
                            fixes_applied.append(f"LLM fix applied to {filepath}")
                            fix_result["files_modified"].append(filepath)
                    except Exception as e:
                        logger.warning(f"LLM fix failed for {filepath}: {e}")

        fix_result["fix_applied"] = len(fixes_applied) > 0
        fix_result["fix_description"] = (
            "; ".join(fixes_applied)
            if fixes_applied
            else "Build error requires manual fix"
        )
        return fix_result

    async def _fix_test_failure(self, task: dict, error: str, fix_result: dict) -> dict:
        """Test failure düzelt"""
        fixes_applied = []

        # Check for assertion errors
        if "assertionerror" in error.lower():
            fixes_applied.append("Assertion error detected - review test expectations")

        # Check for timeout
        if "timeout" in error.lower():
            fixes_applied.append("Test timeout - increase timeout or optimize code")

        fix_result["fix_applied"] = len(fixes_applied) > 0
        fix_result["fix_description"] = (
            "; ".join(fixes_applied)
            if fixes_applied
            else "Test failure requires manual review"
        )
        return fix_result

    async def _fix_lint_error(self, task: dict, error: str, fix_result: dict) -> dict:
        """Lint hatasını düzelt"""
        try:
            # Auto-fix with eslint
            proc = subprocess.run(
                ["npx", "eslint", "--fix", "."],
                cwd=self.project_root,
                capture_output=True,
                text=True,
                timeout=60,
            )
            if proc.returncode == 0:
                fix_result["fix_applied"] = True
                fix_result["fix_description"] = "ESLint auto-fix applied successfully"
            else:
                fix_result["fix_description"] = f"ESLint auto-fix failed: {proc.stderr}"
        except Exception:
            fix_result["fix_description"] = "ESLint not available"

        return fix_result

    async def _fix_import_error(self, task: dict, error: str, fix_result: dict) -> dict:
        """Import hatasını düzelt"""
        # Extract missing module name
        match = re.search(r"Cannot find module '([^']+)'", error)
        if not match:
            match = re.search(r"No module named '([^']+)'", error)

        if match:
            module_name = match.group(1)
            try:
                subprocess.run(
                    ["npm", "install", module_name],
                    cwd=self.project_root,
                    capture_output=True,
                    timeout=60,
                )
                fix_result["fix_applied"] = True
                fix_result["fix_description"] = (
                    f"Installed missing module: {module_name}"
                )
            except Exception:
                fix_result["fix_description"] = (
                    f"Could not install module: {module_name}"
                )
        else:
            fix_result["fix_description"] = "Could not identify missing module"

        return fix_result
