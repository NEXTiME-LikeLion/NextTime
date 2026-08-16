package com.nextime.nexttime.result.api;

import com.nextime.common.api.ApiResponse;
import com.nextime.nexttime.result.application.ResultRecordingService;
import com.nextime.security.AuthenticatedUser;
import com.nextime.security.CurrentUser;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/next-time/sessions")
public class NextTimeResultController {

    private final ResultRecordingService resultRecordingService;

    @PostMapping("/{sessionId}/result")
    public ApiResponse<NextTimeResultResponse> record(
            @CurrentUser AuthenticatedUser currentUser,
            @PathVariable UUID sessionId,
            @Valid @RequestBody RecordNextTimeResultRequest request
    ) {
        return ApiResponse.success(resultRecordingService.record(currentUser.userId(), sessionId, request));
    }
}
