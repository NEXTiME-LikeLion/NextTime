ALTER TABLE user_profiles
    ADD COLUMN difficult_moment VARCHAR(500);

ALTER TABLE user_profiles
    DROP CONSTRAINT IF EXISTS user_profiles_goal_type_check;

ALTER TABLE user_profiles
    ADD CONSTRAINT ck_user_profiles_goal_type CHECK (
        goal_type IS NULL OR goal_type IN (
            'QUIT', 'REDUCE', 'UNDECIDED', 'DELAY', 'EXPLORE'
        )
    );

CREATE TABLE user_tobacco_types (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tobacco_type VARCHAR(30) NOT NULL
        CHECK (tobacco_type IN ('CIGARETTE', 'HEATED_TOBACCO', 'LIQUID_E_CIGARETTE')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, tobacco_type)
);
