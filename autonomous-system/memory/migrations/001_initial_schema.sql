-- Autonomous System Database Migrations
-- Run on first startup

-- Task history with vector embeddings for semantic search
CREATE TABLE IF NOT EXISTS task_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id VARCHAR(50) UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    status VARCHAR(20) CHECK (status IN ('pending', 'in_progress', 'review', 'completed', 'failed', 'cancelled')),
    priority INT CHECK (priority BETWEEN 1 AND 5),
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    review_score INT,
    review_feedback TEXT,
    attempts INT DEFAULT 0,
    revisions INT DEFAULT 0,
    artifacts JSONB,
    context JSONB,
    embedding VECTOR(1536)
);

-- Error solutions database
CREATE TABLE IF NOT EXISTS error_solutions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    error_hash VARCHAR(64) UNIQUE NOT NULL,
    error_type VARCHAR(100),
    error_message TEXT,
    solution TEXT,
    context JSONB,
    success_count INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Decision log
CREATE TABLE IF NOT EXISTS decisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    decision_type VARCHAR(50),
    rationale TEXT,
    alternatives_considered JSONB,
    made_by VARCHAR(20),
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    outcome VARCHAR(20)
);

-- Cycle metrics
CREATE TABLE IF NOT EXISTS cycle_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cycle_number INT,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    tasks_completed INT,
    tasks_failed INT,
    avg_review_score FLOAT,
    retry_rate FLOAT,
    build_success_rate FLOAT,
    improvements_applied JSONB
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_task_history_status ON task_history(status);
CREATE INDEX IF NOT EXISTS idx_task_history_assigned ON task_history(assigned_at DESC);
CREATE INDEX IF NOT EXISTS idx_error_solutions_hash ON error_solutions(error_hash);
CREATE INDEX IF NOT EXISTS idx_decisions_type ON decisions(decision_type);
CREATE INDEX IF NOT EXISTS idx_cycle_metrics_number ON cycle_metrics(cycle_number);

-- Vector similarity search index
CREATE INDEX IF NOT EXISTS idx_task_history_embedding ON task_history
    USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
