package com.nextime.nexttime.api;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record SaveNextTimeContextRequest(
        @NotNull(message = "흡연 욕구 강도를 입력해 주세요.")
        @Min(value = 1, message = "흡연 욕구 강도는 1 이상이어야 합니다.")
        @Max(value = 5, message = "흡연 욕구 강도는 5 이하여야 합니다.")
        Integer cravingBefore,

        @NotNull(message = "현재 장소를 선택해 주세요.")
        UUID locationContextId,

        @NotNull(message = "흡연 욕구가 발생한 계기를 선택해 주세요.")
        UUID triggerContextId
) {
}
