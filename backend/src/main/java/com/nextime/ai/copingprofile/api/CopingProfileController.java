package com.nextime.ai.copingprofile.api;

import com.nextime.ai.copingprofile.application.CopingProfileService;
import com.nextime.ai.copingprofile.domain.CopingProfile;
import com.nextime.common.api.ApiResponse;
import com.nextime.security.AuthenticatedUser;
import com.nextime.security.CurrentUser;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;

@RestController
@RequestMapping("/ai/onboarding/coping-profile")
public class CopingProfileController {

    private final CopingProfileService copingProfileService;

    public CopingProfileController(CopingProfileService copingProfileService) {
        this.copingProfileService = copingProfileService;
    }

    @PostMapping
    ResponseEntity<ApiResponse<CopingProfileResponse>> create(
            @CurrentUser AuthenticatedUser currentUser,
            @Valid @RequestBody CopingProfileRequest request
    ) {
        CopingProfile profile = copingProfileService.create(currentUser.userId(), request);
        return ResponseEntity.created(URI.create("/ai/onboarding/coping-profile/" + profile.getId()))
                .body(ApiResponse.success(CopingProfileResponse.from(profile)));
    }
}
