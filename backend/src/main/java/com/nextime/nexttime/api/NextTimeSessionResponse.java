package com.nextime.nexttime.api;

import com.nextime.nexttime.domain.NextTimeSession;
import com.nextime.nexttime.domain.NextTimeSessionStatus;
import lombok.Getter;

import java.time.Instant;
import java.util.UUID;

@Getter
public class NextTimeSessionResponse {

    private final UUID sessionId;
    private final NextTimeSessionStatus status;
    private final Instant createdAt;

    public NextTimeSessionResponse(NextTimeSession nextTimeSession) {
        this.sessionId = nextTimeSession.getId();
        this.status = nextTimeSession.getStatus();
        this.createdAt = nextTimeSession.getCreatedAt();
    }

}
