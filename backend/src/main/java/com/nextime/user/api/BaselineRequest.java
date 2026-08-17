package com.nextime.user.api;

import com.nextime.user.domain.SmokingFrequency;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public record BaselineRequest(
        @NotNull(message = "하루 흡연 횟수를 선택해 주세요.")
        SmokingFrequency smokingFrequency,

        @NotEmpty(message = "흡연 상황을 한 개 이상 선택해 주세요.")
        @Size(max = 2, message = "흡연 상황은 최대 2개까지 선택할 수 있습니다.")
        List<@NotEmpty(message = "흡연 상황 코드는 비어 있을 수 없습니다.") String> smokingContextCodes,

        @Size(max = 100, message = "기타 상황은 100자 이내로 입력해 주세요.")
        String otherContext
) {
}
