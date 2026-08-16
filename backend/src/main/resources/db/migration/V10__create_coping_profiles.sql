-- 온보딩 대처 행동 프로필 저장
CREATE TABLE coping_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    custom_action VARCHAR(200),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE coping_profile_actions (
    coping_profile_id UUID NOT NULL REFERENCES coping_profiles(id) ON DELETE CASCADE,
    action_order INTEGER NOT NULL,
    action VARCHAR(40) NOT NULL,
    PRIMARY KEY (coping_profile_id, action_order),
    CONSTRAINT ck_coping_profile_action CHECK (
        action IN (
            'LEAVE_THE_PLACE', 'TAKE_A_WALK', 'DRINK_WATER', 'BRUSH_OR_RINSE',
            'GUM_OR_CANDY', 'STRETCH', 'CONTROL_BREATHING', 'WASH_WITH_COLD_WATER',
            'LISTEN_TO_MUSIC', 'TALK_TO_SOMEONE', 'HIDE_CIGARETTES', 'OTHER'
        )
    )
);

CREATE INDEX idx_coping_profiles_user_created
    ON coping_profiles (user_id, created_at DESC);
