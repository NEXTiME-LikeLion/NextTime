-- 사용하지 않는 AI 생성 메시지 컬럼 제거
ALTER TABLE next_me_generations
    DROP COLUMN generated_message;
