package com.nextime.nexttime.application;

import com.nextime.ai.resultmemory.client.ResultMemoryPromptInput;
import com.nextime.nexttime.api.NextTimeResultResponse;

record PersistedResult(
        NextTimeResultResponse response,
        ResultMemoryPromptInput promptInput,
        boolean newlyRecorded
) {
}
