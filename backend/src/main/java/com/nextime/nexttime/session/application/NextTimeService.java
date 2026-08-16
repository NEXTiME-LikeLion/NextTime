package com.nextime.nexttime.session.application;

import com.nextime.common.error.BusinessException;
import com.nextime.common.error.ErrorCode;

import com.nextime.nexttime.session.api.NextTimeContextResponse;
import com.nextime.nexttime.session.api.NextTimeSessionResponse;
import com.nextime.nexttime.session.api.SaveNextTimeContextRequest;

import com.nextime.nexttime.domain.NextTimeSession;
import com.nextime.nexttime.domain.NextTimeSessionRepository;

import com.nextime.nexttime.domain.NextTimeSessionStatus;
import com.nextime.smokingcontext.domain.SmokingContext;
import com.nextime.smokingcontext.domain.SmokingContextRepository;
import com.nextime.smokingcontext.domain.SmokingContextType;

import com.nextime.user.domain.User;
import com.nextime.user.domain.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import static com.nextime.nexttime.domain.NextTimeSessionStatus.CREATED;

@Service
@RequiredArgsConstructor
public class NextTimeService {

    private final NextTimeSessionRepository nextTimeSessionRepository;
    private final UserRepository userRepository;
    private final SmokingContextRepository smokingContextRepository;

    /** NextTime 세션 생성 **/
    @Transactional
    public NextTimeSessionResponse createNextTimeSession(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_REGISTERED));

        if (!user.isOnboardingCompleted()) {
            throw new BusinessException(
                    ErrorCode.CONFLICT,
                    "온보딩을 완료한 후 NEXT TIME을 시작할 수 있습니다."
            );
        }

        boolean hasActiveSession =
                nextTimeSessionRepository.existsByUser_IdAndStatusIn(
                        userId,
                        List.of(
                                NextTimeSessionStatus.CREATED,
                                NextTimeSessionStatus.CONTEXT_SAVED,
                                NextTimeSessionStatus.MISSION_RECOMMENDED,
                                NextTimeSessionStatus.MISSION_STARTED,
                                NextTimeSessionStatus.MISSION_COMPLETED
                        )
                );

        if (hasActiveSession) {
            throw new BusinessException(
                    ErrorCode.CONFLICT,
                    "이미 진행 중인 NEXT TIME 세션이 있습니다."
            );
        }

        NextTimeSession session = new NextTimeSession(user);
        NextTimeSession savedSession = nextTimeSessionRepository.save(session);
        return new NextTimeSessionResponse(savedSession);
    }

    /** NEXT TIME 시작 당시의 욕구 강도, 장소, 계기 저장 **/
    @Transactional
    public NextTimeContextResponse saveContext(
            UUID userId,
            UUID sessionId,
            SaveNextTimeContextRequest request
    ) {
        NextTimeSession session = nextTimeSessionRepository.findByIdAndUser_Id(sessionId, userId)
                .orElseThrow(() -> new BusinessException(
                        ErrorCode.RESOURCE_NOT_FOUND,
                        "NEXT TIME 세션을 찾을 수 없습니다."
                ));

        if (session.getStatus() != CREATED) {
            throw new BusinessException(
                    ErrorCode.CONFLICT,
                    "현재 상태에서는 흡연 상황을 저장할 수 없습니다."
            );
        }

        SmokingContext location = findActiveContext(
                request.locationContextId(),
                SmokingContextType.LOCATION,
                "선택한 장소를 찾을 수 없습니다."
        );
        SmokingContext trigger = findActiveContext(
                request.triggerContextId(),
                SmokingContextType.TRIGGER,
                "선택한 흡연 계기를 찾을 수 없습니다."
        );

        session.saveContext(request.cravingBefore(), location, trigger, Instant.now());

        return NextTimeContextResponse.from(session, location, trigger);
    }

    private SmokingContext findActiveContext(
            UUID contextId,
            SmokingContextType type,
            String notFoundMessage
    ) {
        return smokingContextRepository.findByIdAndContextTypeAndActiveTrue(contextId, type)
                .orElseThrow(() -> new BusinessException(
                        ErrorCode.RESOURCE_NOT_FOUND,
                        notFoundMessage
                ));
    }

}
