-- NEXT TIME 정책 명세 정합성 보정
-- 1. 욕구 단계를 정책에서 사용하는 명시적인 값으로 변경한다.
-- 2. 정확한 흡연 지연 시간은 MVP에서 수집하지 않는다.
-- 3. 미션 평가와 규칙 기반 추천 출처를 저장한다.
-- 4. Trigger와 행동 Pool을 정책 명세와 일치시킨다.

ALTER TABLE next_time_sessions
    DROP CONSTRAINT IF EXISTS next_time_sessions_craving_before_check,
    DROP CONSTRAINT IF EXISTS next_time_sessions_craving_after_check,
    DROP CONSTRAINT IF EXISTS next_time_sessions_recommendation_source_check;

ALTER TABLE next_time_sessions
    ALTER COLUMN craving_before TYPE VARCHAR(10)
        USING CASE craving_before
            WHEN 1 THEN 'LOW'
            WHEN 2 THEN 'LOW'
            WHEN 3 THEN 'MEDIUM'
            WHEN 4 THEN 'MEDIUM'
            WHEN 5 THEN 'HIGH'
            ELSE NULL
        END,
    ALTER COLUMN craving_after TYPE VARCHAR(10)
        USING CASE craving_after
            WHEN 1 THEN 'NONE'
            WHEN 2 THEN 'LOW'
            WHEN 3 THEN 'MEDIUM'
            WHEN 4 THEN 'HIGH'
            WHEN 5 THEN 'HIGH'
            ELSE NULL
        END,
    DROP COLUMN delayed_seconds,
    ADD COLUMN mission_helpfulness VARCHAR(20);

ALTER TABLE next_time_sessions
    ADD CONSTRAINT ck_next_time_craving_before
        CHECK (craving_before IN ('LOW', 'MEDIUM', 'HIGH')),
    ADD CONSTRAINT ck_next_time_craving_after
        CHECK (craving_after IN ('NONE', 'LOW', 'MEDIUM', 'HIGH')),
    ADD CONSTRAINT ck_next_time_mission_helpfulness
        CHECK (mission_helpfulness IN ('HELPFUL', 'NEUTRAL', 'NOT_FIT')),
    ADD CONSTRAINT ck_next_time_recommendation_source
        CHECK (recommendation_source IN ('RULE', 'FALLBACK'));

-- 기존 Trigger 식별자는 참조 무결성을 위해 유지하고 코드와 표시값만 보정한다.
UPDATE smoking_contexts
SET code = 'WORK_OR_STUDY_ENDED',
    name = '일·공부가 끝나서',
    description = '일이나 공부를 마친 뒤 담배가 생각나는 상황',
    display_order = 1,
    updated_at = now()
WHERE code = 'WITH_COFFEE';

UPDATE smoking_contexts
SET name = '밥을 먹고 나서',
    description = '식사를 마친 뒤 담배가 생각나는 상황',
    display_order = 2,
    updated_at = now()
WHERE code = 'AFTER_MEAL';

UPDATE smoking_contexts
SET name = '스트레스를 받아서',
    description = '스트레스를 받은 뒤 담배가 생각나는 상황',
    display_order = 3,
    updated_at = now()
WHERE code = 'STRESS';

UPDATE smoking_contexts
SET code = 'BORED_OR_RESTING',
    name = '쉬다가·심심해서',
    description = '쉬거나 심심한 중에 담배가 생각나는 상황',
    display_order = 4,
    updated_at = now()
WHERE code = 'BREAK_TIME';

UPDATE smoking_contexts
SET name = '술을 마시고 있어서',
    description = '술을 마시는 중 담배가 생각나는 상황',
    display_order = 5,
    updated_at = now()
WHERE code = 'DRINKING';

UPDATE smoking_contexts
SET code = 'OTHERS_SMOKING',
    name = '다른 사람이 피우러 가서',
    description = '주변 사람이 담배를 피우러 가는 상황',
    display_order = 6,
    updated_at = now()
WHERE code = 'WITH_SMOKERS';

-- 추천 엔진의 행동 부담 보정과 기본 이유 문구에 필요한 속성이다.
ALTER TABLE missions
    ADD COLUMN effort_type VARCHAR(20),
    ADD COLUMN default_reason TEXT,
    ADD COLUMN display_order SMALLINT;

ALTER TABLE missions
    ADD CONSTRAINT ck_mission_effort_type
        CHECK (effort_type IN ('LOW_EFFORT', 'ACTIVE')),
    ADD CONSTRAINT ck_mission_display_order
        CHECK (display_order > 0);

