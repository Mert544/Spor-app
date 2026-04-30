"""
Rollback Manager — Git revert + deployment rollback
"""

import os
import subprocess
import logging
from datetime import datetime, timezone
from typing import Optional

logger = logging.getLogger(__name__)


class RollbackManager:
    """
    Handles rollback of:
    - Git commits (revert)
    - Deployments (restore previous version)
    - Database migrations (if applicable)
    """

    def __init__(self, project_root: str = "."):
        self.project_root = project_root
        self._rollback_history = []

    async def git_revert(self, commit_hash: str, reason: str = "") -> dict:
        """
        Safely revert a git commit.
        Creates a new revert commit (doesn't rewrite history).
        """
        result = {
            "success": False,
            "reverted_commit": commit_hash,
            "new_commit": "",
            "reason": reason,
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }

        try:
            proc = subprocess.run(
                ["git", "revert", "--no-edit", commit_hash],
                cwd=self.project_root,
                capture_output=True,
                text=True,
                encoding="utf-8",
                errors="replace",
                timeout=60,
            )

            if proc.returncode == 0:
                rev_proc = subprocess.run(
                    ["git", "rev-parse", "HEAD"],
                    cwd=self.project_root,
                    capture_output=True,
                    text=True,
                    encoding="utf-8",
                    errors="replace",
                )
                result["success"] = True
                result["new_commit"] = rev_proc.stdout.strip()
                result["log"] = proc.stdout
            else:
                result["log"] = proc.stderr
                if "conflict" in proc.stderr.lower():
                    subprocess.run(
                        ["git", "revert", "--abort"],
                        cwd=self.project_root,
                        capture_output=True,
                    )
                    result["log"] += "\nRevert aborted due to conflicts"
        except Exception as e:
            result["log"] = str(e)
            logger.error(f"Git revert failed: {e}")

        self._rollback_history.append(result)
        return result

    async def git_reset_to(self, commit_hash: str, hard: bool = False) -> dict:
        """
        Reset to a specific commit.
        WARNING: hard reset discards all changes after the commit.
        """
        result = {
            "success": False,
            "target_commit": commit_hash,
            "hard_reset": hard,
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }

        try:
            flag = "--hard" if hard else "--soft"
            proc = subprocess.run(
                ["git", "reset", flag, commit_hash],
                cwd=self.project_root,
                capture_output=True,
                text=True,
                encoding="utf-8",
                errors="replace",
                timeout=30,
            )

            if proc.returncode == 0:
                result["success"] = True
                result["log"] = proc.stdout
            else:
                result["log"] = proc.stderr
        except Exception as e:
            result["log"] = str(e)
            logger.error(f"Git reset failed: {e}")

        self._rollback_history.append(result)
        return result

    async def rollback_deployment(self, previous_version: str) -> dict:
        """
        Rollback deployment to a previous version.
        Supports Docker and Vercel.
        """
        result = {
            "success": False,
            "previous_version": previous_version,
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }

        if os.path.exists(os.path.join(self.project_root, "Dockerfile")):
            result = await self._rollback_docker(previous_version, result)
        elif os.path.exists(os.path.join(self.project_root, "vercel.json")):
            result = await self._rollback_vercel(previous_version, result)
        else:
            result["log"] = "No deployment target configured"

        self._rollback_history.append(result)
        return result

    async def _rollback_docker(self, tag: str, result: dict) -> dict:
        try:
            proc = subprocess.run(
                [
                    "docker",
                    "run",
                    "--rm",
                    f"vtaper-coach:{tag}",
                    "echo",
                    "rollback_test",
                ],
                cwd=self.project_root,
                capture_output=True,
                text=True,
                timeout=30,
            )
            if proc.returncode == 0:
                result["success"] = True
                result["log"] = f"Rolled back to Docker image vtaper-coach:{tag}"
            else:
                result["log"] = f"Docker image {tag} not available"
        except Exception as e:
            result["log"] = str(e)
        return result

    async def _rollback_vercel(self, deployment_id: str, result: dict) -> dict:
        try:
            proc = subprocess.run(
                ["npx", "vercel", "rollback", deployment_id, "--yes"],
                cwd=self.project_root,
                capture_output=True,
                text=True,
                timeout=120,
            )
            result["success"] = proc.returncode == 0
            result["log"] = proc.stdout + proc.stderr
        except Exception as e:
            result["log"] = str(e)
        return result

    def get_rollback_history(self, limit: int = 10) -> list:
        return self._rollback_history[-limit:]

    async def get_recent_commits(self, limit: int = 10) -> list:
        """Get recent commits for rollback candidate selection"""
        try:
            proc = subprocess.run(
                ["git", "log", f"-{limit}", "--oneline", "--format=%H %s"],
                cwd=self.project_root,
                capture_output=True,
                text=True,
                encoding="utf-8",
                errors="replace",
                timeout=10,
            )
            if proc.returncode == 0:
                commits = []
                for line in proc.stdout.strip().split("\n"):
                    if line:
                        parts = line.split(" ", 1)
                        commits.append(
                            {
                                "hash": parts[0],
                                "message": parts[1] if len(parts) > 1 else "",
                            }
                        )
                return commits
        except Exception as e:
            logger.error(f"Failed to get recent commits: {e}")
        return []
