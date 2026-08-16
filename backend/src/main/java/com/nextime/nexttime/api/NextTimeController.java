package com.nextime.nexttime.api;

import com.nextime.common.api.ApiResponse;
import com.nextime.nexttime.application.NextTimeService;
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
}
