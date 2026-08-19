package com.nextime.ai.nextme.application;

import com.nextime.ai.nextme.api.NextMeGenerateRequest;
import com.nextime.ai.nextme.client.NextMeAiClient;
import com.nextime.ai.nextme.client.NextMeClientResult;
import com.nextime.ai.nextme.client.NextMePromptInput;
import com.nextime.ai.nextme.domain.ChangeReason;
import com.nextime.ai.nextme.domain.GenerationSource;
import com.nextime.ai.nextme.domain.NextMeGeneration;
import com.nextime.ai.nextme.domain.NextMeGenerationRepository;
import com.nextime.ai.nextme.domain.NextBudTheme;
import com.nextime.common.error.BusinessException;
import com.nextime.common.error.ErrorCode;
import com.nextime.user.domain.UserProfileRepository;
import com.nextime.user.domain.OnboardingGoal;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class NextMeService {

    private static final Logger log = LoggerFactory.getLogger(NextMeService.class);
    private final NextMeAiClient aiClient;
    private final NextMeGenerationRepository generationRepository;
    private final UserProfileRepository userProfileRepository;

    public NextMeService(
            NextMeAiClient aiClient,
            NextMeGenerationRepository generationRepository,
            UserProfileRepository userProfileRepository
    ) {
        this.aiClient = aiClient;
        this.generationRepository = generationRepository;
        this.userProfileRepository = userProfileRepository;
    }

    @Transactional
    public NextMeGeneration generate(UUID userId, NextMeGenerateRequest request) {
        validateReasons(request);
        String customReason = normalizeOptional(request.customReason());
        List<String> reasonTexts = reasonTexts(request.changeReasons(), customReason);

        GenerationResult result = generateWithFallback(new NextMePromptInput(
                reasonTexts,
                userProfileRepository.findById(userId)
                        .map(profile -> profile.getGoal())
                        .map(Enum::name)
                        .orElse(null),
                request.decisionTrigger().trim(),
                request.futureSelf().trim(),
                request.messageToFutureSelf().trim(),
                List.of()
        ), request.changeReasons());

        NextMeGeneration generation = new NextMeGeneration(
                userId,
                request.changeReasons(),
                customReason,
                request.decisionTrigger().trim(),
                request.futureSelf().trim(),
                request.messageToFutureSelf().trim(),
                result.headline(),
                result.startReason(),
                result.nextBudTheme(),
                result.source()
        );
        return generationRepository.save(generation);
    }

    @Transactional
    public NextMeGeneration regenerateGoal(
            UUID userId,
            OnboardingGoal changeGoal,
            NextMeGeneration current,
            String nextMe,
            String motivation,
            String leftMessage,
            List<String> updatedFields
    ) {
        List<ChangeReason> changeReasons = current.getChangeReasons();
        String customReason = current.getCustomReason();
        NextMePromptInput input = new NextMePromptInput(
                reasonTexts(changeReasons, customReason),
                changeGoal == null ? null : changeGoal.name(),
                motivation,
                nextMe,
                leftMessage,
                updatedFields
        );
        GenerationResult result = generateGoalUpdateWithFallback(
                input,
                current.getNextBudTheme()
        );

        return generationRepository.save(new NextMeGeneration(
                userId,
                changeReasons,
                customReason,
                result.startReason(),
                result.headline(),
                result.leftMessage(),
                result.headline(),
                result.startReason(),
                result.nextBudTheme(),
                result.source()
        ));
    }

    @Transactional(readOnly = true)
    public NextMeGeneration getLatest(UUID userId) {
        return generationRepository.findFirstByUserIdOrderByCreatedAtDesc(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.NEXT_ME_NOT_FOUND));
    }

    @Transactional(readOnly = true)
    public OnboardingGoal getChangeGoal(UUID userId) {
        return userProfileRepository.findById(userId)
                .map(profile -> profile.getGoal())
                .orElse(null);
    }

    private void validateReasons(NextMeGenerateRequest request) {
        if (new HashSet<>(request.changeReasons()).size() != request.changeReasons().size()) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST, "같은 변화 이유를 중복 선택할 수 없습니다.");
        }

        boolean otherSelected = request.changeReasons().contains(ChangeReason.OTHER);
        String customReason = normalizeOptional(request.customReason());
        if (otherSelected && request.changeReasons().size() != 1) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST, "직접 입력은 다른 변화 이유와 함께 선택할 수 없습니다.");
        }
        if (otherSelected && customReason == null) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST, "직접 입력한 변화 이유를 작성해 주세요.");
        }
        if (!otherSelected && customReason != null) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST, "직접 입력을 선택한 경우에만 변화 이유를 작성할 수 있습니다.");
        }
    }

    private List<String> reasonTexts(List<ChangeReason> reasons, String customReason) {
        return reasons.stream()
                .map(reason -> reason == ChangeReason.OTHER ? customReason : reason.label())
                .toList();
    }

    private GenerationResult generateWithFallback(
            NextMePromptInput input,
            List<ChangeReason> selectedReasons
    ) {
        try {
            NextMeClientResult clientResult = aiClient.generate(input);
            if (clientResult.fallbackUsed()) {
                return fallbackResult(input, selectedReasons.getFirst());
            }
            String headline = truncate(normalizeGeneratedText(clientResult.headline()), 36);
            String startReason = truncate(normalizeGeneratedText(clientResult.startReason()), 24);
            if (headline.isEmpty()) {
                throw new IllegalStateException("headline이 비어 있습니다.");
            }
            if (startReason.isEmpty()) {
                throw new IllegalStateException("start_reason이 비어 있습니다.");
            }
            if (clientResult.nextBudTheme() == null
                    || !isThemeCompatible(clientResult.nextBudTheme(), selectedReasons)) {
                throw new IllegalStateException("nextbud_theme이 선택한 변화 이유와 일치하지 않습니다.");
            }
            return new GenerationResult(
                    headline,
                    startReason,
                    truncate(normalizeGeneratedText(clientResult.leftMessage()), 100),
                    clientResult.nextBudTheme(),
                    GenerationSource.AI
            );
        } catch (RuntimeException exception) {
            log.warn("NEXT ME AI 생성 실패. 기본 문구를 사용합니다: {}", exception.getMessage());
            return fallbackResult(input, selectedReasons.getFirst());
        }
    }

    private GenerationResult generateGoalUpdateWithFallback(
            NextMePromptInput input,
            NextBudTheme currentTheme
    ) {
        try {
            NextMeClientResult clientResult = aiClient.generate(input);
            if (clientResult.fallbackUsed()) {
                return goalUpdateFallbackResult(input, currentTheme);
            }
            String headline = truncate(normalizeGeneratedText(clientResult.headline()), 36);
            String startReason = truncate(normalizeGeneratedText(clientResult.startReason()), 24);
            String leftMessage = truncate(normalizeGeneratedText(clientResult.leftMessage()), 100);
            if (headline.isEmpty() || startReason.isEmpty() || leftMessage.isEmpty()) {
                throw new IllegalStateException("목표 수정 AI 결과에 빈 값이 있습니다.");
            }
            if (clientResult.nextBudTheme() == null) {
                throw new IllegalStateException("nextbud_theme이 비어 있습니다.");
            }
            NextBudTheme resolvedTheme = resolveThemeFromUpdatedFields(input)
                    .orElse(clientResult.nextBudTheme());
            return new GenerationResult(
                    headline,
                    startReason,
                    leftMessage,
                    resolvedTheme,
                    GenerationSource.AI
            );
        } catch (RuntimeException exception) {
            log.warn("목표 수정 NEXT ME AI 생성 실패. 기존 입력을 사용합니다: {}", exception.getMessage());
            return goalUpdateFallbackResult(input, currentTheme);
        }
    }

    private GenerationResult goalUpdateFallbackResult(
            NextMePromptInput input,
            NextBudTheme currentTheme
    ) {
        return new GenerationResult(
                truncate(input.futureSelf(), 36),
                truncate(input.decisionTrigger(), 24),
                truncate(input.messageToFutureSelf(), 100),
                resolveThemeFromUpdatedFields(input).orElse(currentTheme),
                GenerationSource.FALLBACK
        );
    }

    private Optional<NextBudTheme> resolveThemeFromUpdatedFields(NextMePromptInput input) {
        String updatedText = input.updatedFields().stream()
                .map(field -> switch (field) {
                    case "nextMe" -> input.futureSelf();
                    case "motivation" -> input.decisionTrigger();
                    case "leftMessage" -> input.messageToFutureSelf();
                    default -> "";
                })
                .filter(value -> value != null && !value.isBlank())
                .map(String::toLowerCase)
                .reduce("", (left, right) -> left + " " + right);

        if (containsAny(updatedText, "돈", "비용", "담뱃값", "절약", "저축", "지출", "경제", "아끼")) {
            return Optional.of(NextBudTheme.NEXTBUD_ECONOMY_01);
        }
        if (containsAny(updatedText, "건강", "체력", "운동", "숨", "러닝", "수영", "몸", "회복")) {
            return Optional.of(NextBudTheme.NEXTBUD_HEALTH_01);
        }
        if (containsAny(updatedText, "가족", "사람", "아이", "임신", "자녀", "친구", "연인")) {
            return Optional.of(NextBudTheme.NEXTBUD_RELATIONSHIP_01);
        }
        if (containsAny(updatedText, "자유", "냄새", "외모", "자신감", "통제", "주도")) {
            return Optional.of(NextBudTheme.NEXTBUD_SELF_EFFICACY_01);
        }
        if (containsAny(updatedText, "취미", "일상", "성장", "집중", "공부", "업무", "기록")) {
            return Optional.of(NextBudTheme.NEXTBUD_GROWTH_01);
        }
        return Optional.empty();
    }

    private boolean containsAny(String text, String... keywords) {
        for (String keyword : keywords) {
            if (text.contains(keyword)) {
                return true;
            }
        }
        return false;
    }

    private boolean isThemeCompatible(NextBudTheme theme, List<ChangeReason> reasons) {
        return reasons.stream().map(this::fallbackTheme).anyMatch(theme::equals);
    }

    private GenerationResult fallbackResult(
            NextMePromptInput input,
            ChangeReason primaryReason
    ) {
        return new GenerationResult(
                truncate(input.futureSelf(), 36),
                truncate(input.decisionTrigger(), 24),
                truncate(input.messageToFutureSelf(), 100),
                fallbackTheme(primaryReason),
                GenerationSource.FALLBACK
        );
    }

    private NextBudTheme fallbackTheme(ChangeReason reason) {
        return switch (reason) {
            case HEALTH_FITNESS -> NextBudTheme.NEXTBUD_HEALTH_01;
            case FAMILY_PEOPLE, PREGNANCY_CHILD -> NextBudTheme.NEXTBUD_RELATIONSHIP_01;
            case COST -> NextBudTheme.NEXTBUD_ECONOMY_01;
            case FREEDOM, SMELL_APPEARANCE -> NextBudTheme.NEXTBUD_SELF_EFFICACY_01;
            case HOBBY_DAILY -> NextBudTheme.NEXTBUD_GROWTH_01;
            case OTHER -> NextBudTheme.NEXTBUD_DEFAULT_01;
        };
    }

    private String truncate(String value, int maxLength) {
        int codePointCount = value.codePointCount(0, value.length());
        if (codePointCount <= maxLength) {
            return value;
        }
        return value.substring(0, value.offsetByCodePoints(0, maxLength));
    }

    private String normalizeGeneratedText(String value) {
        return value == null ? "" : value.trim();
    }

    private String normalizeOptional(String value) {
        if (value == null) {
            return null;
        }
        String normalized = value.trim();
        return normalized.isEmpty() ? null : normalized;
    }

    private record GenerationResult(
            String headline,
            String startReason,
            String leftMessage,
            NextBudTheme nextBudTheme,
            GenerationSource source
    ) {
    }
}
