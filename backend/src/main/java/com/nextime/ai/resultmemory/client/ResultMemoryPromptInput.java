package com.nextime.ai.resultmemory.client;

public record ResultMemoryPromptInput(
        String trigger,
        String location,
        String cravingBefore,
        String action,
        String result,
        String cravingAfter,
        String missionHelpfulness,
        String feedback
) {
}
