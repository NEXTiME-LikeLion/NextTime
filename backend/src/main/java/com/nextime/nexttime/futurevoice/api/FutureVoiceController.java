package com.nextime.nexttime.futurevoice.api;

import com.nextime.common.api.ApiResponse;
import com.nextime.nexttime.futurevoice.application.FutureVoiceService;
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
public class FutureVoiceController {

    private final FutureVoiceService futureVoiceService;

    @PostMapping("/{sessionId}/future-voice")
    public ApiResponse<FutureVoiceResponse> generate(
            @CurrentUser AuthenticatedUser currentUser,
            @PathVariable UUID sessionId
    ) {
        return ApiResponse.success(futureVoiceService.generate(currentUser.userId(), sessionId));
    }
}
