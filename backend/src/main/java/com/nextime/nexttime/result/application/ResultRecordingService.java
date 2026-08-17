package com.nextime.nexttime.result.application;

import com.nextime.nexttime.result.api.NextTimeResultResponse;
import com.nextime.nexttime.result.api.RecordNextTimeResultRequest;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ResultRecordingService {

    private static final Logger log = LoggerFactory.getLogger(ResultRecordingService.class);

    private final ResultPersistenceService resultPersistenceService;
    private final ResultMemoryAiClient resultMemoryAiClient;

    public NextTimeResultResponse record(
            UUID userId,
            UUID sessionId,
            RecordNextTimeResultRequest request
    ) {
        PersistedResult persisted = resultPersistenceService.recordFallback(userId, sessionId, request);
        if (!persisted.newlyRecorded()) {
            return persisted.response();
        }

        try {
            ResultMemoryClientResult result = resultMemoryAiClient.generate(persisted.promptInput());
            String summary = normalizeOptional(result.memorySummary());
            if (result.fallbackUsed() || summary == null) {
                return persisted.response();
            }
            return resultPersistenceService.replaceWithAiMemory(
                    userId,
                    sessionId,
                    truncate(summary, 500)
            );
        } catch (RuntimeException exception) {
            log.warn("NEXT TIME 결과 기억 생성 실패. 저장된 기본 문구를 유지합니다: {}", exception.getMessage());
            return persisted.response();
        }
    }

    private String normalizeOptional(String value) {
        if (value == null) {
            return null;
        }
        String normalized = value.trim();
        return normalized.isEmpty() ? null : normalized;
    }

    private String truncate(String value, int maxLength) {
        int length = value.codePointCount(0, value.length());
        return length <= maxLength ? value : value.substring(0, value.offsetByCodePoints(0, maxLength));
    }
}
