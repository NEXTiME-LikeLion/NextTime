package com.nextime.nexttime.futurevoice.application;

import com.nextime.nexttime.futurevoice.api.FutureVoiceResponse;

record PreparedFutureVoice(
        FutureVoiceResponse response,
        FutureVoicePromptInput promptInput,
        boolean newlyGenerated
) {
}
