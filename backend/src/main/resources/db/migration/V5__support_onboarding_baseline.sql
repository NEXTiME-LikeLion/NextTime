-- 온보딩 기본 응답 필드 지원
ALTER TABLE user_profiles
    ALTER COLUMN average_cigarettes_per_day DROP NOT NULL,
    ALTER COLUMN goal_type DROP NOT NULL,
    ALTER COLUMN quit_reason DROP NOT NULL,
    ALTER COLUMN next_me_message DROP NOT NULL,
    ADD COLUMN smoking_frequency VARCHAR(30),
    ADD CONSTRAINT ck_user_profiles_smoking_frequency CHECK (
        smoking_frequency IS NULL OR smoking_frequency IN (
            'UP_TO_5',
            'SIX_TO_TEN',
            'ELEVEN_TO_FIFTEEN',
            'SIXTEEN_TO_TWENTY',
            'TWENTY_ONE_OR_MORE'
        )
    );

ALTER TABLE user_smoking_contexts
    ADD COLUMN custom_text VARCHAR(100);

INSERT INTO smoking_contexts (id, code, name, description, context_type, display_order) VALUES
    ('10000000-0000-0000-0000-000000000007', 'AFTER_WORK_OR_CLASS', '업무·수업이 끝난 직후', '업무나 수업을 마친 직후 담배가 생각나는 상황', 'TRIGGER', 7),
    ('10000000-0000-0000-0000-000000000008', 'DRINKING_OR_SOCIAL', '술자리·모임에서', '술자리나 모임에서 담배가 생각나는 상황', 'TRIGGER', 8),
    ('10000000-0000-0000-0000-000000000009', 'BOREDOM_OR_HABIT', '심심하거나 습관적으로', '특별한 계기 없이 심심하거나 습관적으로 담배가 생각나는 상황', 'TRIGGER', 9),
    ('10000000-0000-0000-0000-000000000010', 'AFTER_WAKING', '아침에 일어난 직후', '아침에 일어난 직후 담배가 생각나는 상황', 'TRIGGER', 10),
    ('10000000-0000-0000-0000-000000000011', 'OTHER', '기타', '사용자가 직접 입력한 반복적인 흡연 상황', 'TRIGGER', 11)
ON CONFLICT (code) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    context_type = EXCLUDED.context_type,
    display_order = EXCLUDED.display_order,
    is_active = TRUE,
    updated_at = now();
