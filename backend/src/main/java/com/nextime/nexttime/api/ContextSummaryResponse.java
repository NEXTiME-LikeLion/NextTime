package com.nextime.nexttime.api;

import com.nextime.smokingcontext.domain.SmokingContext;

import java.util.UUID;

public record ContextSummaryResponse(UUID id, String code, String name) {

    public static ContextSummaryResponse from(SmokingContext context) {
        return new ContextSummaryResponse(context.getId(), context.getCode(), context.getName());
    }
}
