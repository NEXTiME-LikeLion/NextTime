package com.nextime.nexttime.application;

import com.nextime.ai.futurevoice.client.FutureVoicePromptInput;
import com.nextime.ai.nextme.domain.NextMeGeneration;
import com.nextime.ai.nextme.domain.NextMeGenerationRepository;
import com.nextime.common.error.BusinessException;
import com.nextime.common.error.ErrorCode;
import com.nextime.nexttime.api.FutureVoiceResponse;
import com.nextime.nexttime.domain.FutureVoiceSource;
import com.nextime.nexttime.domain.NextTimeSession;
import com.nextime.nexttime.domain.NextTimeSessionRepository;
import com.nextime.smokingcontext.domain.SmokingContextType;
import com.nextime.user.domain.OnboardingGoal;
import com.nextime.user.domain.UserProfile;
import com.nextime.user.domain.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

import static com.nextime.nexttime.domain.NextTimeSessionStatus.CONTEXT_SAVED;
import static com.nextime.nexttime.domain.NextTimeSessionStatus.CREATED;

@Service
@RequiredArgsConstructor
class FutureVoicePersistenceService {

    private static final int MAX_TEXT_LENGTH = 200;

    private final NextTimeSessionRepository sessionRepository;
    private final UserProfileRepository profileRepository;
    private final NextMeGenerationRepository nextMeGenerationRepository;

    @Transactional
    public PreparedFutureVoice prepareFallback(UUID userId, UUID sessionId) {
        NextTimeSession session = findOwnedSession(userId, sessionId);
        if (session.getFutureVoiceSource() != null) {
            return new PreparedFutureVoice(FutureVoiceResponse.from(session), null, false);
        }
        if (session.getStatus() != CONTEXT_SAVED) {
            String message = session.getStatus() == CREATED
                    ? "현재 상황을 먼저 저장해 주세요."
                    : "현재 상태에서는 미래의 목소리를 생성할 수 없습니다.";
            throw new BusinessException(ErrorCode.CONFLICT, message);
        }

        UserProfile profile = profileRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(
                        ErrorCode.CONFLICT,
                        "온보딩을 먼저 완료해 주세요."
                ));
        if (profile.getGoal() == null) {
            throw new BusinessException(ErrorCode.CONFLICT, "온보딩을 먼저 완료해 주세요.");
        }
        NextMeGeneration nextMe = nextMeGenerationRepository.findFirstByUserIdOrderByCreatedAtDesc(userId)
                .orElseThrow(() -> new BusinessException(
                        ErrorCode.CONFLICT,
                        "NEXT ME를 먼저 생성해 주세요."
                ));

        String acknowledge = fallbackAcknowledge(session);
        session.saveFutureVoice(
                truncate(nextMe.getHeadline()),
                acknowledge,
                truncate(nextMe.getMessageToFutureSelf()),
                "이번 한 번만, 나를 먼저 선택해줘",
                FutureVoiceSource.FALLBACK,
                Instant.now()
        );

        String trigger = session.contextOf(SmokingContextType.TRIGGER).getName();
        String location = session.contextOf(SmokingContextType.LOCATION).getName();
        FutureVoicePromptInput input = new FutureVoicePromptInput(
                cravingLabel(session),
                location,
                trigger,
                goalLabel(profile.getGoal()),
                nextMe.getHeadline(),
                nextMe.getDecisionTrigger(),
                nextMe.getFutureSelf(),
                nextMe.getMessageToFutureSelf()
        );
        return new PreparedFutureVoice(FutureVoiceResponse.from(session), input, true);
    }

    @Transactional
    public FutureVoiceResponse replaceWithAi(
            UUID userId,
            UUID sessionId,
            String hook,
            String acknowledge,
            String reason,
            String closing
    ) {
        NextTimeSession session = findOwnedSession(userId, sessionId);
        session.replaceFutureVoice(
                truncate(hook),
                truncate(acknowledge),
                truncate(reason),
                truncate(closing),
                FutureVoiceSource.AI
        );
        return FutureVoiceResponse.from(session);
    }

    private NextTimeSession findOwnedSession(UUID userId, UUID sessionId) {
        return sessionRepository.findWithRecommendationByIdAndUser_Id(sessionId, userId)
                .orElseThrow(() -> new BusinessException(
                        ErrorCode.RESOURCE_NOT_FOUND,
                        "NEXT TIME 세션을 찾을 수 없습니다."
                ));
    }

    private String fallbackAcknowledge(NextTimeSession session) {
        return switch (session.getCravingBefore()) {
            case LOW -> "담배 생각이 스쳐 가는 순간이구나.";
            case MEDIUM -> "지금 담배가 꽤 당기는 거 알아.";
            case HIGH -> "지금 당장 한 대 피우고 싶은 마음이 큰 거 알아.";
        };
    }

    private String cravingLabel(NextTimeSession session) {
        return switch (session.getCravingBefore()) {
            case LOW -> "생각만 나는 정도";
            case MEDIUM -> "꽤 당김";
            case HIGH -> "당장 피우고 싶음";
        };
    }

    private String goalLabel(OnboardingGoal goal) {
        return switch (goal) {
            case QUIT -> "완전히 끊고 싶어요";
            case REDUCE -> "우선 줄여가고 싶어요";
            case UNDECIDED -> "아직 정하지 못했어요";
        };
    }

    private String truncate(String value) {
        String normalized = value.trim();
        int length = normalized.codePointCount(0, normalized.length());
        return length <= MAX_TEXT_LENGTH
                ? normalized
                : normalized.substring(0, normalized.offsetByCodePoints(0, MAX_TEXT_LENGTH));
    }
}
