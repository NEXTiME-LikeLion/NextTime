package com.nextime.nexttime.dto;

import com.nextime.nexttime.entity.NextTimeSession;
import lombok.Getter;

import java.time.Instant;
import java.util.UUID;

@Getter
public class NextTimeSessionResponse {

    private final UUID id;
    private final String status;
    private final Instant createdAt;

    public NextTimeSessionResponse(NextTimeSession nextTimeSession) {
        this.id = nextTimeSession.getId();
        this.status = nextTimeSession.getStatus();
        this.createdAt = nextTimeSession.getCreatedAt();
    }

}
