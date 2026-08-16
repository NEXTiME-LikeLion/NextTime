ALTER TABLE smoking_contexts
    ADD COLUMN context_type VARCHAR(20);

UPDATE smoking_contexts
SET context_type = 'TRIGGER'
WHERE context_type IS NULL;

INSERT INTO smoking_contexts (
    id, code, name, description, context_type, display_order
) VALUES
    ('11000000-0000-0000-0000-000000000001', 'HOME', '집', '사용자의 집 또는 주거 공간', 'LOCATION', 1),
    ('11000000-0000-0000-0000-000000000002', 'WORKPLACE_OR_SCHOOL', '직장·학교', '직장 또는 학교에 있는 상황', 'LOCATION', 2),
    ('11000000-0000-0000-0000-000000000003', 'ON_THE_MOVE', '이동 중', '장소를 이동하고 있는 상황', 'LOCATION', 3),
    ('11000000-0000-0000-0000-000000000004', 'NEAR_SMOKING_AREA', '흡연구역 근처', '흡연구역 주변에 있는 상황', 'LOCATION', 4),
    ('11000000-0000-0000-0000-000000000005', 'SOCIAL_DRINKING', '술자리', '술자리 또는 모임에 있는 상황', 'LOCATION', 5);

ALTER TABLE smoking_contexts
    ALTER COLUMN context_type SET NOT NULL;

ALTER TABLE smoking_contexts
    ADD CONSTRAINT ck_smoking_context_type
        CHECK (context_type IN ('LOCATION', 'TRIGGER'));
