package com.nextime.nexttime.mission.application;

import com.nextime.common.error.BusinessException;
import com.nextime.common.error.ErrorCode;
import com.nextime.nexttime.mission.api.MissionCompletionResponse;
import com.nextime.nexttime.mission.api.MissionSkipResponse;
import com.nextime.nexttime.mission.api.MissionStartResponse;
import com.nextime.nexttime.domain.NextTimeSession;
import com.nextime.nexttime.domain.NextTimeSessionRepository;
import com.nextime.nexttime.domain.NextTimeSessionStatus;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

import static com.nextime.nexttime.domain.NextTimeSessionStatus.CANCELLED;
import static com.nextime.nexttime.domain.NextTimeSessionStatus.MISSION_COMPLETED;
import static com.nextime.nexttime.domain.NextTimeSessionStatus.MISSION_RECOMMENDED;
import static com.nextime.nexttime.domain.NextTimeSessionStatus.MISSION_STARTED;

@Service
@RequiredArgsConstructor
public class MissionExecutionService {

    private final NextTimeSessionRepository sessionRepository;

    @Transactional
    public MissionStartResponse start(UUID userId, UUID sessionId) {
        NextTimeSession session = findOwnedSession(userId, sessionId);
        if (session.getStatus() == MISSION_STARTED) {
            return MissionStartResponse.from(session);
        }
        if (session.getStatus() != MISSION_RECOMMENDED) {
            throw conflict(
                    session.getStatus().ordinal() < MISSION_RECOMMENDED.ordinal()
                            ? "추천된 행동 미션이 없습니다."
                            : "현재 상태에서는 미션을 시작할 수 없습니다."
            );
        }

        session.startMission(Instant.now());
        return MissionStartResponse.from(session);
    }

    @Transactional
    public MissionCompletionResponse complete(UUID userId, UUID sessionId) {
        NextTimeSession session = findOwnedSession(userId, sessionId);
        if (session.getStatus() == MISSION_COMPLETED) {
            return MissionCompletionResponse.from(session);
        }
        if (session.getStatus() != MISSION_STARTED) {
            throw conflict(
                    session.getStatus().ordinal() < MISSION_STARTED.ordinal()
                            ? "행동 미션을 먼저 시작해 주세요."
                            : "현재 상태에서는 미션을 완료할 수 없습니다."
            );
        }

        session.completeMission(Instant.now());
        return MissionCompletionResponse.from(session);
    }

    @Transactional
    public MissionSkipResponse skip(UUID userId, UUID sessionId) {
        NextTimeSession session = findOwnedSession(userId, sessionId);
        if (session.getStatus() == CANCELLED && session.getMissionSkippedAt() != null) {
            return MissionSkipResponse.from(session);
        }
        if (session.getStatus() != MISSION_RECOMMENDED) {
            throw conflict(
                    session.getStatus().ordinal() < MISSION_RECOMMENDED.ordinal()
                            ? "건너뛸 행동 미션이 없습니다."
                            : "미션을 시작한 후에는 건너뛸 수 없습니다."
            );
        }

        session.skipMission(Instant.now());
        return MissionSkipResponse.from(session);
    }

    private NextTimeSession findOwnedSession(UUID userId, UUID sessionId) {
        return sessionRepository.findWithRecommendationByIdAndUser_Id(sessionId, userId)
                .orElseThrow(() -> new BusinessException(
                        ErrorCode.RESOURCE_NOT_FOUND,
                        "NEXT TIME 세션을 찾을 수 없습니다."
                ));
    }

    private BusinessException conflict(String message) {
        return new BusinessException(ErrorCode.CONFLICT, message);
    }
}
