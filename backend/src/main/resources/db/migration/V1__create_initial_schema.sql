CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cognito_sub VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(320) NOT NULL UNIQUE,
    onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE user_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    average_cigarettes_per_day SMALLINT NOT NULL
        CHECK (average_cigarettes_per_day >= 0),
    goal_type VARCHAR(30) NOT NULL
        CHECK (goal_type IN ('QUIT', 'REDUCE', 'DELAY', 'EXPLORE')),
    quit_reason TEXT NOT NULL,
    future_self TEXT,
    next_me_message TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE smoking_contexts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    display_order SMALLINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE user_smoking_contexts (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    context_id UUID NOT NULL REFERENCES smoking_contexts(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, context_id)
);

CREATE TABLE missions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) NOT NULL UNIQUE,
    action_type VARCHAR(50) NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    completion_criteria TEXT NOT NULL,
    estimated_seconds INTEGER NOT NULL CHECK (estimated_seconds > 0),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE user_mission_preferences (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    mission_id UUID NOT NULL REFERENCES missions(id) ON DELETE RESTRICT,
    preference_type VARCHAR(20) NOT NULL
        CHECK (preference_type IN ('AVAILABLE', 'PREFERRED', 'EXCLUDED')),
    source VARCHAR(20) NOT NULL
        CHECK (source IN ('USER_SELECTED', 'AI_CLASSIFIED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, mission_id)
);

CREATE TABLE next_time_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(30) NOT NULL DEFAULT 'CREATED'
        CHECK (status IN (
            'CREATED', 'CONTEXT_SAVED', 'MISSION_RECOMMENDED',
            'MISSION_STARTED', 'MISSION_COMPLETED', 'RESULT_RECORDED',
            'CANCELLED', 'EXPIRED'
        )),
    craving_before SMALLINT CHECK (craving_before BETWEEN 1 AND 5),
    recommended_mission_id UUID REFERENCES missions(id) ON DELETE RESTRICT,
    mission_code_snapshot VARCHAR(50),
    mission_name_snapshot VARCHAR(150),
    mission_description_snapshot TEXT,
    completion_criteria_snapshot TEXT,
    estimated_seconds_snapshot INTEGER CHECK (estimated_seconds_snapshot > 0),
    recommendation_reason TEXT,
    recommendation_source VARCHAR(20)
        CHECK (recommendation_source IN ('RULE', 'AI', 'FALLBACK')),
    craving_after SMALLINT CHECK (craving_after BETWEEN 1 AND 5),
    result VARCHAR(20) CHECK (result IN ('NOT_SMOKED', 'DELAYED', 'SMOKED')),
    delayed_seconds INTEGER CHECK (delayed_seconds >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    context_saved_at TIMESTAMPTZ,
    recommended_at TIMESTAMPTZ,
    mission_started_at TIMESTAMPTZ,
    mission_completed_at TIMESTAMPTZ,
    result_recorded_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    version BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT ck_completed_session_result CHECK (
        status <> 'RESULT_RECORDED'
        OR (result IS NOT NULL AND craving_after IS NOT NULL AND result_recorded_at IS NOT NULL)
    )
);

CREATE TABLE next_time_session_contexts (
    session_id UUID NOT NULL REFERENCES next_time_sessions(id) ON DELETE CASCADE,
    context_id UUID NOT NULL REFERENCES smoking_contexts(id) ON DELETE RESTRICT,
    PRIMARY KEY (session_id, context_id)
);

CREATE TABLE smoking_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    smoked_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE smoking_record_contexts (
    smoking_record_id UUID NOT NULL REFERENCES smoking_records(id) ON DELETE CASCADE,
    context_id UUID NOT NULL REFERENCES smoking_contexts(id) ON DELETE RESTRICT,
    PRIMARY KEY (smoking_record_id, context_id)
);

CREATE TABLE ai_generation_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    session_id UUID REFERENCES next_time_sessions(id) ON DELETE SET NULL,
    purpose VARCHAR(40) NOT NULL,
    prompt_version VARCHAR(30) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('SUCCESS', 'FAILED', 'TIMEOUT')),
    fallback_used BOOLEAN NOT NULL DEFAULT FALSE,
    latency_ms INTEGER CHECK (latency_ms >= 0),
    request_payload JSONB,
    response_payload JSONB,
    error_code VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX uq_active_next_time_per_user
    ON next_time_sessions (user_id)
    WHERE status IN (
        'CREATED', 'CONTEXT_SAVED', 'MISSION_RECOMMENDED',
        'MISSION_STARTED', 'MISSION_COMPLETED'
    );

CREATE INDEX idx_next_time_user_created
    ON next_time_sessions (user_id, created_at DESC);

CREATE INDEX idx_next_time_user_result
    ON next_time_sessions (user_id, result, result_recorded_at DESC);

CREATE INDEX idx_next_time_mission_result
    ON next_time_sessions (recommended_mission_id, result, result_recorded_at DESC);

CREATE INDEX idx_smoking_records_user_smoked
    ON smoking_records (user_id, smoked_at DESC);

CREATE INDEX idx_ai_generation_logs_user_created
    ON ai_generation_logs (user_id, created_at DESC);
