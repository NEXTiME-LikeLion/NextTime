package com.nextime.nexttime.api;

import com.nextime.common.api.ApiResponse;
import com.nextime.nexttime.application.NextTimeService;
import com.nextime.nexttime.application.MissionExecutionService;
import com.nextime.nexttime.application.MissionRecommendationService;
import com.nextime.nexttime.application.ResultRecordingService;
import com.nextime.security.AuthenticatedUser;
import com.nextime.security.CurrentUser;
import lombok.RequiredArgsConstructor;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/next-time/sessions")
public class NextTimeController {

    private final NextTimeService nextTimeService;
    private final MissionRecommendationService missionRecommendationService;
    private final MissionExecutionService missionExecutionService;
    private final ResultRecordingService resultRecordingService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<NextTimeSessionResponse> createNextTimeSession(
            @CurrentUser AuthenticatedUser currentUser
    ) {
        NextTimeSessionResponse response =
                nextTimeService.createNextTimeSession(currentUser.userId());

        return ApiResponse.success(response);
    }

    @PatchMapping("/{sessionId}/context")
    public ApiResponse<NextTimeContextResponse> saveContext(
            @CurrentUser AuthenticatedUser currentUser,
            @PathVariable UUID sessionId,
            @Valid @RequestBody SaveNextTimeContextRequest request
    ) {
        NextTimeContextResponse response = nextTimeService.saveContext(
                currentUser.userId(),
                sessionId,
                request
        );

        return ApiResponse.success(response);
    }

    @PostMapping("/{sessionId}/recommendation")
    public ApiResponse<MissionRecommendationResponse> recommendMission(
            @CurrentUser AuthenticatedUser currentUser,
            @PathVariable UUID sessionId
    ) {
        return ApiResponse.success(
                missionRecommendationService.recommend(currentUser.userId(), sessionId)
        );
    }

    @PostMapping("/{sessionId}/mission/start")
    public ApiResponse<MissionStartResponse> startMission(
            @CurrentUser AuthenticatedUser currentUser,
            @PathVariable UUID sessionId
    ) {
        return ApiResponse.success(missionExecutionService.start(currentUser.userId(), sessionId));
    }

    @PostMapping("/{sessionId}/mission/complete")
    public ApiResponse<MissionCompletionResponse> completeMission(
            @CurrentUser AuthenticatedUser currentUser,
            @PathVariable UUID sessionId
    ) {
        return ApiResponse.success(missionExecutionService.complete(currentUser.userId(), sessionId));
    }

    @PostMapping("/{sessionId}/mission/skip")
    public ApiResponse<MissionSkipResponse> skipMission(
            @CurrentUser AuthenticatedUser currentUser,
            @PathVariable UUID sessionId
    ) {
        return ApiResponse.success(missionExecutionService.skip(currentUser.userId(), sessionId));
    }

    @PostMapping("/{sessionId}/result")
    public ApiResponse<NextTimeResultResponse> recordResult(
            @CurrentUser AuthenticatedUser currentUser,
            @PathVariable UUID sessionId,
            @Valid @RequestBody RecordNextTimeResultRequest request
    ) {
        return ApiResponse.success(resultRecordingService.record(currentUser.userId(), sessionId, request));
    }
}
