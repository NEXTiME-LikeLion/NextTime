package com.nextime.pattern.api;

import com.nextime.common.api.ApiResponse;
import com.nextime.pattern.application.PatternOverviewService;
import com.nextime.security.AuthenticatedUser;
import com.nextime.security.CurrentUser;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/patterns")
public class PatternOverviewController {

    private final PatternOverviewService patternOverviewService;

    @GetMapping("/overview")
    public ApiResponse<PatternOverviewResponse> overview(
            @CurrentUser AuthenticatedUser currentUser
    ) {
        return ApiResponse.success(patternOverviewService.getOverview(currentUser.userId()));
    }
}
