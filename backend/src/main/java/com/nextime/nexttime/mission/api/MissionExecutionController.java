package com.nextime.nexttime.mission.api;

import com.nextime.common.api.ApiResponse;
import com.nextime.nexttime.mission.application.MissionExecutionService;
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
@RequestMapping("/next-time/sessions/{sessionId}/mission")
public class MissionExecutionController {

    private final MissionExecutionService missionExecutionService;

    @PostMapping("/start")
    public ApiResponse<MissionStartResponse> start(
            @CurrentUser AuthenticatedUser currentUser,
            @PathVariable UUID sessionId
    ) {
        return ApiResponse.success(missionExecutionService.start(currentUser.userId(), sessionId));
    }

    @PostMapping("/complete")
    public ApiResponse<MissionCompletionResponse> complete(
            @CurrentUser AuthenticatedUser currentUser,
            @PathVariable UUID sessionId
    ) {
        return ApiResponse.success(missionExecutionService.complete(currentUser.userId(), sessionId));
    }

    @PostMapping("/skip")
    public ApiResponse<MissionSkipResponse> skip(
            @CurrentUser AuthenticatedUser currentUser,
            @PathVariable UUID sessionId
    ) {
        return ApiResponse.success(missionExecutionService.skip(currentUser.userId(), sessionId));
    }
}
