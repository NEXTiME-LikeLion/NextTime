package com.nextime.nexttime.application;

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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

import static com.nextime.nexttime.domain.NextTimeSessionStatus.CANCELLED;
import static com.nextime.nexttime.domain.NextTimeSessionStatus.MISSION_COMPLETED;
import static com.nextime.nexttime.domain.NextTimeSessionStatus.RESULT_RECORDED;

@Service
@RequiredArgsConstructor
class ResultPersistenceService {

    private final NextTimeSessionRepository sessionRepository;

    @Transactional
    public PersistedResult recordFallback(
            UUID userId,
            UUID sessionId,
            RecordNextTimeResultRequest request
    ) {
        NextTimeSession session = findOwnedSession(userId, sessionId);
        if (session.getStatus() == RESULT_RECORDED) {
            return new PersistedResult(NextTimeResultResponse.from(session), null, false);
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
        String trigger = session.contextOf(SmokingContextType.TRIGGER).getName();
        String location = session.contextOf(SmokingContextType.LOCATION).getName();
        String fallbackSummary = trigger + " " + session.getMissionNameSnapshot()
                + "를 했고, 결과는 " + resultLabel(request) + ". "
                + "이번 미션은 " + helpfulnessRecordClause(request) + " 기록했어요.";

        session.recordResult(
                request.result(),
                request.cravingAfter(),
                request.missionHelpfulness(),
                feedback,
                fallbackSummary,
                ResultMemorySource.FALLBACK,
                Instant.now()
        );

        ResultMemoryPromptInput promptInput = new ResultMemoryPromptInput(
                trigger,
                location,
                cravingBeforeLabel(session),
                session.getMissionNameSnapshot(),
                "완료",
                resultLabel(request),
                cravingAfterLabel(request),
                helpfulnessLabel(request),
                feedback
        );
        return new PersistedResult(NextTimeResultResponse.from(session), promptInput, true);
    }

    @Transactional
    public NextTimeResultResponse replaceWithAiMemory(
            UUID userId,
            UUID sessionId,
            String memorySummary
    ) {
        NextTimeSession session = findOwnedSession(userId, sessionId);
        session.replaceResultMemory(memorySummary, ResultMemorySource.AI);
        return NextTimeResultResponse.from(session);
    }

    private NextTimeSession findOwnedSession(UUID userId, UUID sessionId) {
        return sessionRepository.findWithRecommendationByIdAndUser_Id(sessionId, userId)
                .orElseThrow(() -> new BusinessException(
                        ErrorCode.RESOURCE_NOT_FOUND,
                        "NEXT TIME 세션을 찾을 수 없습니다."
                ));
    }

    private String cravingBeforeLabel(NextTimeSession session) {
        return switch (session.getCravingBefore()) {
            case LOW -> "생각만 나는 정도";
            case MEDIUM -> "꽤 당김";
            case HIGH -> "당장 피우고 싶음";
        };
    }

    private String cravingAfterLabel(RecordNextTimeResultRequest request) {
        return switch (request.cravingAfter()) {
            case NONE -> "이제 괜찮아요";
            case LOW -> "생각만 나요";
            case MEDIUM -> "꽤 당겨요";
            case HIGH -> "당장 피우고 싶어요";
        };
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

    private String helpfulnessRecordClause(RecordNextTimeResultRequest request) {
        return switch (request.missionHelpfulness()) {
            case HELPFUL -> "도움이 됐다고";
            case NEUTRAL -> "잘 모르겠다고";
            case NOT_FIT -> "나랑은 안 맞는다고";
        };
    }

    private String normalizeOptional(String value) {
        if (value == null) {
            return null;
        }
        String normalized = value.trim();
        return normalized.isEmpty() ? null : normalized;
    }
}
