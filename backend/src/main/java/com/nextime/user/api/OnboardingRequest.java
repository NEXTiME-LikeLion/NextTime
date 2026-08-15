package com.nextime.user.api;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public record OnboardingRequest(
        @NotNull(message = "기본 흡연 정보를 입력해 주세요.")
        @Valid
        BaselineRequest baseline
) {
}
