package com.nextime.user.application;

import com.nextime.common.error.BusinessException;
import com.nextime.common.error.ErrorCode;
import com.nextime.user.api.BaselineRequest;
import com.nextime.user.api.OnboardingRequest;
import com.nextime.user.domain.SmokingContext;
import com.nextime.user.domain.SmokingContextRepository;
import com.nextime.user.domain.User;
import com.nextime.user.domain.UserProfile;
import com.nextime.user.domain.UserProfileRepository;
import com.nextime.user.domain.UserRepository;
import com.nextime.user.domain.UserSmokingContext;
import com.nextime.user.domain.UserSmokingContextRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class OnboardingService {

    private static final String OTHER_CONTEXT_CODE = "OTHER";

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final SmokingContextRepository smokingContextRepository;
    private final UserSmokingContextRepository userSmokingContextRepository;

    public OnboardingService(
            UserRepository userRepository,
            UserProfileRepository userProfileRepository,
            SmokingContextRepository smokingContextRepository,
            UserSmokingContextRepository userSmokingContextRepository
    ) {
        this.userRepository = userRepository;
        this.userProfileRepository = userProfileRepository;
        this.smokingContextRepository = smokingContextRepository;
        this.userSmokingContextRepository = userSmokingContextRepository;
    }

    @Transactional
    public User complete(UUID userId, OnboardingRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_REGISTERED));
        BaselineRequest baseline = request.baseline();

        List<String> requestedCodes = baseline.smokingContextCodes();
        validateDuplicateCodes(requestedCodes);
        String customText = validateAndNormalizeOtherContext(requestedCodes, baseline.otherContext());
        Map<String, SmokingContext> contexts = loadActiveContexts(requestedCodes);

        UserProfile profile = userProfileRepository.findById(userId)
                .orElseGet(() -> new UserProfile(userId, baseline.smokingFrequency()));
        profile.updateSmokingFrequency(baseline.smokingFrequency());
        userProfileRepository.save(profile);

        userSmokingContextRepository.deleteAllByUserId(userId);
        List<UserSmokingContext> selections = requestedCodes.stream()
                .map(code -> new UserSmokingContext(
                        userId,
                        contexts.get(code).getId(),
                        OTHER_CONTEXT_CODE.equals(code) ? customText : null
                ))
                .toList();
        userSmokingContextRepository.saveAll(selections);

        user.completeOnboarding();
        return user;
    }

    private void validateDuplicateCodes(List<String> codes) {
        Set<String> uniqueCodes = new HashSet<>(codes);
        if (uniqueCodes.size() != codes.size()) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST, "같은 흡연 상황을 중복 선택할 수 없습니다.");
        }
    }

    private String validateAndNormalizeOtherContext(List<String> codes, String otherContext) {
        boolean otherSelected = codes.contains(OTHER_CONTEXT_CODE);
        String normalized = otherContext == null ? null : otherContext.trim();

        if (otherSelected && (normalized == null || normalized.isEmpty())) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST, "기타 상황을 입력해 주세요.");
        }
        if (!otherSelected && normalized != null && !normalized.isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST, "기타를 선택한 경우에만 기타 상황을 입력할 수 있습니다.");
        }
        return otherSelected ? normalized : null;
    }

    private Map<String, SmokingContext> loadActiveContexts(List<String> requestedCodes) {
        Map<String, SmokingContext> contexts = smokingContextRepository.findAllByCodeIn(requestedCodes).stream()
                .collect(Collectors.toMap(SmokingContext::getCode, Function.identity()));

        if (contexts.size() != requestedCodes.size()) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST, "존재하지 않는 흡연 상황이 포함되어 있습니다.");
        }
        boolean containsInactiveContext = contexts.values().stream().anyMatch(context -> !context.isActive());
        if (containsInactiveContext) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST, "현재 선택할 수 없는 흡연 상황이 포함되어 있습니다.");
        }
        return contexts;
    }
}