-- 기존 미션은 식별자를 유지하면서 정책 행동 Pool에 맞춘다.
UPDATE missions
SET code = 'DRINK_WATER',
    action_type = 'WATER',
    name = '물 마시기',
    description = '물 한 잔을 천천히 마셔보세요.',
    completion_criteria = '물 한 잔을 모두 마시면 완료',
    estimated_seconds = 60,
    effort_type = 'LOW_EFFORT',
    default_reason = '바로 할 수 있는 다른 행동으로 흐름을 잠깐 바꿔볼게요.',
    display_order = 3,
    updated_at = now()
WHERE id = '20000000-0000-0000-0000-000000000001';

UPDATE missions
SET code = 'STEADY_BREATHING',
    action_type = 'BREATHING',
    name = '호흡 가다듬기',
    description = '천천히 숨을 들이마시고 내쉬는 데 2분만 집중해보세요.',
    completion_criteria = '2분 동안 천천히 호흡하면 완료',
    estimated_seconds = 120,
    effort_type = 'LOW_EFFORT',
    default_reason = '지금 바로 할 수 있는 짧은 호흡으로 흐름을 바꿔볼게요.',
    display_order = 7,
    updated_at = now()
WHERE id = '20000000-0000-0000-0000-000000000002';

UPDATE missions
SET code = 'SHORT_WALK',
    action_type = 'WALKING',
    name = '잠깐 걷기',
    description = '5분만 걸으며 지금 장소와 흐름을 바꿔보세요.',
    completion_criteria = '5분 동안 걸으면 완료',
    estimated_seconds = 300,
    effort_type = 'ACTIVE',
    default_reason = '짧게 몸을 움직이며 욕구가 지나갈 시간을 만들어볼게요.',
    display_order = 2,
    updated_at = now()
WHERE id = '20000000-0000-0000-0000-000000000003';

UPDATE missions
SET code = 'SHORT_STRETCHING',
    action_type = 'STRETCHING',
    name = '짧게 스트레칭하기',
    description = '2분만 몸을 펴고 가볍게 움직여보세요.',
    completion_criteria = '2분 동안 가볍게 스트레칭하면 완료',
    estimated_seconds = 120,
    effort_type = 'LOW_EFFORT',
    default_reason = '긴장과 주의를 짧은 움직임으로 바꿔볼게요.',
    display_order = 6,
    updated_at = now()
WHERE id = '20000000-0000-0000-0000-000000000004';

UPDATE missions
SET code = 'TALK_TO_SOMEONE',
    action_type = 'SOCIAL_SUPPORT',
    name = '누군가와 이야기하기',
    description = '흡연하러 따라가기보다 다른 사람과 잠깐 이야기해보세요.',
    completion_criteria = '다른 사람과 잠깐 대화하면 완료',
    estimated_seconds = 180,
    effort_type = 'ACTIVE',
    default_reason = '흡연하는 흐름에 합류하지 않고 다른 사람과 연결해볼게요.',
    display_order = 10,
    updated_at = now()
WHERE id = '20000000-0000-0000-0000-000000000005';

INSERT INTO missions (
    id, code, action_type, name, description, completion_criteria,
    estimated_seconds, effort_type, default_reason, display_order
) VALUES
    (
        '20000000-0000-0000-0000-000000000006',
        'LEAVE_THE_SPOT', 'LOCATION_CHANGE', '그 자리에서 벗어나기',
        '흡연 단서가 보이지 않는 곳으로 먼저 이동해보세요.',
        '흡연 단서가 보이지 않는 장소로 이동하면 완료',
        180, 'ACTIVE',
        '지금은 참으려 하기보다 담배가 보이는 장소에서 먼저 거리를 둘게요.', 1
    ),
    (
        '20000000-0000-0000-0000-000000000007',
        'BRUSH_OR_RINSE', 'ORAL_CARE', '양치하거나 입 헹구기',
        '양치하거나 입을 헹구며 식후 루틴을 바꿔보세요.',
        '양치하거나 입을 헹구면 완료',
        120, 'LOW_EFFORT',
        '식사 뒤 바로 이어지는 흡연 루틴을 다른 행동으로 끊어볼게요.', 4
    ),
    (
        '20000000-0000-0000-0000-000000000008',
        'GUM_OR_CANDY', 'ORAL_SUBSTITUTE', '껌이나 사탕 먹기',
        '껌이나 사탕으로 입을 잠깐 바쁘게 해보세요.',
        '껌이나 사탕을 먹으면 완료',
        120, 'LOW_EFFORT',
        '입과 주의를 다른 행동으로 바꿔볼게요.', 5
    ),
    (
        '20000000-0000-0000-0000-000000000009',
        'COLD_WATER', 'SENSORY_CHANGE', '차가운 물로 손이나 얼굴 씻기',
        '찬물로 손이나 얼굴을 씻으며 잠깐 감각을 바꿔보세요.',
        '찬물로 손이나 얼굴을 씻으면 완료',
        60, 'LOW_EFFORT',
        '감각을 바꾸는 짧은 행동으로 주의를 돌려볼게요.', 8
    ),
    (
        '20000000-0000-0000-0000-000000000010',
        'LISTEN_TO_MUSIC', 'DISTRACTION', '음악 듣기',
        '좋아하는 음악 한 곡에만 잠깐 집중해보세요.',
        '3분 동안 음악에 집중하면 완료',
        180, 'LOW_EFFORT',
        '다른 자극에 잠깐 집중하며 흐름을 바꿔볼게요.', 9
    ),
    (
        '20000000-0000-0000-0000-000000000011',
        'HIDE_TOBACCO', 'CUE_REMOVAL', '담배를 눈에 안 보이게 두기',
        '담배와 라이터를 바로 손이 닿지 않는 곳에 넣어두세요.',
        '담배와 라이터를 눈에 보이지 않는 곳에 두면 완료',
        60, 'LOW_EFFORT',
        '눈앞의 흡연 단서를 먼저 줄여볼게요.', 11
    );

