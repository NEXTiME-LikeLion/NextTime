package com.nextime.nexttime.result.api;

import com.nextime.nexttime.domain.CravingAfter;
import com.nextime.nexttime.domain.MissionHelpfulness;
import com.nextime.nexttime.domain.NextTimeResult;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record RecordNextTimeResultRequest(
        @NotNull(message = "흡연 결과를 선택해 주세요.")
        NextTimeResult result,

        @NotNull(message = "현재 욕구를 선택해 주세요.")
        CravingAfter cravingAfter,

        @NotNull(message = "미션 평가를 선택해 주세요.")
        MissionHelpfulness missionHelpfulness,

        @Size(max = 500, message = "추가 피드백은 500자 이하로 입력해 주세요.")
        String feedback
) {
}
