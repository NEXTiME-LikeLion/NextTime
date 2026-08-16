package com.nextime.ai.nextme.api;

import com.nextime.ai.nextme.domain.ChangeReason;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public record NextMeGenerateRequest(
        @NotEmpty(message = "변화 이유를 한 개 이상 선택해 주세요.")
        @Size(max = 2, message = "변화 이유는 최대 2개까지 선택할 수 있습니다.")
        List<@NotNull(message = "변화 이유는 비어 있을 수 없습니다.") ChangeReason> changeReasons,

        @Size(max = 200, message = "직접 입력한 변화 이유는 200자 이내로 작성해 주세요.")
        String customReason,

        @NotBlank(message = "결심이 선 계기를 입력해 주세요.")
        @Size(max = 500, message = "결심이 선 계기는 500자 이내로 작성해 주세요.")
        String decisionTrigger,

        @NotBlank(message = "앞으로 되고 싶은 모습을 입력해 주세요.")
        @Size(max = 500, message = "앞으로 되고 싶은 모습은 500자 이내로 작성해 주세요.")
        String futureSelf,

        @NotBlank(message = "미래의 나에게 남기고 싶은 말을 입력해 주세요.")
        @Size(max = 500, message = "미래의 나에게 남기는 말은 500자 이내로 작성해 주세요.")
        String messageToFutureSelf
) {
}
