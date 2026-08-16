package com.nextime.nexttime.application;

import com.nextime.mission.domain.Mission;
import com.nextime.mission.domain.MissionEffortType;
import org.junit.jupiter.api.Test;

import java.util.List;

import static com.nextime.nexttime.domain.CravingBefore.HIGH;
import static com.nextime.nexttime.domain.CravingBefore.LOW;
import static com.nextime.nexttime.domain.CravingBefore.MEDIUM;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class MissionCandidatePolicyTest {

    private final MissionCandidatePolicy policy = new MissionCandidatePolicy();

    @Test
    void usesTriggerDefaultOrderForMediumCraving() {
        List<Mission> candidates = policy.orderCandidates(
                "HOME",
                "AFTER_MEAL",
                MEDIUM,
                List.of(
                        mission("DRINK_WATER", MissionEffortType.LOW_EFFORT),
                        mission("SHORT_WALK", MissionEffortType.ACTIVE),
                        mission("GUM_OR_CANDY", MissionEffortType.LOW_EFFORT),
                        mission("BRUSH_OR_RINSE", MissionEffortType.LOW_EFFORT)
                )
        );

        assertThat(codes(candidates)).containsExactly(
                "BRUSH_OR_RINSE", "GUM_OR_CANDY", "SHORT_WALK", "DRINK_WATER"
        );
    }

    @Test
    void stablyMovesLowEffortActionsForwardForLowCraving() {
        List<Mission> candidates = policy.orderCandidates(
                "HOME",
                "WORK_OR_STUDY_ENDED",
                LOW,
                List.of(
                        mission("SHORT_WALK", MissionEffortType.ACTIVE),
                        mission("LEAVE_THE_SPOT", MissionEffortType.ACTIVE),
                        mission("SHORT_STRETCHING", MissionEffortType.LOW_EFFORT),
                        mission("DRINK_WATER", MissionEffortType.LOW_EFFORT)
                )
        );

        assertThat(codes(candidates)).containsExactly(
                "SHORT_STRETCHING", "DRINK_WATER", "SHORT_WALK", "LEAVE_THE_SPOT"
        );
    }

    @Test
    void stablyMovesActiveActionsForwardForHighCraving() {
        List<Mission> candidates = policy.orderCandidates(
                "HOME",
                "STRESS",
                HIGH,
                List.of(
                        mission("SHORT_WALK", MissionEffortType.ACTIVE),
                        mission("STEADY_BREATHING", MissionEffortType.LOW_EFFORT),
                        mission("SHORT_STRETCHING", MissionEffortType.LOW_EFFORT),
                        mission("TALK_TO_SOMEONE", MissionEffortType.ACTIVE),
                        mission("COLD_WATER", MissionEffortType.LOW_EFFORT)
                )
        );

        assertThat(codes(candidates)).containsExactly(
                "SHORT_WALK", "TALK_TO_SOMEONE", "STEADY_BREATHING",
                "SHORT_STRETCHING", "COLD_WATER"
        );
    }

    @Test
    void appliesSmokingAreaOverrideBeforeTriggerOrder() {
        List<Mission> candidates = policy.orderCandidates(
                "NEAR_SMOKING_AREA",
                "AFTER_MEAL",
                MEDIUM,
                List.of(
                        mission("LEAVE_THE_SPOT", MissionEffortType.ACTIVE),
                        mission("GUM_OR_CANDY", MissionEffortType.LOW_EFFORT),
                        mission("SHORT_WALK", MissionEffortType.ACTIVE)
                )
        );

        assertThat(codes(candidates)).containsExactly(
                "LEAVE_THE_SPOT", "GUM_OR_CANDY", "SHORT_WALK"
        );
    }

    @Test
    void restrictsOnTheMoveCandidatesToSafeActions() {
        List<Mission> candidates = policy.orderCandidates(
                "ON_THE_MOVE",
                "STRESS",
                MEDIUM,
                List.of(
                        mission("STEADY_BREATHING", MissionEffortType.LOW_EFFORT),
                        mission("GUM_OR_CANDY", MissionEffortType.LOW_EFFORT),
                        mission("DRINK_WATER", MissionEffortType.LOW_EFFORT),
                        mission("LISTEN_TO_MUSIC", MissionEffortType.LOW_EFFORT),
                        mission("SHORT_WALK", MissionEffortType.ACTIVE)
                )
        );

        assertThat(codes(candidates)).containsExactly(
                "STEADY_BREATHING", "GUM_OR_CANDY", "DRINK_WATER", "LISTEN_TO_MUSIC"
        );
    }

    @Test
    void usesLocationFallbackWhenTriggerProducesNoCandidate() {
        Mission water = mission("DRINK_WATER", MissionEffortType.LOW_EFFORT);

        List<Mission> candidates = policy.orderCandidates(
                "HOME",
                "UNKNOWN_TRIGGER",
                MEDIUM,
                List.of(water)
        );

        assertThat(codes(candidates)).containsExactly("DRINK_WATER");
    }

    private Mission mission(String code, MissionEffortType effortType) {
        Mission mission = mock(Mission.class);
        when(mission.getCode()).thenReturn(code);
        when(mission.getEffortType()).thenReturn(effortType);
        return mission;
    }

    private List<String> codes(List<Mission> missions) {
        return missions.stream().map(Mission::getCode).toList();
    }
}
