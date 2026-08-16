package com.nextime.smokingrecord.application;

import com.nextime.common.error.BusinessException;
import com.nextime.common.error.ErrorCode;
import com.nextime.nexttime.domain.NextTimeSessionRepository;
import com.nextime.smokingrecord.api.RecordListResponse;
import com.nextime.smokingrecord.api.RecordListResponse.RecordItem;
import com.nextime.smokingrecord.domain.SmokingRecordRepository;
import com.nextime.user.domain.User;
import com.nextime.user.domain.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.UUID;
import java.util.stream.Stream;

import static com.nextime.nexttime.domain.NextTimeSessionStatus.RESULT_RECORDED;

@Service
@RequiredArgsConstructor
public class RecordListService {

    private final UserRepository userRepository;
    private final SmokingRecordRepository smokingRecordRepository;
    private final NextTimeSessionRepository nextTimeSessionRepository;

    @Transactional(readOnly = true)
    public RecordListResponse getRecords(UUID userId, int limit) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_REGISTERED));
        if (!user.isOnboardingCompleted()) {
            throw new BusinessException(
                    ErrorCode.CONFLICT,
                    "온보딩을 완료한 후 흡연 기록을 조회할 수 있습니다."
            );
        }
        if (limit < 1 || limit > 50) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST, "limit은 1 이상 50 이하여야 합니다.");
        }

        PageRequest page = PageRequest.of(0, limit);
        Stream<RecordItem> manualRecords = smokingRecordRepository
                .findByUser_IdOrderBySmokedAtDesc(userId, page)
                .stream()
                .map(RecordItem::from);
        Stream<RecordItem> nextTimeRecords = nextTimeSessionRepository
                .findByUser_IdAndStatusOrderByResultRecordedAtDesc(userId, RESULT_RECORDED, page)
                .stream()
                .map(RecordItem::from);

        return new RecordListResponse(Stream.concat(manualRecords, nextTimeRecords)
                .sorted(Comparator.comparing(RecordItem::recordedAt).reversed())
                .limit(limit)
                .toList());
    }
}
