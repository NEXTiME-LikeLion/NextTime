package com.nextime.user.api;

import com.nextime.common.api.ApiResponse;
import com.nextime.common.error.BusinessException;
import com.nextime.common.error.ErrorCode;
import com.nextime.security.AuthenticatedUser;
import com.nextime.security.CurrentUser;
import com.nextime.user.application.UserRegistrationResult;
import com.nextime.user.application.UserRegistrationService;
import com.nextime.user.application.OnboardingService;
import com.nextime.user.domain.User;
import com.nextime.user.domain.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserRepository userRepository;
    private final UserRegistrationService userRegistrationService;
    private final OnboardingService onboardingService;

    public UserController(
            UserRepository userRepository,
            UserRegistrationService userRegistrationService,
            OnboardingService onboardingService
    ) {
        this.userRepository = userRepository;
        this.userRegistrationService = userRegistrationService;
        this.onboardingService = onboardingService;
    }

    @PostMapping
    ResponseEntity<ApiResponse<UserRegistrationResponse>> register(
            @AuthenticationPrincipal Jwt jwt
    ) {
        UserRegistrationResult result = userRegistrationService.register(
                jwt.getSubject(),
                jwt.getTokenValue()
        );
        ApiResponse<UserRegistrationResponse> response = ApiResponse.success(
                UserRegistrationResponse.from(result)
        );

        if (result.newlyRegistered()) {
            return ResponseEntity.created(URI.create("/users/me")).body(response);
        }
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    ApiResponse<MeResponse> me(@CurrentUser AuthenticatedUser currentUser) {
        User user = userRepository.findById(currentUser.userId())
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_REGISTERED));
        return ApiResponse.success(MeResponse.from(user));
    }

    @PutMapping("/me/onboarding")
    ApiResponse<OnboardingResponse> completeOnboarding(
            @CurrentUser AuthenticatedUser currentUser,
            @Valid @RequestBody OnboardingRequest request
    ) {
        User user = onboardingService.complete(currentUser.userId(), request);
        return ApiResponse.success(OnboardingResponse.from(user));
    }
}
