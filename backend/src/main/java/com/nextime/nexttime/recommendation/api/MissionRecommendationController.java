package com.nextime.nexttime.recommendation.api;

import com.nextime.common.api.ApiResponse;
import com.nextime.nexttime.recommendation.application.MissionRecommendationService;
import com.nextime.security.AuthenticatedUser;
import com.nextime.security.CurrentUser;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/next-time/sessions")
public class MissionRecommendationController {

    private final MissionRecommendationService recommendationService;

    @PostMapping("/{sessionId}/recommendation")
    public ApiResponse<MissionRecommendationResponse> recommend(
            @CurrentUser AuthenticatedUser currentUser,
            @PathVariable UUID sessionId
    ) {
        return ApiResponse.success(recommendationService.recommend(currentUser.userId(), sessionId));
    }
}
