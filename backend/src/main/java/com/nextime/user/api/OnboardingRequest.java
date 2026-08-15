package com.nextime.user.api;

import com.nextime.user.domain.OnboardingGoal;
import com.nextime.user.domain.TobaccoType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public record OnboardingRequest(
        @NotNull(message = "기본 흡연 정보를 입력해 주세요.")
        @Valid
        BaselineRequest baseline,

        @NotEmpty(message = "주로 피우는 담배 종류를 한 개 이상 선택해 주세요.")
        @Size(max = 3, message = "담배 종류는 최대 3개까지 선택할 수 있습니다.")
        List<@NotNull(message = "담배 종류는 비어 있을 수 없습니다.") TobaccoType> tobaccoTypes,

        @NotNull(message = "원하는 변화 목표를 선택해 주세요.")
        OnboardingGoal changeGoal,

        @Size(max = 500, message = "끊기 어려운 순간은 500자 이내로 입력해 주세요.")
        String difficultMoment
) {
}
