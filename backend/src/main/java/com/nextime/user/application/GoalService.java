package com.nextime.user.application;

import com.nextime.ai.nextme.application.NextMeService;
import com.nextime.ai.nextme.domain.NextMeGeneration;
import com.nextime.common.error.BusinessException;
import com.nextime.common.error.ErrorCode;
import com.nextime.user.api.GoalRequest;
import com.nextime.user.api.GoalResponse;
import com.nextime.user.domain.UserProfile;
import com.nextime.user.domain.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class GoalService {

    private final UserProfileRepository userProfileRepository;
    private final NextMeService nextMeService;

    @Transactional
    public GoalResponse update(UUID userId, GoalRequest request) {
        String nextMe = normalize(request.nextMe());
        String motivation = normalize(request.motivation());
        String leftMessage = normalize(request.leftMessage());

        if (request.changeGoal() == null && nextMe == null && motivation == null && leftMessage == null) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST, "수정할 목표 정보를 입력해 주세요.");
        }

        UserProfile profile = userProfileRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_REGISTERED));
        NextMeGeneration current = nextMeService.getLatest(userId);
        if (request.changeGoal() != null) {
            profile.updateGoal(request.changeGoal());
        }

        NextMeGeneration generation = nextMeService.regenerateGoal(
                userId,
                profile.getGoal(),
                current,
                nextMe == null ? current.getFutureSelf() : nextMe,
                motivation == null ? current.getDecisionTrigger() : motivation,
                leftMessage == null ? current.getMessageToFutureSelf() : leftMessage,
                Stream.of(
                                request.changeGoal() == null ? null : "changeGoal",
                                nextMe == null ? null : "nextMe",
                                motivation == null ? null : "motivation",
                                leftMessage == null ? null : "leftMessage"
                        )
                        .filter(java.util.Objects::nonNull)
                        .toList()
        );

        return new GoalResponse(
                profile.getGoal(),
                generation.getHeadline(),
                generation.getNextBudTheme(),
                generation.getDecisionTrigger(),
                generation.getMessageToFutureSelf()
        );
    }

    private String normalize(String value) {
        if (value == null) {
            return null;
        }
        String normalized = value.trim();
        if (normalized.isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST, "수정할 값은 비어 있을 수 없습니다.");
        }
        return normalized;
    }
}
