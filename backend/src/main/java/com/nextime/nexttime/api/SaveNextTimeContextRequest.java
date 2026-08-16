package com.nextime.nexttime.api;

import com.nextime.nexttime.domain.CravingBefore;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record SaveNextTimeContextRequest(
        @NotNull(message = "흡연 욕구 강도를 입력해 주세요.")
        CravingBefore cravingBefore,

        @NotNull(message = "현재 장소를 선택해 주세요.")
        UUID locationContextId,

        @NotNull(message = "흡연 욕구가 발생한 계기를 선택해 주세요.")
        UUID triggerContextId
) {
}
