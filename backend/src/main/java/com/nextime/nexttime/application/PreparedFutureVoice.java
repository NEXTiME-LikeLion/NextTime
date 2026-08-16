package com.nextime.nexttime.application;

import com.nextime.ai.futurevoice.client.FutureVoicePromptInput;
import com.nextime.nexttime.api.FutureVoiceResponse;

record PreparedFutureVoice(
        FutureVoiceResponse response,
        FutureVoicePromptInput promptInput,
        boolean newlyGenerated
) {
}
