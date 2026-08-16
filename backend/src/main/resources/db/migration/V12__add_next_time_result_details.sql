ALTER TABLE next_time_sessions
    ADD COLUMN result_feedback VARCHAR(500),
    ADD COLUMN result_memory_summary VARCHAR(500),
    ADD COLUMN result_memory_source VARCHAR(20),
    ADD CONSTRAINT ck_next_time_result_memory_source
        CHECK (result_memory_source IN ('AI', 'FALLBACK'));
