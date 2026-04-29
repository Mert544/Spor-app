# 30-Day Autonomous System Roadmap

## Phase 1: Foundation & Bug Fixes (Days 1-7) — DONE

### PR-001: Critical Bug Fixes ✅
- Fix threshold mismatch (supervisor 60 → 75 to match strategist)
- Fix analyzer counter accumulation (add `_reset_counters()`)
- Fix builder marking failed builds as completed
- Fix deployer reporting success when nothing deployed
- Fix redundant imports in supervisor.py
- Fix security `validate_code()` never called (wire into builder)
- Fix rate limiting advisory only (enforce in `record_operation()`)

### PR-002: Config System ✅
- Create `config/config.py` — YAML loader with fallback defaults
- Create `config/schema.py` — Pydantic validation schema
- Integrate config loading into `main.py` and `supervisor.py`

### PR-003: Docker Fixes ✅
- Add git, curl, nodejs to Dockerfile
- Add healthcheck
- Add non-root user
- Add conditional requirements.txt install

### PR-004: Test Coverage Expansion ✅
- 41 tests covering all agent modules
- Tests for analyzer, planner, reviewer, builder, deployer, fixer, tester
- Integration tests for config loading and security enforcement

## Phase 2: Persistence & Reliability (Days 8-14)

### PR-005: PostgreSQL Persistent Memory
- `agents/shared/postgres_memory.py` — Async connection pooling
- Schema migrations (task_history, error_solutions, decisions, cycle_metrics, experiences, checkpoints)
- Automatic retries on transient failures (3 attempts with exponential backoff)
- Bulk operations for high-throughput scenarios
- **Status**: Code written, needs integration test with real PostgreSQL

### PR-006: Redis Message Bus
- `agents/shared/redis_bus.py` — Pub/sub + task queue
- Message deduplication via Redis SET with TTL
- Dead letter queue for failed tasks
- Priority-based task queue (sorted set)
- **Status**: Code written, needs integration test with real Redis

### PR-007: Crash Recovery
- `agents/shared/crash_recovery.py` — Atomic checkpoint save/restore
- Write-ahead log (WAL) style checkpointing
- Full state serialization (tasks, errors, decisions, cycles, session)
- Corruption detection via SHA-256 checksums
- Atomic file replacement (os.replace)
- Backup of previous checkpoint
- **Status**: Code written, integrated into supervisor.py

### PR-008: Git + Deployment Rollback
- `agents/shared/rollback.py` — Safe revert operations
- `git revert` (creates new commit, doesn't rewrite history)
- `git reset --soft/--hard` (with safety warnings)
- Docker image rollback
- Vercel deployment rollback
- Rollback history tracking
- **Status**: Code written, needs integration test

## Phase 3: Observability & Scaling (Days 15-21)

### PR-009: Observability Stack
- `monitoring/observability.py` — Structured logging, metrics, tracing
- `MetricsCollector` — Prometheus-compatible counters, gauges, histograms
- `StructuredFormatter` — JSON log output for log aggregation
- `Tracer` — Lightweight distributed tracing with span relationships
- Prometheus `/metrics` endpoint (HTTP server)
- Grafana dashboard templates
- **Status**: Code written, needs HTTP metrics endpoint

### PR-010: Multi-Agent Concurrency
- `agents/shared/worker_pool.py` — Async worker pool
- Configurable concurrency (default 4 workers)
- Priority-based task queue
- Worker health monitoring
- `ConcurrentTaskRunner` — Batch parallel execution with semaphore
- **Status**: Code written, needs integration into supervisor._process_task

### PR-011: Circuit Breaker Pattern
- Add circuit breaker to supervisor for external service calls
- Open state after N consecutive failures
- Half-open state for recovery testing
- Configurable thresholds per service (LLM API, git, npm, Docker)

### PR-012: LLM Integration
- Replace stub code generation with real LLM API calls
- Support OpenAI, Anthropic, and local models
- Prompt templates for code generation, review, and fix suggestions
- Token usage tracking and cost estimation
- Response caching for repeated patterns

## Phase 4: Production Hardening (Days 22-30)

### PR-013: Self-Improvement Engine
- Actual parameter tuning (not just logging)
- Review score threshold auto-adjustment based on historical data
- Task priority weight optimization
- Build strategy adaptation based on project type
- A/B testing framework for improvement strategies

### PR-014: Security Hardening
- Sandboxed code execution (Docker containers)
- File system access restrictions
- Network access controls
- Secret scanning in git pre-commit hooks
- Audit logging for all operations
- Role-based access control for admin actions

### PR-015: Dashboard & API
- FastAPI REST API for monitoring and control
- Real-time WebSocket updates for cycle progress
- Task history browser
- Metrics dashboard
- Admin controls (pause, resume, manual task creation)

### PR-016: Deployment Pipeline
- CI/CD with GitHub Actions
- Automated testing on PR
- Docker image build and push
- Staging environment deployment
- Production deployment with canary releases
- Automated rollback on health check failure

## Key Metrics to Track

| Metric | Current | Target (Day 30) |
|--------|---------|-----------------|
| Test coverage | 41 tests | 100+ tests |
| Tasks/cycle | 5 | 20+ |
| Review score avg | ~62 | 80+ |
| Crash recovery | Stats only | Full state |
| Persistence | In-memory | PostgreSQL |
| Concurrency | Sequential | 4+ workers |
| Observability | Console logs | Prometheus + traces |
| LLM integration | Stub | Production API |
| Self-improvement | Logging only | Parameter tuning |

## Risk Mitigation

1. **PostgreSQL/Redis not available**: System falls back to in-memory mode gracefully
2. **LLM API failures**: Circuit breaker prevents cascade, falls back to template-based generation
3. **Infinite loops**: SecurityGuard detects repetition, supervisor has max_retries/max_revisions
4. **Data corruption**: Checksum validation on checkpoints, backup retention
5. **Security violations**: System auto-pauses on critical violations, requires admin resume
