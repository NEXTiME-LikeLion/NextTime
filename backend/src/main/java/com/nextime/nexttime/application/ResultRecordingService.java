package com.nextime.nexttime.application;

import com.nextime.ai.resultmemory.client.ResultMemoryAiClient;
import com.nextime.ai.resultmemory.client.ResultMemoryClientResult;
import com.nextime.ai.resultmemory.client.ResultMemoryPromptInput;
import com.nextime.common.error.BusinessException;
import com.nextime.common.error.ErrorCode;
import com.nextime.nexttime.api.NextTimeResultResponse;
import com.nextime.nexttime.api.RecordNextTimeResultRequest;
import com.nextime.nexttime.domain.NextTimeSession;
import com.nextime.nexttime.domain.NextTimeSessionRepository;
import com.nextime.nexttime.domain.ResultMemorySource;
import com.nextime.smokingcontext.domain.SmokingContextType;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

import static com.nextime.nexttime.domain.NextTimeSessionStatus.CANCELLED;
import static com.nextime.nexttime.domain.NextTimeSessionStatus.MISSION_COMPLETED;
import static com.nextime.nexttime.domain.NextTimeSessionStatus.RESULT_RECORDED;

@Service
@RequiredArgsConstructor
public class ResultRecordingService {

    private static final Logger log = LoggerFactory.getLogger(ResultRecordingService.class);

    private final NextTimeSessionRepository sessionRepository;
    private final ResultMemoryAiClient resultMemoryAiClient;

    @Transactional
    public NextTimeResultResponse record(
            UUID userId,
            UUID sessionId,
            RecordNextTimeResultRequest request
    ) {
        NextTimeSession session = sessionRepository
                .findWithRecommendationByIdAndUser_Id(sessionId, userId)
                .orElseThrow(() -> new BusinessException(
                        ErrorCode.RESOURCE_NOT_FOUND,
                        "NEXT TIME 세션을 찾을 수 없습니다."
                ));

        if (session.getStatus() == RESULT_RECORDED) {
            return NextTimeResultResponse.from(session);
        }
        if (session.getStatus() == CANCELLED) {
            throw new BusinessException(
                    ErrorCode.CONFLICT,
                    "건너뛴 미션에는 결과를 기록할 수 없습니다."
            );
        }
        if (session.getStatus() != MISSION_COMPLETED) {
            throw new BusinessException(
                    ErrorCode.CONFLICT,
                    "행동 미션을 완료한 후 결과를 기록해 주세요."
            );
        }

        String feedback = normalizeOptional(request.feedback());
        Memory memory = generateMemory(session, request, feedback);
        session.recordResult(
                request.result(),
                request.cravingAfter(),
                request.missionHelpfulness(),
                feedback,
                memory.summary(),
                memory.source(),
                Instant.now()
        );
        return NextTimeResultResponse.from(session);
    }

    private Memory generateMemory(
            NextTimeSession session,
            RecordNextTimeResultRequest request,
            String feedback
    ) {
        String trigger = session.contextOf(SmokingContextType.TRIGGER).getName();
        String location = session.contextOf(SmokingContextType.LOCATION).getName();
        String fallback = fallbackSummary(session, request, trigger);
        try {
            ResultMemoryClientResult result = resultMemoryAiClient.generate(new ResultMemoryPromptInput(
                    trigger,
                    location,
                    session.getCravingBefore().name(),
                    session.getMissionNameSnapshot(),
                    request.result().name(),
                    request.cravingAfter().name(),
                    request.missionHelpfulness().name(),
                    feedback
            ));
            String summary = normalizeOptional(result.memorySummary());
            if (result.fallbackUsed() || summary == null) {
                return new Memory(fallback, ResultMemorySource.FALLBACK);
            }
            return new Memory(truncate(summary, 500), ResultMemorySource.AI);
        } catch (RuntimeException exception) {
            log.warn("NEXT TIME 결과 기억 생성 실패. 기본 문구를 사용합니다: {}", exception.getMessage());
            return new Memory(fallback, ResultMemorySource.FALLBACK);
        }
    }

    private String fallbackSummary(
            NextTimeSession session,
            RecordNextTimeResultRequest request,
            String trigger
    ) {
        return trigger + "에서 " + session.getMissionNameSnapshot()
                + " 행동을 했고, 결과는 " + resultLabel(request)
                + ", 미션 평가는 " + helpfulnessLabel(request) + "로 기록했어요.";
    }

    private String resultLabel(RecordNextTimeResultRequest request) {
        return switch (request.result()) {
            case NOT_SMOKED -> "피우지 않았어요";
            case DELAYED -> "미루다가 피웠어요";
            case SMOKED -> "피웠어요";
        };
    }

    private String helpfulnessLabel(RecordNextTimeResultRequest request) {
        return switch (request.missionHelpfulness()) {
            case HELPFUL -> "도움이 됐어요";
            case NEUTRAL -> "잘 모르겠어요";
            case NOT_FIT -> "나랑은 안 맞아요";
        };
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

    private record Memory(String summary, ResultMemorySource source) {
    }
}
