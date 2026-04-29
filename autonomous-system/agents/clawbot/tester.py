"""
Clawbot Tester - Test çalıştırıcı ve sonuç raporlayıcı
"""

import os
import subprocess
import logging
import json

logger = logging.getLogger(__name__)


class ClawbotTester:
    """
    Testleri çalıştırır, sonuçları parse eder ve raporlar.
    """

    def __init__(self, project_root: str = "."):
        self.project_root = project_root

    async def run_tests(self, task_id: str = "") -> dict:
        """Tüm testleri çalıştır"""
        results = {
            "task_id": task_id,
            "total": 0,
            "passed": 0,
            "failed": 0,
            "skipped": 0,
            "coverage_percent": 0,
            "test_files": [],
            "errors": [],
        }

        # JavaScript/TypeScript tests (Vitest/Jest)
        if os.path.exists(os.path.join(self.project_root, "package.json")):
            js_results = await self._run_js_tests()
            results.update(js_results)

        # Python tests (pytest)
        if os.path.exists(
            os.path.join(self.project_root, "requirements.txt")
        ) or os.path.exists(os.path.join(self.project_root, "pyproject.toml")):
            py_results = await self._run_py_tests()
            if py_results["total"] > results["total"]:
                results.update(py_results)

        return results

    async def _run_js_tests(self) -> dict:
        """npm test çalıştır"""
        results = {
            "total": 0,
            "passed": 0,
            "failed": 0,
            "skipped": 0,
            "coverage_percent": 0,
            "test_files": [],
            "errors": [],
        }

        # Try vitest
        try:
            proc = subprocess.run(
                ["npx", "vitest", "run", "--reporter=json", "--coverage"],
                cwd=self.project_root,
                capture_output=True,
                text=True,
                timeout=120,
            )
            if proc.stdout:
                try:
                    data = json.loads(proc.stdout)
                    results["total"] = data.get("numTotalTests", 0)
                    results["passed"] = data.get("numPassedTests", 0)
                    results["failed"] = data.get("numFailedTests", 0)
                    results["coverage_percent"] = (
                        data.get("coverage", {}).get("lines", {}).get("pct", 0)
                    )
                except json.JSONDecodeError:
                    pass
        except (subprocess.TimeoutExpired, FileNotFoundError):
            pass

        # Fallback: jest
        if results["total"] == 0:
            try:
                proc = subprocess.run(
                    ["npx", "jest", "--json", "--coverage"],
                    cwd=self.project_root,
                    capture_output=True,
                    text=True,
                    timeout=120,
                )
                if proc.stdout:
                    try:
                        data = json.loads(proc.stdout)
                        results["total"] = data.get("numTotalTestSuites", 0)
                        results["passed"] = data.get("numPassedTestSuites", 0)
                        results["failed"] = data.get("numFailedTestSuites", 0)
                    except json.JSONDecodeError:
                        pass
            except (subprocess.TimeoutExpired, FileNotFoundError):
                pass

        return results

    async def _run_py_tests(self) -> dict:
        """pytest çalıştır"""
        results = {
            "total": 0,
            "passed": 0,
            "failed": 0,
            "skipped": 0,
            "coverage_percent": 0,
            "test_files": [],
            "errors": [],
        }

        try:
            proc = subprocess.run(
                [
                    "python",
                    "-m",
                    "pytest",
                    "--tb=short",
                    "-q",
                    "--cov",
                    "--cov-report=json",
                ],
                cwd=self.project_root,
                capture_output=True,
                text=True,
                timeout=120,
            )

            # Parse coverage JSON
            coverage_file = os.path.join(self.project_root, "coverage.json")
            if os.path.exists(coverage_file):
                with open(coverage_file) as f:
                    coverage_data = json.load(f)
                    totals = coverage_data.get("totals", {})
                    results["coverage_percent"] = totals.get("percent_covered", 0)

            # Parse test output
            output = proc.stdout + proc.stderr
            if "passed" in output:
                import re

                match = re.search(r"(\d+) passed", output)
                if match:
                    results["passed"] = int(match.group(1))
                match = re.search(r"(\d+) failed", output)
                if match:
                    results["failed"] = int(match.group(1))
                match = re.search(r"(\d+) skipped", output)
                if match:
                    results["skipped"] = int(match.group(1))
                results["total"] = (
                    results["passed"] + results["failed"] + results["skipped"]
                )

        except (subprocess.TimeoutExpired, FileNotFoundError):
            pass

        return results

    async def run_security_scan(self) -> dict:
        """Güvenlik taraması yap"""
        scan_result = {
            "critical": 0,
            "high": 0,
            "medium": 0,
            "low": 0,
            "details": [],
        }

        # npm audit
        if os.path.exists(os.path.join(self.project_root, "package.json")):
            try:
                proc = subprocess.run(
                    ["npm", "audit", "--json"],
                    cwd=self.project_root,
                    capture_output=True,
                    text=True,
                    timeout=60,
                )
                try:
                    data = json.loads(proc.stdout)
                    metadata = data.get("metadata", {})
                    scan_result["critical"] = metadata.get("vulnerabilities", {}).get(
                        "critical", 0
                    )
                    scan_result["high"] = metadata.get("vulnerabilities", {}).get(
                        "high", 0
                    )
                    scan_result["medium"] = metadata.get("vulnerabilities", {}).get(
                        "moderate", 0
                    )
                    scan_result["low"] = metadata.get("vulnerabilities", {}).get(
                        "low", 0
                    )
                except json.JSONDecodeError:
                    pass
            except (subprocess.TimeoutExpired, FileNotFoundError):
                pass

        return scan_result
