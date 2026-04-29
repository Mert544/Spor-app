"""
Code Reviewer - Clawbot'un çıktısını değerlendiren Hermes modülü
LLM entegrasyonu ile gerçek kod review yapar.
"""

import logging

logger = logging.getLogger(__name__)


class CodeReviewer:
    """
    Tamamlanmış görevleri değerlendirir ve 0-100 arası puan verir.
    """

    CRITERIA_WEIGHTS = {
        "correctness": 0.30,
        "code_quality": 0.20,
        "test_coverage": 0.20,
        "performance": 0.10,
        "documentation": 0.10,
        "security": 0.10,
    }

    def __init__(self, llm_client=None):
        self._llm = llm_client

    def set_llm_client(self, llm_client):
        """LLMClient referansı ayarla — gerçek review için"""
        self._llm = llm_client

    def review(self, task_id: str, result: dict) -> dict:
        """Görev sonucunu incele ve puanla"""
        if self._llm:
            try:
                code = self._extract_code_from_result(result)
                task = result.get("task_context", {})
                llm_review = self._llm._template_review(code, task)
                llm_score = llm_review.get("score", 50)
                llm_feedback = llm_review.get("feedback", "")
                logger.info(f"LLM review score for {task_id}: {llm_score}")
                return {
                    "task_id": task_id,
                    "score": llm_score,
                    "feedback": llm_feedback,
                    "criteria_scores": llm_review.get("criteria_scores", {}),
                    "passed": llm_score >= 75,
                    "source": "llm",
                }
            except Exception as e:
                logger.warning(f"LLM review failed, using heuristic: {e}")

        scores = {}
        scores["correctness"] = self._score_correctness(result)
        scores["code_quality"] = self._score_code_quality(result)
        scores["test_coverage"] = self._score_test_coverage(result)
        scores["performance"] = self._score_performance(result)
        scores["documentation"] = self._score_documentation(result)
        scores["security"] = self._score_security(result)

        total = sum(
            scores[criteria] * weight
            for criteria, weight in self.CRITERIA_WEIGHTS.items()
        )
        total = round(total)
        feedback = self._generate_feedback(scores, result)

        return {
            "task_id": task_id,
            "score": total,
            "feedback": feedback,
            "criteria_scores": scores,
            "passed": total >= 75,
            "source": "heuristic",
        }

    def _extract_code_from_result(self, result: dict) -> str:
        """Result artifact'larından kod içeriğini çıkar"""
        files = result.get("artifacts", {}).get("files_changed", [])
        code_parts = []
        for f in files:
            try:
                with open(f, "r", encoding="utf-8") as fh:
                    code_parts.append(fh.read())
            except Exception:
                pass
        return "\n\n".join(code_parts) if code_parts else ""

    def _score_correctness(self, result: dict) -> int:
        """Görev tam olarak yapıldı mı?"""
        artifacts = result.get("artifacts", {})
        test_results = artifacts.get("test_results", [])
        commit_hash = artifacts.get("commit_hash", "")
        files_changed = artifacts.get("files_changed", [])

        # Commit yapılmamışsa
        if not commit_hash or commit_hash.startswith("no_commit"):
            return 30

        # Dosya değişikliği yoksa
        if not files_changed:
            return 40

        # Build başarılıysa bonus
        build_success = artifacts.get("build_success", False)

        # Test pass rate
        total_tests = sum(t.get("passed", 0) + t.get("failed", 0) for t in test_results)
        passed_tests = sum(t.get("passed", 0) for t in test_results)

        if total_tests == 0:
            # No tests — files changed and committed
            if build_success:
                return 80
            return 65  # Build failed but files changed

        pass_rate = passed_tests / total_tests
        if pass_rate >= 1.0:
            return 100
        elif pass_rate >= 0.9:
            return 80
        elif pass_rate >= 0.75:
            return 60
        else:
            return 30

    def _score_code_quality(self, result: dict) -> int:
        """Kod kalitesi"""
        artifacts = result.get("artifacts", {})
        lint_result = artifacts.get("lint_result", {})
        build_log = artifacts.get("build_log", "")
        score = 70

        # Lint sonucu
        if lint_result and not lint_result.get("passed", True):
            score -= 20

        # Build log'da lint error
        if "lint error" in build_log.lower():
            score -= 15
        if "warning" in build_log.lower():
            score -= 5

        bundle_size = artifacts.get("bundle_size_kb", 0)
        if bundle_size > 500:
            score -= 15
        elif bundle_size > 200:
            score -= 5

        return max(0, min(100, score))

    def _score_test_coverage(self, result: dict) -> int:
        """Test coverage"""
        test_results = result.get("artifacts", {}).get("test_results", [])
        if not test_results:
            # Gerçek test yok — dosya değişikliği var mı kontrol et
            files_changed = result.get("artifacts", {}).get("files_changed", [])
            test_files = [f for f in files_changed if "test" in f.lower()]
            if test_files:
                return 65  # Test dosyası oluşturulmuş
            return 55  # Hiç test yok ama dosya değişikliği var

        avg_coverage = sum(t.get("coverage", 0) for t in test_results) / len(
            test_results
        )

        if avg_coverage >= 90:
            return 100
        elif avg_coverage >= 80:
            return 85
        elif avg_coverage >= 70:
            return 70
        elif avg_coverage >= 50:
            return 50
        else:
            return 30

    def _score_performance(self, result: dict) -> int:
        """Performans"""
        build_log = result.get("artifacts", {}).get("build_log", "")
        score = 70

        build_time = result.get("artifacts", {}).get("build_time_seconds", 0)
        if build_time > 120:
            score -= 15
        elif build_time > 60:
            score -= 5

        return max(0, min(100, score))

    def _score_documentation(self, result: dict) -> int:
        """Dokümantasyon"""
        # Check if docs were updated
        artifacts = result.get("artifacts", {})
        files_changed = artifacts.get("files_changed", [])

        has_doc_changes = any(
            f.endswith((".md", ".txt")) or "README" in f for f in files_changed
        )

        if has_doc_changes:
            return 90
        # Dev mode — no doc changes expected for code-only tasks
        return 60

    def _score_security(self, result: dict) -> int:
        """Güvenlik"""
        # Check for security issues in artifacts
        artifacts = result.get("artifacts", {})
        security_scan = artifacts.get("security_scan", {})

        if security_scan.get("critical", 0) > 0:
            return 0
        elif security_scan.get("high", 0) > 0:
            return 30
        elif security_scan.get("medium", 0) > 0:
            return 60
        return 100

    def _generate_feedback(self, scores: dict, result: dict) -> str:
        """Detaylı geri bildirim oluştur"""
        feedback_parts = []

        if scores["correctness"] < 70:
            feedback_parts.append(
                "Doğruluk düşük: Tüm acceptance criteria karşılanmalı."
            )
        if scores["code_quality"] < 70:
            feedback_parts.append(
                "Kod kalitesi iyileştirilmeli: Clean code prensiplerini uygula."
            )
        if scores["test_coverage"] < 70:
            feedback_parts.append("Test coverage yetersiz: >80% hedefle.")
        if scores["performance"] < 70:
            feedback_parts.append("Performans optimizasyonu gerekli.")
        if scores["documentation"] < 70:
            feedback_parts.append(
                "Dokümantasyon eksik: README ve inline comments ekle."
            )
        if scores["security"] < 70:
            feedback_parts.append("Güvenlik sorunları tespit edildi.")

        if not feedback_parts:
            return "Mükemmel! Tüm kriterler karşılanmış."

        return " | ".join(feedback_parts)
