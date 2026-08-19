package com.nextime.user.application;

import com.nextime.ai.nextme.domain.NextMeGeneration;
import com.nextime.ai.nextme.domain.NextMeGenerationRepository;
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

@Service
@RequiredArgsConstructor
public class GoalService {

    private final UserProfileRepository userProfileRepository;
    private final NextMeGenerationRepository generationRepository;

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
        if (request.changeGoal() != null) {
            profile.updateGoal(request.changeGoal());
        }

        NextMeGeneration generation = generationRepository.findFirstByUserIdOrderByCreatedAtDesc(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.NEXT_ME_NOT_FOUND));
        generation.updateGoal(nextMe, motivation, leftMessage);

        return new GoalResponse(
                profile.getGoal(),
                generation.getFutureSelf(),
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
