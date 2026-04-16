"""
Codebase Analyzer - Proje yapısını analiz eden Hermes modülü
"""

import os
import json
import logging
from typing import Optional

logger = logging.getLogger(__name__)


class CodebaseAnalyzer:
    """
    Proje dizinini ve kod kalitesini analiz eder.
    Eksikleri, teknik borcu, iyileştirme alanlarını tespit eder.
    """

    def __init__(self, project_root: str = "."):
        self.project_root = project_root
        self._file_extensions = {}
        self._total_lines = 0
        self._total_files = 0
        self._issues = []

    async def analyze(self) -> dict:
        """Kapsamlı codebase analizi"""
        structure = self._analyze_structure()
        quality = self._analyze_quality()
        dependencies = self._analyze_dependencies()
        coverage = self._analyze_test_coverage()
        tech_debt = self._analyze_tech_debt()

        summary = {
            "total_files": self._total_files,
            "total_lines": self._total_lines,
            "languages": dict(self._file_extensions),
            "quality_score": quality.get("score", 0),
            "test_coverage": coverage.get("coverage_percent", 0),
            "tech_debt_hours": tech_debt.get("estimated_hours", 0),
            "dependency_issues": len(dependencies.get("issues", [])),
        }

        return {
            "summary": summary,
            "structure": structure,
            "quality": quality,
            "dependencies": dependencies,
            "coverage": coverage,
            "tech_debt": tech_debt,
            "recommendations": self._generate_recommendations(
                quality, coverage, tech_debt
            ),
        }

    def _analyze_structure(self) -> dict:
        """Dizin yapısını analiz et"""
        structure = {
            "directories": [],
            "files_by_type": {},
            "missing_common_files": [],
        }

        required_files = [
            "README.md",
            "LICENSE",
            ".gitignore",
            "package.json",
            "requirements.txt",
            "pyproject.toml",
            "Dockerfile",
            "docker-compose.yml",
        ]

        for root, dirs, files in os.walk(self.project_root):
            # Skip hidden and common non-project dirs
            dirs[:] = [
                d
                for d in dirs
                if not d.startswith(".")
                and d
                not in ("node_modules", "__pycache__", "venv", ".venv", "dist", "build")
            ]

            rel_root = os.path.relpath(root, self.project_root)
            if rel_root != ".":
                structure["directories"].append(rel_root)

            for f in files:
                self._total_files += 1
                ext = os.path.splitext(f)[1]
                self._file_extensions[ext] = self._file_extensions.get(ext, 0) + 1

                file_type = ext or "no-extension"
                structure["files_by_type"][file_type] = (
                    structure["files_by_type"].get(file_type, 0) + 1
                )

                # Count lines
                filepath = os.path.join(root, f)
                try:
                    with open(filepath, "r", encoding="utf-8", errors="ignore") as fh:
                        lines = sum(1 for _ in fh)
                        self._total_lines += lines
                except Exception:
                    pass

        # Check for missing required files
        for req in required_files:
            if not os.path.exists(os.path.join(self.project_root, req)):
                structure["missing_common_files"].append(req)

        return structure

    def _analyze_quality(self) -> dict:
        """Kod kalitesini değerlendir"""
        issues = []
        score = 100

        # Check for TODO/FIXME/HACK comments
        todo_patterns = ["TODO", "FIXME", "HACK", "XXX", "BUG"]
        for root, dirs, files in os.walk(self.project_root):
            dirs[:] = [
                d
                for d in dirs
                if not d.startswith(".")
                and d not in ("node_modules", "__pycache__", "venv", "dist")
            ]
            for f in files:
                if f.endswith((".py", ".js", ".jsx", ".ts", ".tsx")):
                    filepath = os.path.join(root, f)
                    try:
                        with open(
                            filepath, "r", encoding="utf-8", errors="ignore"
                        ) as fh:
                            for line_num, line in enumerate(fh, 1):
                                for pattern in todo_patterns:
                                    if pattern in line.upper():
                                        issues.append(
                                            {
                                                "file": filepath,
                                                "line": line_num,
                                                "type": pattern.lower(),
                                                "content": line.strip()[:100],
                                            }
                                        )
                                        score -= 0.5
                    except Exception:
                        pass

        # Check for long files (>500 lines)
        for root, dirs, files in os.walk(self.project_root):
            dirs[:] = [
                d
                for d in dirs
                if not d.startswith(".")
                and d not in ("node_modules", "__pycache__", "venv", "dist")
            ]
            for f in files:
                if f.endswith((".py", ".js", ".jsx", ".ts", ".tsx")):
                    filepath = os.path.join(root, f)
                    try:
                        with open(
                            filepath, "r", encoding="utf-8", errors="ignore"
                        ) as fh:
                            line_count = sum(1 for _ in fh)
                            if line_count > 500:
                                issues.append(
                                    {
                                        "file": filepath,
                                        "type": "long_file",
                                        "lines": line_count,
                                    }
                                )
                                score -= 2
                    except Exception:
                        pass

        return {
            "score": max(0, score),
            "issues": issues,
            "todo_count": sum(1 for i in issues if i["type"] in ("todo", "fixme")),
        }

    def _analyze_dependencies(self) -> dict:
        """Bağımlılık analizi"""
        issues = []

        # Check package.json for outdated deps
        pkg_json = os.path.join(self.project_root, "package.json")
        if os.path.exists(pkg_json):
            try:
                with open(pkg_json) as f:
                    pkg = json.load(f)
                deps = {**pkg.get("dependencies", {}), **pkg.get("devDependencies", {})}
                for dep, version in deps.items():
                    if version.startswith("^0.") or version.startswith("~0."):
                        issues.append(
                            {
                                "type": "pre_release_dependency",
                                "package": dep,
                                "version": version,
                            }
                        )
            except Exception:
                pass

        # Check requirements.txt
        req_txt = os.path.join(self.project_root, "requirements.txt")
        if os.path.exists(req_txt):
            try:
                with open(req_txt) as f:
                    for line in f:
                        line = line.strip()
                        if line and not line.startswith("#"):
                            if "==" not in line and ">=" not in line:
                                issues.append(
                                    {
                                        "type": "unpinned_dependency",
                                        "package": line,
                                    }
                                )
            except Exception:
                pass

        return {
            "issues": issues,
            "total_dependencies": len(issues),
        }

    def _analyze_test_coverage(self) -> dict:
        """Test coverage analizi"""
        test_files = []
        source_files = []

        for root, dirs, files in os.walk(self.project_root):
            dirs[:] = [
                d
                for d in dirs
                if not d.startswith(".")
                and d not in ("node_modules", "__pycache__", "venv", "dist")
            ]
            for f in files:
                filepath = os.path.join(root, f)
                if "test" in f.lower() or f.startswith("test_"):
                    test_files.append(filepath)
                elif f.endswith((".py", ".js", ".jsx", ".ts", ".tsx")):
                    source_files.append(filepath)

        total_source = len(source_files)
        total_test = len(test_files)
        coverage = (total_test / max(total_source, 1)) * 100

        return {
            "coverage_percent": min(coverage, 100),
            "source_files": total_source,
            "test_files": total_test,
            "untested_files": [f for f in source_files if f not in test_files],
        }

    def _analyze_tech_debt(self) -> dict:
        """Teknik borç tahmini"""
        debt_items = []
        estimated_hours = 0

        # Long files
        for root, dirs, files in os.walk(self.project_root):
            dirs[:] = [
                d
                for d in dirs
                if not d.startswith(".")
                and d not in ("node_modules", "__pycache__", "venv", "dist")
            ]
            for f in files:
                if f.endswith((".py", ".js", ".jsx", ".ts", ".tsx")):
                    filepath = os.path.join(root, f)
                    try:
                        with open(
                            filepath, "r", encoding="utf-8", errors="ignore"
                        ) as fh:
                            lines = sum(1 for _ in fh)
                            if lines > 500:
                                hours = (lines - 500) / 200
                                debt_items.append(
                                    {
                                        "type": "long_file",
                                        "file": filepath,
                                        "lines": lines,
                                        "estimated_hours": round(hours, 1),
                                    }
                                )
                                estimated_hours += hours
                    except Exception:
                        pass

        # Missing tests
        # Missing docs
        if not os.path.exists(os.path.join(self.project_root, "README.md")):
            debt_items.append(
                {
                    "type": "missing_documentation",
                    "file": "README.md",
                    "estimated_hours": 2,
                }
            )
            estimated_hours += 2

        return {
            "estimated_hours": round(estimated_hours, 1),
            "items": debt_items,
        }

    def _generate_recommendations(
        self, quality: dict, coverage: dict, tech_debt: dict
    ) -> list:
        """Analiz sonuçlarına göre öneriler üret"""
        recs = []

        if quality["score"] < 80:
            recs.append(
                {
                    "priority": 1,
                    "type": "code_quality",
                    "description": f"Kod kalitesi düşük ({quality['score']}/100). TODO/FIXME yorumlarını çöz.",
                }
            )

        if coverage["coverage_percent"] < 50:
            recs.append(
                {
                    "priority": 1,
                    "type": "test_coverage",
                    "description": f"Test coverage düşük (%{coverage['coverage_percent']:.0f}). Test yaz.",
                }
            )

        if tech_debt["estimated_hours"] > 10:
            recs.append(
                {
                    "priority": 2,
                    "type": "tech_debt",
                    "description": f"Tahmini teknik borç: {tech_debt['estimated_hours']} saat. Refactor yap.",
                }
            )

        if not os.path.exists(os.path.join(self.project_root, ".gitignore")):
            recs.append(
                {
                    "priority": 1,
                    "type": "infrastructure",
                    "description": ".gitignore dosyası eksik.",
                }
            )

        return recs
