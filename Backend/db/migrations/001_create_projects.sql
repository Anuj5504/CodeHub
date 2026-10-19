-- 001_create_projects --

CREATE TABLE projects (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    owner_id BIGINT NOT NULL
        REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


CREATE TABLE project_members (
    project_id BIGINT NOT NULL
        REFERENCES projects(id) ON DELETE CASCADE,

    user_id BIGINT NOT NULL
        REFERENCES users(id) ON DELETE CASCADE,

    role VARCHAR(20) NOT NULL DEFAULT 'editor'
        CHECK (role IN ('owner', 'editor', 'viewer')),

    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    PRIMARY KEY (project_id, user_id)
);


CREATE TABLE project_files (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    project_id BIGINT NOT NULL
        REFERENCES projects(id) ON DELETE CASCADE,

    parent_id BIGINT
        REFERENCES project_files(id) ON DELETE CASCADE,

    name VARCHAR(255) NOT NULL,

    type VARCHAR(10) NOT NULL
        CHECK (type IN ('file', 'folder')),

    storage_key TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CHECK (
        (type = 'folder' AND storage_key IS NULL)
        OR
        (type = 'file' AND storage_key IS NOT NULL)
    )
);