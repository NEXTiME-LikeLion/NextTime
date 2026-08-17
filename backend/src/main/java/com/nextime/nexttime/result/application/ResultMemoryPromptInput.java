package com.nextime.nexttime.result.application;

public record ResultMemoryPromptInput(
        String trigger,
        String location,
        String cravingBefore,
        String action,
        String missionStatus,
        String result,
        String cravingAfter,
        String missionHelpfulness,
        String feedback
) {
}