ALTER TABLE missions
    ALTER COLUMN effort_type SET NOT NULL,
    ALTER COLUMN default_reason SET NOT NULL,
    ALTER COLUMN display_order SET NOT NULL;

CREATE UNIQUE INDEX uq_missions_display_order
    ON missions (display_order);

-- 장소 Hard Filter를 데이터로 표현한다.
CREATE TABLE mission_available_locations (
    mission_id UUID NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
    location_context_id UUID NOT NULL REFERENCES smoking_contexts(id) ON DELETE RESTRICT,
    PRIMARY KEY (mission_id, location_context_id)
);

INSERT INTO mission_available_locations (mission_id, location_context_id)
SELECT mission.id, location.id
FROM (
    VALUES
        ('LEAVE_THE_SPOT', 'HOME'),
        ('LEAVE_THE_SPOT', 'WORKPLACE_OR_SCHOOL'),
        ('LEAVE_THE_SPOT', 'NEAR_SMOKING_AREA'),
        ('LEAVE_THE_SPOT', 'SOCIAL_DRINKING'),
        ('SHORT_WALK', 'HOME'),
        ('SHORT_WALK', 'WORKPLACE_OR_SCHOOL'),
        ('SHORT_WALK', 'NEAR_SMOKING_AREA'),
        ('SHORT_WALK', 'SOCIAL_DRINKING'),
        ('DRINK_WATER', 'HOME'),
        ('DRINK_WATER', 'WORKPLACE_OR_SCHOOL'),
        ('DRINK_WATER', 'ON_THE_MOVE'),
        ('DRINK_WATER', 'SOCIAL_DRINKING'),
        ('BRUSH_OR_RINSE', 'HOME'),
        ('BRUSH_OR_RINSE', 'WORKPLACE_OR_SCHOOL'),
        ('GUM_OR_CANDY', 'HOME'),
        ('GUM_OR_CANDY', 'WORKPLACE_OR_SCHOOL'),
        ('GUM_OR_CANDY', 'ON_THE_MOVE'),
        ('GUM_OR_CANDY', 'NEAR_SMOKING_AREA'),
        ('GUM_OR_CANDY', 'SOCIAL_DRINKING'),
        ('SHORT_STRETCHING', 'HOME'),
        ('SHORT_STRETCHING', 'WORKPLACE_OR_SCHOOL'),
        ('STEADY_BREATHING', 'HOME'),
        ('STEADY_BREATHING', 'WORKPLACE_OR_SCHOOL'),
        ('STEADY_BREATHING', 'ON_THE_MOVE'),
        ('STEADY_BREATHING', 'NEAR_SMOKING_AREA'),
        ('STEADY_BREATHING', 'SOCIAL_DRINKING'),
        ('COLD_WATER', 'HOME'),
        ('COLD_WATER', 'WORKPLACE_OR_SCHOOL'),
        ('LISTEN_TO_MUSIC', 'HOME'),
        ('LISTEN_TO_MUSIC', 'WORKPLACE_OR_SCHOOL'),
        ('LISTEN_TO_MUSIC', 'ON_THE_MOVE'),
        ('LISTEN_TO_MUSIC', 'NEAR_SMOKING_AREA'),
        ('LISTEN_TO_MUSIC', 'SOCIAL_DRINKING'),
        ('TALK_TO_SOMEONE', 'HOME'),
        ('TALK_TO_SOMEONE', 'WORKPLACE_OR_SCHOOL'),
        ('TALK_TO_SOMEONE', 'SOCIAL_DRINKING'),
        ('HIDE_TOBACCO', 'HOME'),
        ('HIDE_TOBACCO', 'WORKPLACE_OR_SCHOOL')
) AS allowed(mission_code, location_code)
JOIN missions mission ON mission.code = allowed.mission_code
JOIN smoking_contexts location
    ON location.code = allowed.location_code
    AND location.context_type = 'LOCATION';
