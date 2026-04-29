"""
Main Entry Point - Otonom geliştirme sistemini başlat
"""

import asyncio
import logging
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from supervisor import Supervisor
from config.config import load_config
from config.schema import validate_config
from agents.shared.crash_recovery import CrashRecovery


def setup_logging(level: str = "INFO"):
    logging.basicConfig(
        level=getattr(logging, level.upper(), logging.INFO),
        format="%(asctime)s | %(name)-20s | %(levelname)-8s | %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
        handlers=[
            logging.StreamHandler(sys.stdout),
            logging.FileHandler("autonomous-system.log"),
        ],
    )


async def main():
    config = load_config()

    raw = {
        "system": {
            "name": config.system.name,
            "version": config.system.version,
            "log_level": config.system.log_level,
        },
        "hermes": {
            "cycle_interval_seconds": config.hermes.cycle_interval_seconds,
            "max_tasks_per_cycle": config.hermes.max_tasks_per_cycle,
            "review_threshold": config.hermes.review_threshold,
        },
        "clawbot": {
            "max_retries": config.clawbot.max_retries,
            "max_revisions": config.clawbot.max_revisions,
        },
        "memory": {
            "use_database": config.memory.use_database,
            "db_url": config.memory.db_url,
            "redis_url": config.memory.redis_url,
        },
    }
    is_valid, errors = validate_config(raw)
    if not is_valid:
        logging.getLogger("main").warning(f"Config validation warnings: {errors}")

    setup_logging(config.system.log_level)
    logger = logging.getLogger("main")

    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

    recovery = CrashRecovery(project_root)
    saved_state = await recovery.load_state()
    if saved_state:
        logger.info(
            f"Crash recovery: found state from {saved_state.get('saved_at', 'unknown')}"
        )

    supervisor = Supervisor(
        project_root=project_root,
        cycle_interval_seconds=config.hermes.cycle_interval_seconds,
        max_retries=config.clawbot.max_retries,
        max_revisions=config.clawbot.max_revisions,
    )

    try:
        await supervisor.start()
    except KeyboardInterrupt:
        logger.info("Interrupted by user")
    except asyncio.CancelledError:
        logger.info("Cancelled")
    except Exception as e:
        logger.error(f"Fatal error: {e}", exc_info=True)
    finally:
        await supervisor.shutdown()


if __name__ == "__main__":
    asyncio.run(main())
