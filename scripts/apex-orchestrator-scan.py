#!/usr/bin/env python3
"""
Apex Orchestrator Scan — Python wrapper for V-Taper Coach

Usage:
    python scripts/apex-orchestrator-scan.py
    python scripts/apex-orchestrator-scan.py --plan=project_scan
    python scripts/apex-orchestrator-scan.py --plan=semantic_patch_loop --goal="refactor stores"
    python scripts/apex-orchestrator-scan.py --mode=report

Requires:
    - Python 3.10+
    - Apex Orchestrator installed: cd ../Apex-orchestrator && pip install -e .
"""

from __future__ import annotations

import os
import subprocess
import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).parent.parent.resolve()

# Try to find Apex Orchestrator
APEX_ORCH_PATHS = [
    PROJECT_ROOT.parent / "Apex-orchestrator",
    Path.home() / "Apex-orchestrator",
    PROJECT_ROOT / "tools" / "Apex-orchestrator",
    Path(os.environ.get("APEX_ORCHESTRATOR_PATH", "")),
]


def find_apex_orchestrator() -> Path | None:
    for path in APEX_ORCH_PATHS:
        if path and (path / "app" / "main.py").exists():
            return path
    return None


def run_apex_orchestrator(args: list[str]) -> int:
    apex_path = find_apex_orchestrator()
    if not apex_path:
        print("\n[X] Apex Orchestrator not found.")
        print("Please install it:")
        print("  cd ../Apex-orchestrator")
        print("  pip install -e .")
        print("\nOr set APEX_ORCHESTRATOR_PATH environment variable.")
        return 1

    # Parse script args into env vars (app.main reads env, not CLI args)
    plan = "project_scan"
    mode = "report"
    goal = ""
    fractal = False
    max_depth = 3

    i = 0
    while i < len(args):
        if args[i] == "--plan" and i + 1 < len(args):
            plan = args[i + 1]
            i += 2
        elif args[i] == "--mode" and i + 1 < len(args):
            mode = args[i + 1]
            i += 2
        elif args[i] == "--goal" and i + 1 < len(args):
            goal = args[i + 1]
            i += 2
        elif args[i] == "--fractal":
            fractal = True
            i += 1
        elif args[i] == "--max-depth" and i + 1 < len(args):
            max_depth = int(args[i + 1])
            i += 2
        else:
            i += 1

    env = os.environ.copy()
    env["EPISTEMIC_TARGET_ROOT"] = str(PROJECT_ROOT)
    env["EPISTEMIC_AUTOMATION_PLAN"] = plan
    env["APEX_MODE"] = mode
    env["PYTHONIOENCODING"] = "utf-8"
    env["PYTHONPATH"] = f"{apex_path}{':' + env.get('PYTHONPATH', '')}"
    if goal:
        env["EPISTEMIC_OBJECTIVE"] = goal
    if fractal:
        env["APEX_USE_FRACTAL"] = "1"
    env["APEX_MAX_FRACTAL_BUDGET"] = str(max_depth)

    cmd = [sys.executable, "-m", "app.main"]
    print(f"[RUN] {' '.join(cmd)}")
    print(f"[PROJECT] {PROJECT_ROOT}")
    print(f"[APEX] {apex_path}")
    print(f"[PLAN] {plan} | [MODE] {mode}")
    print("")

    result = subprocess.run(cmd, cwd=str(apex_path), env=env)
    return result.returncode


def main() -> int:
    import argparse

    parser = argparse.ArgumentParser(
        description="Apex Orchestrator Scan for V-Taper Coach"
    )
    parser.add_argument(
        "--plan",
        default="project_scan",
        choices=[
            "project_scan",
            "focused_branch",
            "verify_project",
            "semantic_patch_loop",
            "semantic_apply_loop",
            "git_pr_loop",
            "full_autonomous_loop",
            "self_directed_loop",
            "telemetry_only",
        ],
        help="Automation plan to run",
    )
    parser.add_argument(
        "--goal",
        default="",
        help="Natural language goal (for autonomous mode)",
    )
    parser.add_argument(
        "--mode",
        default="report",
        choices=["report", "supervised", "autonomous"],
        help="Execution mode",
    )
    parser.add_argument(
        "--fractal",
        action="store_true",
        help="Enable fractal 5-Whys analysis",
    )
    parser.add_argument(
        "--max-depth",
        type=int,
        default=3,
        help="Max fractal depth",
    )

    args = parser.parse_args()

    orch_args = []
    if args.plan:
        orch_args.extend(["--plan", args.plan])
    if args.goal:
        orch_args.extend(["--goal", args.goal])
    if args.mode:
        orch_args.extend(["--mode", args.mode])
    if args.fractal:
        orch_args.append("--fractal")
    if args.max_depth:
        orch_args.extend(["--max-depth", str(args.max_depth)])

    return run_apex_orchestrator(orch_args)


if __name__ == "__main__":
    sys.exit(main())
