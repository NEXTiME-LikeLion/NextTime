package com.nextime.ai.nextme.application;

import com.nextime.ai.nextme.api.NextMeGenerateRequest;
import com.nextime.ai.nextme.client.NextMeAiClient;
import com.nextime.ai.nextme.client.NextMeClientResult;
import com.nextime.ai.nextme.client.NextMePromptInput;
import com.nextime.ai.nextme.domain.ChangeReason;
import com.nextime.ai.nextme.domain.GenerationSource;
import com.nextime.ai.nextme.domain.NextMeGeneration;
import com.nextime.ai.nextme.domain.NextMeGenerationRepository;
import com.nextime.common.error.BusinessException;
import com.nextime.common.error.ErrorCode;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashSet;
import java.util.List;
import java.util.UUID;

@Service
public class NextMeService {

    private static final Logger log = LoggerFactory.getLogger(NextMeService.class);
    private static final String REQUIRED_ENDING = "는 나";

    private final NextMeAiClient aiClient;
    private final NextMeGenerationRepository generationRepository;

    public NextMeService(
            NextMeAiClient aiClient,
            NextMeGenerationRepository generationRepository
    ) {
        this.aiClient = aiClient;
        this.generationRepository = generationRepository;
    }

    @Transactional
    public NextMeGeneration generate(UUID userId, NextMeGenerateRequest request) {
        validateReasons(request);
        String customReason = normalizeOptional(request.customReason());
        List<String> reasonTexts = reasonTexts(request.changeReasons(), customReason);

        GenerationResult result = generateWithFallback(new NextMePromptInput(
                reasonTexts,
                request.decisionTrigger().trim(),
                request.futureSelf().trim(),
                request.messageToFutureSelf().trim()
        ), request.changeReasons().getFirst(), customReason);

        NextMeGeneration generation = new NextMeGeneration(
                userId,
                request.changeReasons(),
                customReason,
                request.decisionTrigger().trim(),
                request.futureSelf().trim(),
                request.messageToFutureSelf().trim(),
                result.message(),
                result.source()
        );
        return generationRepository.save(generation);
    }

    @Transactional(readOnly = true)
    public NextMeGeneration getLatest(UUID userId) {
        return generationRepository.findFirstByUserIdOrderByCreatedAtDesc(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.NEXT_ME_NOT_FOUND));
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
            ChangeReason primaryReason,
            String customReason
    ) {
        try {
            NextMeClientResult clientResult = aiClient.generate(input);
            String message = clientResult.message().trim();
            if (message.length() > 300 || !message.endsWith(REQUIRED_ENDING)) {
                throw new IllegalStateException("NEXT ME 메시지 형식이 올바르지 않습니다.");
            }
            GenerationSource source = clientResult.fallbackUsed()
                    ? GenerationSource.FALLBACK
                    : GenerationSource.AI;
            return new GenerationResult(message, source);
        } catch (RuntimeException exception) {
            log.warn("NEXT ME AI 생성 실패. 기본 문구를 사용합니다: {}", exception.getMessage());
            return new GenerationResult(fallbackMessage(primaryReason, customReason), GenerationSource.FALLBACK);
        }
    }

    private String fallbackMessage(ChangeReason reason, String customReason) {
        return switch (reason) {
            case HEALTH_FITNESS -> "더 건강한 몸과 가벼운 일상을 선택하는 나";
            case FAMILY_PEOPLE -> "소중한 사람들과 건강한 시간을 이어가는 나";
            case COST -> "담배 대신 나를 위해 여유를 사용하는 나";
            case FREEDOM -> "담배에 끌려가지 않고 자유롭게 선택하는 나";
            case SMELL_APPEARANCE -> "상쾌한 냄새와 건강한 모습을 지켜가는 나";
            case PREGNANCY_CHILD -> "아이와 나를 위해 건강한 환경을 만드는 나";
            case HOBBY_DAILY -> "좋아하는 일과 일상을 더 온전히 즐기는 나";
            case OTHER -> customReason + "을 기억하며 원하는 변화를 선택하는 나";
        };
    }

    private String normalizeOptional(String value) {
        if (value == null) {
            return null;
        }
        String normalized = value.trim();
        return normalized.isEmpty() ? null : normalized;
    }

    private record GenerationResult(String message, GenerationSource source) {
    }
}
