package com.nextime.nexttime.result.application;

import com.nextime.nexttime.result.api.NextTimeResultResponse;

record PersistedResult(
        NextTimeResultResponse response,
        ResultMemoryPromptInput promptInput,
        boolean newlyRecorded
) {
}
