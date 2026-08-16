package com.nextime.smokingrecord.application;

import com.nextime.common.error.BusinessException;
import com.nextime.common.error.ErrorCode;
import com.nextime.nexttime.domain.NextTimeSessionRepository;
import com.nextime.smokingrecord.api.RecordDetailResponse;
import com.nextime.smokingrecord.domain.SmokingRecordRepository;
import com.nextime.user.domain.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

import static com.nextime.nexttime.domain.NextTimeSessionStatus.RESULT_RECORDED;

@Service
@RequiredArgsConstructor
public class RecordDetailService {

    private final UserRepository userRepository;
    private final SmokingRecordRepository smokingRecordRepository;
    private final NextTimeSessionRepository nextTimeSessionRepository;

    @Transactional(readOnly = true)
    public RecordDetailResponse getDetail(UUID userId, UUID recordId) {
        if (!userRepository.existsById(userId)) {
            throw new BusinessException(ErrorCode.USER_NOT_REGISTERED);
        }

        return smokingRecordRepository.findByIdAndUser_Id(recordId, userId)
                .map(RecordDetailResponse::from)
                .orElseGet(() -> nextTimeSessionRepository
                        .findByIdAndUser_IdAndStatus(recordId, userId, RESULT_RECORDED)
                        .map(RecordDetailResponse::from)
                        .orElseThrow(() -> new BusinessException(
                                ErrorCode.RESOURCE_NOT_FOUND,
                                "흡연 기록을 찾을 수 없습니다."
                        )));
    }
}
