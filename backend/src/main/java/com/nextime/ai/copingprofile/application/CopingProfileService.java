package com.nextime.ai.copingprofile.application;

import com.nextime.ai.copingprofile.api.CopingProfileRequest;
import com.nextime.ai.copingprofile.domain.CopingAction;
import com.nextime.ai.copingprofile.domain.CopingProfile;
import com.nextime.ai.copingprofile.domain.CopingProfileRepository;
import com.nextime.common.error.BusinessException;
import com.nextime.common.error.ErrorCode;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.UUID;

@Service
public class CopingProfileService {

    private final CopingProfileRepository copingProfileRepository;

    public CopingProfileService(CopingProfileRepository copingProfileRepository) {
        this.copingProfileRepository = copingProfileRepository;
    }

    @Transactional
    public CopingProfile create(UUID userId, CopingProfileRequest request) {
        if (new HashSet<>(request.actions()).size() != request.actions().size()) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST, "같은 행동을 중복 선택할 수 없습니다.");
        }

        boolean otherSelected = request.actions().contains(CopingAction.OTHER);
        String customAction = normalizeOptional(request.customAction());
        if (otherSelected && customAction == null) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST, "직접 입력할 행동을 작성해 주세요.");
        }
        if (!otherSelected && customAction != null) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST, "직접 입력을 선택한 경우에만 행동을 작성할 수 있습니다.");
        }

        return copingProfileRepository.save(new CopingProfile(userId, request.actions(), customAction));
    }

    private String normalizeOptional(String value) {
        if (value == null) {
            return null;
        }
        String normalized = value.trim();
        return normalized.isEmpty() ? null : normalized;
    }
}
