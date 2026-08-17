-- Next Me 카드 표시 필드 추가
ALTER TABLE next_me_generations
    ADD COLUMN headline VARCHAR(36),
    ADD COLUMN start_reason VARCHAR(24),
    ADD COLUMN nextbud_theme VARCHAR(40);

UPDATE next_me_generations
SET headline = LEFT(future_self, 36),
    start_reason = LEFT(decision_trigger, 24),
    nextbud_theme = 'NEXTBUD_DEFAULT_01'
WHERE headline IS NULL
   OR start_reason IS NULL
   OR nextbud_theme IS NULL;

ALTER TABLE next_me_generations
    ALTER COLUMN headline SET NOT NULL,
    ALTER COLUMN start_reason SET NOT NULL,
    ALTER COLUMN nextbud_theme SET NOT NULL,
    ADD CONSTRAINT ck_next_me_nextbud_theme CHECK (
        nextbud_theme IN (
            'NEXTBUD_HEALTH_01',
            'NEXTBUD_RELATIONSHIP_01',
            'NEXTBUD_ECONOMY_01',
            'NEXTBUD_SELF_EFFICACY_01',
            'NEXTBUD_GROWTH_01',
            'NEXTBUD_DEFAULT_01'
        )
    );
