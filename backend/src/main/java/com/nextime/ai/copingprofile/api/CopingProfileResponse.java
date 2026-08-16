package com.nextime.ai.copingprofile.api;

import com.nextime.ai.copingprofile.domain.CopingAction;
import com.nextime.ai.copingprofile.domain.CopingProfile;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record CopingProfileResponse(
        UUID profileId,
        List<CopingAction> actions,
        String customAction,
        Instant createdAt
) {
    static CopingProfileResponse from(CopingProfile profile) {
        return new CopingProfileResponse(
                profile.getId(),
                profile.getActions(),
                profile.getCustomAction(),
                profile.getCreatedAt()
        );
    }
}
