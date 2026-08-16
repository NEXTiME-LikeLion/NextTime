package com.nextime.smokingrecord.api;

import com.nextime.common.api.ApiResponse;
import com.nextime.security.AuthenticatedUser;
import com.nextime.security.CurrentUser;
import com.nextime.smokingrecord.application.RecordDetailService;
import com.nextime.smokingrecord.application.SmokingRecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/records")
public class SmokingRecordController {

    private final SmokingRecordService smokingRecordService;
    private final RecordDetailService recordDetailService;

    @PostMapping("/smoking")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<SmokingRecordResponse> create(
            @CurrentUser AuthenticatedUser currentUser,
            @RequestBody CreateSmokingRecordRequest request
    ) {
        return ApiResponse.success(smokingRecordService.create(currentUser.userId(), request));
    }

    @GetMapping("/{recordId}")
    public ApiResponse<RecordDetailResponse> getDetail(
            @CurrentUser AuthenticatedUser currentUser,
            @PathVariable UUID recordId
    ) {
        return ApiResponse.success(recordDetailService.getDetail(currentUser.userId(), recordId));
    }
}
