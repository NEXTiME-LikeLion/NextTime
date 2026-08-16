-- Next Me 생성 결과 저장
CREATE TABLE next_me_generations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    change_reason_1 VARCHAR(30) NOT NULL,
    change_reason_2 VARCHAR(30),
    custom_reason VARCHAR(200),
    decision_trigger VARCHAR(500) NOT NULL,
    future_self VARCHAR(500) NOT NULL,
    message_to_future_self VARCHAR(500) NOT NULL,
    generated_message VARCHAR(300) NOT NULL,
    source VARCHAR(20) NOT NULL CHECK (source IN ('AI', 'FALLBACK')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT ck_next_me_change_reason_1 CHECK (
        change_reason_1 IN (
            'HEALTH_FITNESS', 'FAMILY_PEOPLE', 'COST', 'FREEDOM',
            'SMELL_APPEARANCE', 'PREGNANCY_CHILD', 'HOBBY_DAILY', 'OTHER'
        )
    ),
    CONSTRAINT ck_next_me_change_reason_2 CHECK (
        change_reason_2 IS NULL OR change_reason_2 IN (
            'HEALTH_FITNESS', 'FAMILY_PEOPLE', 'COST', 'FREEDOM',
            'SMELL_APPEARANCE', 'PREGNANCY_CHILD', 'HOBBY_DAILY'
        )
    )
);

CREATE INDEX idx_next_me_generations_user_created
    ON next_me_generations (user_id, created_at DESC);
