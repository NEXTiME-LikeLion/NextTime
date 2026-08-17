ALTER TABLE user_mission_preferences
    DROP CONSTRAINT IF EXISTS user_mission_preferences_source_check;

ALTER TABLE user_mission_preferences
    ADD CONSTRAINT user_mission_preferences_source_check
        CHECK (source IN ('USER_SELECTED', 'AI_CLASSIFIED', 'AUTO_EVALUATED'));
