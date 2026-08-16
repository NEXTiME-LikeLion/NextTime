package com.nextime.nexttime.application;

import com.nextime.ai.futurevoice.client.FutureVoiceAiClient;
import com.nextime.ai.futurevoice.client.FutureVoiceClientResult;
import com.nextime.nexttime.api.FutureVoiceResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FutureVoiceService {

    private static final Logger log = LoggerFactory.getLogger(FutureVoiceService.class);

    private final FutureVoicePersistenceService persistenceService;
    private final FutureVoiceAiClient aiClient;

    public FutureVoiceResponse generate(UUID userId, UUID sessionId) {
        PreparedFutureVoice prepared = persistenceService.prepareFallback(userId, sessionId);
        if (!prepared.newlyGenerated()) {
            return prepared.response();
        }
        try {
            FutureVoiceClientResult result = aiClient.generate(prepared.promptInput());
            if (result.fallbackUsed() || hasBlankField(result)) {
                return prepared.response();
            }
            return persistenceService.replaceWithAi(
                    userId,
                    sessionId,
                    result.futureHook(),
                    result.acknowledge(),
                    result.futureReason(),
                    result.closing()
            );
        } catch (RuntimeException exception) {
            log.warn("NEXT TIME 미래의 목소리 생성 실패. 저장된 기본 문구를 유지합니다: {}", exception.getMessage());
            return prepared.response();
        }
    }

    private boolean hasBlankField(FutureVoiceClientResult result) {
        return isBlank(result.futureHook())
                || isBlank(result.acknowledge())
                || isBlank(result.futureReason())
                || isBlank(result.closing());
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}
