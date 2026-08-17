package com.nextime.mission.application;

import com.nextime.common.error.BusinessException;
import com.nextime.common.error.ErrorCode;
import com.nextime.mission.domain.Mission;
import com.nextime.mission.domain.MissionRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ExcludedMissionService {

    private final MissionRepository missionRepository;

    @Transactional
    public ExcludedMissionsResult getExcludedMissions(UUID userId) {
        List<ExcludedMission> missions = missionRepository.findExcludedMissions(userId).stream()
                .map(ExcludedMission::from)
                .toList();
        return new ExcludedMissionsResult(missions, missions.size());
    }

    @Transactional
    public RestoredMission restore(UUID userId, UUID missionId) {
        Mission mission = missionRepository.findById(missionId)
                .orElseThrow(() -> new BusinessException(
                        ErrorCode.RESOURCE_NOT_FOUND,
                        "행동 미션을 찾을 수 없습니다."
                ));
        Instant restoredAt = Instant.now();
        missionRepository.restoreMission(userId, missionId, restoredAt);
        return new RestoredMission(
                mission.getId(),
                mission.getCode(),
                mission.getName(),
                "AVAILABLE",
                restoredAt
        );
    }

    public record ExcludedMissionsResult(
            List<ExcludedMission> excludedMissions,
            int totalCount
    ) {
    }

    public record ExcludedMission(
            UUID missionId,
            String code,
            String name,
            String description,
            String exclusionReason,
            String source,
            Instant excludedAt
    ) {
        private static ExcludedMission from(MissionRepository.ExcludedMissionView mission) {
            return new ExcludedMission(
                    mission.getMissionId(),
                    mission.getCode(),
                    mission.getName(),
                    mission.getDescription(),
                    "최근 3번의 수행 결과에서 모두 나와 맞지 않는 행동으로 기록했어요.",
                    mission.getSource(),
                    mission.getExcludedAt()
            );
        }
    }

    public record RestoredMission(
            UUID missionId,
            String code,
            String name,
            String recommendationStatus,
            Instant restoredAt
    ) {
    }
}
