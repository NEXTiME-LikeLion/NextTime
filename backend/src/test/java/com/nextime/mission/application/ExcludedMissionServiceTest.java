package com.nextime.mission.application;

import com.nextime.common.error.BusinessException;
import com.nextime.mission.domain.Mission;
import com.nextime.mission.domain.MissionRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.mockito.ArgumentMatchers.eq;

@ExtendWith(MockitoExtension.class)
class ExcludedMissionServiceTest {

    @Mock
    private MissionRepository missionRepository;

    @Test
    void returnsExcludedMissionsAndTotalCount() {
        UUID userId = UUID.randomUUID();
        UUID missionId = UUID.randomUUID();
        Instant excludedAt = Instant.parse("2026-08-17T03:20:00Z");
        MissionRepository.ExcludedMissionView view = mock(MissionRepository.ExcludedMissionView.class);
        when(view.getMissionId()).thenReturn(missionId);
        when(view.getCode()).thenReturn("SHORT_WALK");
        when(view.getName()).thenReturn("잠깐 걷기");
        when(view.getDescription()).thenReturn("잠깐 걸어보세요.");
        when(view.getSource()).thenReturn("AUTO_EVALUATED");
        when(view.getExcludedAt()).thenReturn(excludedAt);
        when(missionRepository.findExcludedMissions(userId)).thenReturn(List.of(view));

        ExcludedMissionService service = new ExcludedMissionService(missionRepository);

        var result = service.getExcludedMissions(userId);

        assertThat(result.totalCount()).isEqualTo(1);
        assertThat(result.excludedMissions()).singleElement().satisfies(mission -> {
            assertThat(mission.missionId()).isEqualTo(missionId);
            assertThat(mission.code()).isEqualTo("SHORT_WALK");
            assertThat(mission.source()).isEqualTo("AUTO_EVALUATED");
            assertThat(mission.excludedAt()).isEqualTo(excludedAt);
        });
    }

    @Test
    void restoresMissionAsUserSelectedAvailability() {
        UUID userId = UUID.randomUUID();
        UUID missionId = UUID.randomUUID();
        Mission mission = mock(Mission.class);
        when(mission.getId()).thenReturn(missionId);
        when(mission.getCode()).thenReturn("SHORT_WALK");
        when(mission.getName()).thenReturn("잠깐 걷기");
        when(missionRepository.findById(missionId)).thenReturn(Optional.of(mission));

        ExcludedMissionService service = new ExcludedMissionService(missionRepository);

        var result = service.restore(userId, missionId);

        assertThat(result.missionId()).isEqualTo(missionId);
        assertThat(result.recommendationStatus()).isEqualTo("AVAILABLE");
        ArgumentCaptor<Instant> restoredAt = ArgumentCaptor.forClass(Instant.class);
        verify(missionRepository).restoreMission(eq(userId), eq(missionId), restoredAt.capture());
        assertThat(result.restoredAt()).isEqualTo(restoredAt.getValue());
    }

    @Test
    void rejectsRestoreWhenMissionDoesNotExist() {
        UUID userId = UUID.randomUUID();
        UUID missionId = UUID.randomUUID();
        when(missionRepository.findById(missionId)).thenReturn(Optional.empty());

        ExcludedMissionService service = new ExcludedMissionService(missionRepository);

        assertThatThrownBy(() -> service.restore(userId, missionId))
                .isInstanceOf(BusinessException.class)
                .hasMessage("행동 미션을 찾을 수 없습니다.");
    }
}
