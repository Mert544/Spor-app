"""
Clawbot Deployer - Build ve deploy orchestrator
"""

import os
import subprocess
import logging

logger = logging.getLogger(__name__)


class ClawbotDeployer:
    """
    Başarılı görevleri deploy eder.
    """

    def __init__(self, project_root: str = "."):
        self.project_root = project_root

    async def deploy(self, task_id: str, result: dict) -> dict:
        """Deploy et"""
        deploy_result = {
            "task_id": task_id,
            "success": False,
            "url": "",
            "log": "",
        }

        try:
            # Determine deployment target
            if os.path.exists(os.path.join(self.project_root, "vercel.json")):
                deploy_result = await self._deploy_vercel(task_id, result)
            elif os.path.exists(os.path.join(self.project_root, "Dockerfile")):
                deploy_result = await self._deploy_docker(task_id, result)
            else:
                deploy_result["log"] = (
                    "No deployment target configured (no vercel.json or Dockerfile)"
                )
                deploy_result["success"] = False

        except Exception as e:
            deploy_result["log"] = f"Deploy failed: {e}"
            logger.error(f"Deploy failed for {task_id}: {e}")

        return deploy_result

    async def _deploy_vercel(self, task_id: str, result: dict) -> dict:
        """Vercel deploy"""
        try:
            proc = subprocess.run(
                ["npx", "vercel", "--prod", "--yes"],
                cwd=self.project_root,
                capture_output=True,
                text=True,
                timeout=300,
            )

            url = ""
            for line in proc.stdout.split("\n"):
                if "https://" in line and "vercel" in line.lower():
                    url = line.strip()
                    break

            return {
                "task_id": task_id,
                "success": proc.returncode == 0,
                "url": url,
                "log": proc.stdout + proc.stderr,
            }
        except Exception as e:
            return {
                "task_id": task_id,
                "success": False,
                "url": "",
                "log": f"Vercel deploy failed: {e}",
            }

    async def _deploy_docker(self, task_id: str, result: dict) -> dict:
        """Docker build + deploy"""
        try:
            # Build
            build_proc = subprocess.run(
                ["docker", "build", "-t", "vtaper-coach:latest", "."],
                cwd=self.project_root,
                capture_output=True,
                text=True,
                timeout=300,
            )

            if build_proc.returncode != 0:
                return {
                    "task_id": task_id,
                    "success": False,
                    "url": "",
                    "log": f"Docker build failed: {build_proc.stderr}",
                }

            # Push (if registry configured)
            # docker push ...

            return {
                "task_id": task_id,
                "success": True,
                "url": "docker://vtaper-coach:latest",
                "log": build_proc.stdout,
            }
        except Exception as e:
            return {
                "task_id": task_id,
                "success": False,
                "url": "",
                "log": f"Docker deploy failed: {e}",
            }
