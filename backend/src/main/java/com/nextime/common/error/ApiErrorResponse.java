package com.nextime.common.error;

import java.time.Instant;
import java.util.List;

public record ApiErrorResponse(
        String code,
        String message,
        List<FieldErrorResponse> fieldErrors,
        String path,
        Instant timestamp
) {
    public static ApiErrorResponse of(ErrorCode code, String message, String path) {
        return new ApiErrorResponse(code.name(), message, List.of(), path, Instant.now());
    }

    public static ApiErrorResponse validation(List<FieldErrorResponse> errors, String path) {
        ErrorCode code = ErrorCode.INVALID_REQUEST;
        return new ApiErrorResponse(code.name(), code.defaultMessage(), errors, path, Instant.now());
    }
}
