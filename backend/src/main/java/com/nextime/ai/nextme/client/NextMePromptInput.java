package com.nextime.ai.nextme.client;

import java.util.List;

public record NextMePromptInput(
        List<String> changeReasons,
        String decisionTrigger,
        String futureSelf,
        String messageToFutureSelf
) {
}
