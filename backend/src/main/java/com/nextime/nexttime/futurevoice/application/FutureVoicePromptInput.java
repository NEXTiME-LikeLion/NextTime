package com.nextime.nexttime.futurevoice.application;

public record FutureVoicePromptInput(
        String craving,
        String location,
        String trigger,
        String goal,
        String nextMeHeadline,
        String decisionTrigger,
        String futureSelf,
        String messageToFutureSelf
) {
}
