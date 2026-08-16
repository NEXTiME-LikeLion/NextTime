ALTER TABLE next_time_sessions
    ADD COLUMN future_voice_hook VARCHAR(200),
    ADD COLUMN future_voice_acknowledge VARCHAR(200),
    ADD COLUMN future_voice_reason VARCHAR(200),
    ADD COLUMN future_voice_closing VARCHAR(200),
    ADD COLUMN future_voice_source VARCHAR(20),
    ADD COLUMN future_voice_generated_at TIMESTAMPTZ,
    ADD CONSTRAINT ck_next_time_future_voice_source
        CHECK (future_voice_source IN ('AI', 'FALLBACK')),
    ADD CONSTRAINT ck_next_time_future_voice_complete
        CHECK (
            future_voice_source IS NULL
            OR (
                future_voice_hook IS NOT NULL
                AND future_voice_acknowledge IS NOT NULL
                AND future_voice_reason IS NOT NULL
                AND future_voice_closing IS NOT NULL
                AND future_voice_generated_at IS NOT NULL
            )
        );
