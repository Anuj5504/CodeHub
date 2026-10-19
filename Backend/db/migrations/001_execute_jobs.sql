-- 001_create_projects --

CREATE TABLE execution_jobs (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    project_id BIGINT NOT NULL REFERENCES projects(id),

    language VARCHAR(30) NOT NULL,
    entrypoint VARCHAR(255) NOT NULL,

    source_snapshot_key TEXT,
    stdin TEXT,

    status VARCHAR(20) NOT NULL DEFAULT 'queued'
        CHECK (
            status IN (
                'queued',
                'running',
                'succeeded',
                'failed',
                'timed_out',
                'cancelled'
            )
        ),

    timeout_ms INTEGER NOT NULL DEFAULT 10000
        CHECK (timeout_ms > 0),
    memory_limit_mb INTEGER NOT NULL DEFAULT 256
        CHECK (memory_limit_mb > 0),

    queue_job_id TEXT,
    worker_id TEXT,
    container_id TEXT,

    exit_code INTEGER,
    stdout TEXT,
    stderr TEXT,

    execution_time_ms INTEGER,
    peak_memory_bytes BIGINT,

    attempt_count INTEGER NOT NULL DEFAULT 0
        CHECK (attempt_count >= 0),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    started_at TIMESTAMPTZ,
    finished_at TIMESTAMPTZ
);

CREATE INDEX idx_execution_jobs_user_created
    ON execution_jobs(user_id, created_at DESC);

CREATE INDEX idx_execution_jobs_project_created
    ON execution_jobs(project_id, created_at DESC);

CREATE INDEX idx_execution_jobs_queued
    ON execution_jobs(created_at)
    WHERE status = 'queued';
