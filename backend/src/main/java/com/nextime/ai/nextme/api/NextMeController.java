package com.nextime.ai.nextme.api;

import com.nextime.ai.nextme.application.NextMeService;
import com.nextime.ai.nextme.domain.NextMeGeneration;
import com.nextime.common.api.ApiResponse;
import com.nextime.security.AuthenticatedUser;
import com.nextime.security.CurrentUser;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;

@RestController
@RequestMapping("/ai/onboarding/next-me")
public class NextMeController {

    private final NextMeService nextMeService;

    public NextMeController(NextMeService nextMeService) {
        this.nextMeService = nextMeService;
    }

    @PostMapping
    ResponseEntity<ApiResponse<NextMeResponse>> generate(
            @CurrentUser AuthenticatedUser currentUser,
            @Valid @RequestBody NextMeGenerateRequest request
    ) {
        NextMeGeneration generation = nextMeService.generate(currentUser.userId(), request);
        return ResponseEntity.created(URI.create("/ai/onboarding/next-me"))
                .body(ApiResponse.success(NextMeResponse.from(generation)));
    }

    @GetMapping
    ApiResponse<NextMeResponse> getLatest(@CurrentUser AuthenticatedUser currentUser) {
        return ApiResponse.success(NextMeResponse.from(nextMeService.getLatest(currentUser.userId())));
    }
}
