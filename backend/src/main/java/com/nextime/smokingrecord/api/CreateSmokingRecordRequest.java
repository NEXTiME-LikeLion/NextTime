package com.nextime.smokingrecord.api;

import java.util.UUID;

public record CreateSmokingRecordRequest(
        UUID triggerContextId
) {
}
