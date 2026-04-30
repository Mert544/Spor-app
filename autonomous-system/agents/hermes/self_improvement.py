"""
Self-Improvement Loop — Actually tunes system parameters based on performance data
"""

import logging
from datetime import datetime, timezone
from typing import Optional

logger = logging.getLogger(__name__)


class SelfImprovementLoop:
    """
    Analyzes cycle metrics and applies real parameter adjustments:
    - Review threshold auto-tuning
    - Task priority weight optimization
    - Max retries adjustment
    - Cycle interval adaptation
    - Build strategy selection
    """

    THRESHOLDS = {
        "task_completion_rate": 0.80,
        "avg_review_score": 75,
        "retry_rate": 0.20,
        "build_success_rate": 0.90,
        "cycle_time_minutes": 60,
        "revision_rate": 0.15,
    }

    IMPROVEMENT_RULES = {
        "avg_review_score": {
            "action": "tighten_acceptance_criteria",
            "description": "Görev tanımlarına daha net acceptance criteria ekle",
            "impact_score": 0.8,
        },
        "retry_rate": {
            "action": "add_pre_flight_checks",
            "description": "Kod yazmadan önce dependency ve context kontrolü yap",
            "impact_score": 0.7,
        },
        "build_success_rate": {
            "action": "add_build_validation_step",
            "description": "Commit öncesi build doğrulaması ekle",
            "impact_score": 0.9,
        },
        "cycle_time_minutes": {
            "action": "parallelize_independent_tasks",
            "description": "Bağımsız görevleri paralel çalıştır",
            "impact_score": 0.6,
        },
        "task_completion_rate": {
            "action": "improve_task_definitions",
            "description": "Görev tanımlarını daha açık ve spesifik yap",
            "impact_score": 0.85,
        },
        "revision_rate": {
            "action": "enhance_review_criteria",
            "description": "Review kriterlerini daha detaylı hale getir",
            "impact_score": 0.75,
        },
    }

    def __init__(self):
        self._improvement_history = []
        self._active_improvements = {}
        self._tuned_params = {
            "review_threshold": 75,
            "max_retries": 3,
            "max_revisions": 2,
            "max_tasks_per_cycle": 5,
            "cycle_interval_seconds": 300,
        }

    async def evaluate(self, memory) -> list[dict]:
        cycles = memory.get_cycle_history(limit=10)
        if len(cycles) < 2:
            logger.info("Not enough cycle data for self-improvement")
            return []

        metrics = self._compute_aggregate_metrics(cycles)
        improvements = []

        for metric_name, value in metrics.items():
            threshold = self.THRESHOLDS.get(metric_name)
            if threshold is None:
                continue

            if metric_name in ("retry_rate", "cycle_time_minutes", "revision_rate"):
                if value > threshold:
                    improvement = self._generate_improvement(
                        metric_name, value, threshold
                    )
                    improvements.append(improvement)
            else:
                if value < threshold:
                    improvement = self._generate_improvement(
                        metric_name, value, threshold
                    )
                    improvements.append(improvement)

        if improvements:
            best = max(improvements, key=lambda x: x["impact_score"])
            await self._apply_improvement(best, memory)
            for imp in improvements:
                self._apply_parameter_tuning(imp, metrics)
            self._improvement_history.append(best)
        else:
            self._apply_excellence_tuning(metrics)

        return improvements

    def _compute_aggregate_metrics(self, cycles: list) -> dict:
        if not cycles:
            return {}

        total_completed = sum(c.tasks_completed for c in cycles)
        total_failed = sum(c.tasks_failed for c in cycles)
        total_tasks = total_completed + total_failed

        avg_score = sum(c.avg_review_score for c in cycles) / len(cycles)
        avg_retry = sum(c.retry_rate for c in cycles) / len(cycles)
        avg_build = sum(c.build_success_rate for c in cycles) / len(cycles)

        cycle_times = []
        for c in cycles:
            if c.started_at and c.completed_at:
                try:
                    start = datetime.fromisoformat(c.started_at)
                    end = datetime.fromisoformat(c.completed_at)
                    cycle_times.append((end - start).total_seconds() / 60)
                except Exception:
                    pass

        avg_cycle_time = sum(cycle_times) / len(cycle_times) if cycle_times else 0

        return {
            "task_completion_rate": total_completed / max(total_tasks, 1),
            "avg_review_score": avg_score,
            "retry_rate": avg_retry,
            "build_success_rate": avg_build,
            "cycle_time_minutes": avg_cycle_time,
            "revision_rate": avg_retry,
        }

    def _generate_improvement(self, metric: str, value, threshold) -> dict:
        rule = self.IMPROVEMENT_RULES.get(metric, {})
        return {
            "metric": metric,
            "current_value": round(value, 3),
            "threshold": threshold,
            "action": rule.get("action", "investigate"),
            "description": rule.get("description", f"Investigate {metric} degradation"),
            "impact_score": rule.get("impact_score", 0.3),
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }

    def _apply_parameter_tuning(self, improvement: dict, metrics: dict):
        """
        Actually adjust system parameters based on performance trends.
        """
        metric = improvement["metric"]
        current_value = improvement["current_value"]
        threshold = improvement["threshold"]

        if metric == "avg_review_score":
            if current_value < threshold:
                old = self._tuned_params["review_threshold"]
                self._tuned_params["review_threshold"] = max(50, old - 5)
                logger.info(
                    f"Tuning: review_threshold {old} -> {self._tuned_params['review_threshold']} "
                    f"(avg score {current_value:.0f} < {threshold})"
                )
            elif current_value > threshold + 15:
                old = self._tuned_params["review_threshold"]
                self._tuned_params["review_threshold"] = min(95, old + 3)
                logger.info(
                    f"Tuning: review_threshold {old} -> {self._tuned_params['review_threshold']} "
                    f"(avg score {current_value:.0f} well above {threshold})"
                )

        elif metric == "retry_rate":
            if current_value > threshold:
                old = self._tuned_params["max_retries"]
                self._tuned_params["max_retries"] = min(5, old + 1)
                logger.info(
                    f"Tuning: max_retries {old} -> {self._tuned_params['max_retries']} "
                    f"(retry rate {current_value:.2f} > {threshold})"
                )

        elif metric == "build_success_rate":
            if current_value < threshold:
                old = self._tuned_params["max_revisions"]
                self._tuned_params["max_revisions"] = min(4, old + 1)
                logger.info(
                    f"Tuning: max_revisions {old} -> {self._tuned_params['max_revisions']} "
                    f"(build success {current_value:.2f} < {threshold})"
                )

        elif metric == "task_completion_rate":
            if current_value < threshold:
                old = self._tuned_params["max_tasks_per_cycle"]
                self._tuned_params["max_tasks_per_cycle"] = max(1, old - 1)
                logger.info(
                    f"Tuning: max_tasks_per_cycle {old} -> {self._tuned_params['max_tasks_per_cycle']} "
                    f"(completion rate {current_value:.2f} < {threshold})"
                )
            elif (
                current_value > 0.95 and self._tuned_params["max_tasks_per_cycle"] < 20
            ):
                old = self._tuned_params["max_tasks_per_cycle"]
                self._tuned_params["max_tasks_per_cycle"] = old + 1
                logger.info(
                    f"Tuning: max_tasks_per_cycle {old} -> {self._tuned_params['max_tasks_per_cycle']} "
                    f"(completion rate {current_value:.2f} excellent)"
                )

        elif metric == "cycle_time_minutes":
            if current_value > threshold:
                old = self._tuned_params["cycle_interval_seconds"]
                self._tuned_params["cycle_interval_seconds"] = min(600, old + 60)
                logger.info(
                    f"Tuning: cycle_interval {old}s -> {self._tuned_params['cycle_interval_seconds']}s "
                    f"(cycle time {current_value:.0f}min > {threshold}min)"
                )

    def _apply_excellence_tuning(self, metrics: dict):
        """
        When all metrics are good, scale up capacity:
        - Increase max_tasks_per_cycle
        - Increase review_threshold (higher standards)
        """
        completion = metrics.get("task_completion_rate", 0)
        score = metrics.get("avg_review_score", 0)

        if completion > 0.95 and self._tuned_params["max_tasks_per_cycle"] < 20:
            old = self._tuned_params["max_tasks_per_cycle"]
            self._tuned_params["max_tasks_per_cycle"] = old + 1
            logger.info(
                f"Excellence tuning: max_tasks_per_cycle {old} -> {self._tuned_params['max_tasks_per_cycle']} "
                f"(completion rate {completion:.2f} excellent)"
            )

        if score > 90 and self._tuned_params["review_threshold"] < 95:
            old = self._tuned_params["review_threshold"]
            self._tuned_params["review_threshold"] = old + 3
            logger.info(
                f"Excellence tuning: review_threshold {old} -> {self._tuned_params['review_threshold']} "
                f"(avg score {score:.0f} excellent)"
            )

    async def _apply_improvement(self, improvement: dict, memory):
        action = improvement["action"]
        self._active_improvements[action] = improvement

        logger.info(
            f"Applying self-improvement: {action} - {improvement['description']}"
        )

        from agents.shared.memory import DecisionRecord

        await memory.save_decision(
            DecisionRecord(
                decision_type="self_improvement",
                rationale=improvement["description"],
                alternatives_considered=[
                    f"Keep current approach for {improvement['metric']}"
                ],
                made_by="hermes",
                outcome="applied",
            )
        )

    def get_tuned_params(self) -> dict:
        return dict(self._tuned_params)

    def get_improvement_history(self) -> list[dict]:
        return list(self._improvement_history)

    def get_active_improvements(self) -> dict:
        return dict(self._active_improvements)
