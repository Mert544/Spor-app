"""
Task Planner - Analiz sonuçlarından görev planı oluşturan Hermes modülü
"""

import uuid
import logging
from typing import Optional

logger = logging.getLogger(__name__)


class TaskPlanner:
    """
    Codebase analizinden görev listesi oluşturur.
    Önceliklendirme, bağımlılık analizi ve tahmini süre hesaplama yapar.
    """

    PRIORITY_WEIGHTS = {
        "security": 5,
        "bug": 4,
        "test_coverage": 3,
        "code_quality": 3,
        "feature": 2,
        "documentation": 1,
        "refactor": 2,
        "infrastructure": 3,
    }

    def __init__(self):
        self._task_counter = 0

    def create_plan(self, analysis: dict) -> dict:
        """Analiz sonuçlarından görev planı oluştur"""
        tasks = []

        # Security issues first
        for issue in analysis.get("quality", {}).get("issues", []):
            if issue.get("type") in ("todo", "fixme", "hack"):
                tasks.append(
                    self._create_task(
                        category="code_quality",
                        title=f"Resolve {issue['type'].upper()} in {issue.get('file', 'unknown')}",
                        description=f"Address {issue['type']}: {issue.get('content', '')}",
                        files_affected=[issue.get("file", "")],
                        priority=3,
                    )
                )

        # Test coverage gaps
        coverage = analysis.get("coverage", {})
        if coverage.get("coverage_percent", 100) < 80:
            untested = coverage.get("untested_files", [])[:10]
            for filepath in untested:
                tasks.append(
                    self._create_task(
                        category="test_coverage",
                        title=f"Add tests for {filepath}",
                        description=f"Write unit tests for {filepath}. Target: >80% coverage.",
                        files_affected=[filepath],
                        priority=3,
                    )
                )

        # Tech debt
        for item in analysis.get("tech_debt", {}).get("items", []):
            if item["type"] == "long_file":
                tasks.append(
                    self._create_task(
                        category="refactor",
                        title=f"Refactor long file: {item['file']}",
                        description=f"File has {item['lines']} lines. Split into smaller modules.",
                        files_affected=[item["file"]],
                        priority=2,
                    )
                )

        # Missing files
        for missing in analysis.get("structure", {}).get("missing_common_files", []):
            tasks.append(
                self._create_task(
                    category="infrastructure",
                    title=f"Create {missing}",
                    description=f"Create missing file: {missing}",
                    priority=2,
                )
            )

        # Dependency issues
        for dep_issue in analysis.get("dependencies", {}).get("issues", []):
            tasks.append(
                self._create_task(
                    category="infrastructure",
                    title=f"Fix dependency: {dep_issue.get('package', 'unknown')}",
                    description=f"Dependency issue: {dep_issue.get('type', 'unknown')}",
                    priority=3,
                )
            )

        # Recommendations
        for rec in analysis.get("recommendations", []):
            tasks.append(
                self._create_task(
                    category=rec["type"],
                    title=rec["description"][:80],
                    description=rec["description"],
                    priority=rec["priority"],
                )
            )

        # Sort by priority
        tasks.sort(key=lambda t: t.get("priority", 3))

        return {
            "tasks": tasks,
            "total_tasks": len(tasks),
            "rationale": f"Plan generated from codebase analysis. {len(tasks)} tasks identified.",
            "alternatives": [],
        }

    def revise_plan(self, plan: dict, violations: list) -> dict:
        """Güvenlik ihlalleri nedeniyle planı revize et"""
        revised_tasks = []
        for task in plan.get("tasks", []):
            is_blocked = False
            for v in violations:
                if task.get("task_id") in v.blocked_action:
                    is_blocked = True
                    break
            if not is_blocked:
                task["context"]["revised"] = True
                revised_tasks.append(task)

        plan["tasks"] = revised_tasks
        plan["total_tasks"] = len(revised_tasks)
        plan["rationale"] += (
            f" Revised: {len(plan.get('tasks', []))} tasks after security review."
        )
        return plan

    def _create_task(
        self,
        category: str,
        title: str,
        description: str,
        files_affected: list = None,
        priority: int = 3,
    ) -> dict:
        self._task_counter += 1
        task_id = f"TASK-{self._task_counter:04d}"

        return {
            "task_id": task_id,
            "category": category,
            "title": title,
            "description": description,
            "priority": priority,
            "files_affected": files_affected or [],
            "branch": f"{category}/{task_id.lower().replace('-', '/')}",
            "acceptance_criteria": self._generate_acceptance_criteria(category),
            "context": {"category": category},
            "estimated_duration_minutes": self._estimate_duration(category),
        }

    def _generate_acceptance_criteria(self, category: str) -> list:
        criteria_map = {
            "security": [
                "Güvenlik açığı tamamen kapatılmış",
                "Test ile doğrulanmış",
                "Regression test passed",
            ],
            "bug": [
                "Hata yeniden oluşturulamıyor",
                "İlgili test yazılmış",
                "Edge case'ler ele alınmış",
            ],
            "test_coverage": [
                "Test coverage >80%",
                "Tüm public fonksiyonlar test edilmiş",
                "Edge case'ler dahil",
            ],
            "code_quality": [
                "Kod review geçmiş",
                "Lint hataları yok",
                "Clean code prensiplerine uygun",
            ],
            "refactor": [
                "Fonksiyonellik korunmuş",
                "Tüm testler passing",
                "Performans düşmemiş",
            ],
            "feature": [
                "Acceptance criteria karşılanmış",
                "Test coverage >80%",
                "Dokümantasyon güncellenmiş",
            ],
            "documentation": [
                "README güncellenmiş",
                "Inline comments eklenmiş",
                "API docs güncel",
            ],
            "infrastructure": [
                "Build başarılı",
                "Deploy başarılı",
                "Smoke test passed",
            ],
        }
        return criteria_map.get(category, ["Task tamamlanmış", "Test passing"])

    def _estimate_duration(self, category: str) -> int:
        duration_map = {
            "security": 60,
            "bug": 45,
            "test_coverage": 30,
            "code_quality": 20,
            "refactor": 90,
            "feature": 120,
            "documentation": 30,
            "infrastructure": 45,
        }
        return duration_map.get(category, 60)
