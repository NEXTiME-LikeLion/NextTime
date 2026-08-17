package com.nextime.ai.copingprofile.api;

import com.nextime.ai.copingprofile.domain.CopingAction;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public record CopingProfileRequest(
        @NotEmpty(message = "도움이 될 행동을 한 개 이상 선택해 주세요.")
        List<@NotNull(message = "행동은 비어 있을 수 없습니다.") CopingAction> actions,

        @Size(max = 200, message = "직접 입력한 행동은 200자 이내로 작성해 주세요.")
        String customAction
) {
}
