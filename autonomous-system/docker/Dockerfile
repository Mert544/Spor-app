FROM python:3.12-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    curl \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir \
    pyyaml \
    psycopg2-binary \
    redis \
    pydantic \
    pytest \
    ruff

WORKDIR /app

COPY autonomous-system/ ./autonomous-system/

WORKDIR /app/autonomous-system

RUN if [ -f requirements.txt ]; then pip install --no-cache-dir -r requirements.txt; fi

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD python -c "import sys; sys.exit(0)" || exit 1

RUN useradd --create-home appuser
USER appuser

CMD ["python", "main.py"]
