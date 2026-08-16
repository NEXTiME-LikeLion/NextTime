package com.nextime.smokingrecord.application;

import com.nextime.common.error.BusinessException;
import com.nextime.common.error.ErrorCode;
import com.nextime.smokingcontext.domain.SmokingContext;
import com.nextime.smokingcontext.domain.SmokingContextRepository;
import com.nextime.smokingcontext.domain.SmokingContextType;
import com.nextime.smokingrecord.api.CreateSmokingRecordRequest;
import com.nextime.smokingrecord.api.SmokingRecordResponse;
import com.nextime.smokingrecord.domain.SmokingRecord;
import com.nextime.smokingrecord.domain.SmokingRecordRepository;
import com.nextime.user.domain.User;
import com.nextime.user.domain.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SmokingRecordService {

    private final UserRepository userRepository;
    private final SmokingContextRepository smokingContextRepository;
    private final SmokingRecordRepository smokingRecordRepository;

    @Transactional
    public SmokingRecordResponse create(UUID userId, CreateSmokingRecordRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_REGISTERED));
        if (!user.isOnboardingCompleted()) {
            throw new BusinessException(
                    ErrorCode.CONFLICT,
                    "온보딩을 완료한 후 흡연 기록을 저장할 수 있습니다."
            );
        }

        SmokingContext trigger = findTrigger(request.triggerContextId());
        SmokingRecord record = new SmokingRecord(user, trigger, Instant.now());
        return SmokingRecordResponse.from(smokingRecordRepository.save(record));
    }

    private SmokingContext findTrigger(UUID triggerContextId) {
        if (triggerContextId == null) {
            return null;
        }
        return smokingContextRepository
                .findByIdAndContextTypeAndActiveTrue(triggerContextId, SmokingContextType.TRIGGER)
                .orElseThrow(() -> new BusinessException(
                        ErrorCode.INVALID_REQUEST,
                        "유효하지 않은 흡연 상황입니다."
                ));
    }
}
