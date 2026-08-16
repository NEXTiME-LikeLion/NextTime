package com.nextime.nexttime.application;

import com.nextime.mission.domain.Mission;
import com.nextime.mission.domain.MissionEffortType;
import com.nextime.nexttime.domain.CravingBefore;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Component
public class MissionCandidatePolicy {

    private static final Map<String, List<String>> TRIGGER_ORDER = Map.of(
            "WORK_OR_STUDY_ENDED", List.of(
                    "SHORT_WALK", "LEAVE_THE_SPOT", "SHORT_STRETCHING", "DRINK_WATER"
            ),
            "AFTER_MEAL", List.of(
                    "BRUSH_OR_RINSE", "GUM_OR_CANDY", "SHORT_WALK", "DRINK_WATER"
            ),
            "STRESS", List.of(
                    "SHORT_WALK", "STEADY_BREATHING", "SHORT_STRETCHING",
                    "TALK_TO_SOMEONE", "COLD_WATER"
            ),
            "BORED_OR_RESTING", List.of(
                    "SHORT_WALK", "LISTEN_TO_MUSIC", "GUM_OR_CANDY",
                    "DRINK_WATER", "HIDE_TOBACCO"
            ),
            "DRINKING", List.of(
                    "LEAVE_THE_SPOT", "TALK_TO_SOMEONE", "DRINK_WATER", "GUM_OR_CANDY"
            ),
            "OTHERS_SMOKING", List.of(
                    "LEAVE_THE_SPOT", "TALK_TO_SOMEONE", "GUM_OR_CANDY"
            )
    );

    private static final Map<String, List<String>> LOCATION_PREFIX = Map.of(
            "NEAR_SMOKING_AREA", List.of("LEAVE_THE_SPOT"),
            "SOCIAL_DRINKING", List.of("LEAVE_THE_SPOT", "TALK_TO_SOMEONE", "DRINK_WATER")
    );

    private static final Map<String, String> LOCATION_FALLBACK = Map.of(
            "HOME", "DRINK_WATER",
            "WORKPLACE_OR_SCHOOL", "DRINK_WATER",
            "ON_THE_MOVE", "STEADY_BREATHING",
            "NEAR_SMOKING_AREA", "LEAVE_THE_SPOT",
            "SOCIAL_DRINKING", "LEAVE_THE_SPOT"
    );

    private static final Set<String> ON_THE_MOVE_ALLOWED = Set.of(
            "STEADY_BREATHING", "GUM_OR_CANDY", "DRINK_WATER", "LISTEN_TO_MUSIC"
    );

    public List<Mission> orderCandidates(
            String locationCode,
            String triggerCode,
            CravingBefore craving,
            List<Mission> availableMissions
    ) {
        Map<String, Mission> availableByCode = new HashMap<>();
        for (Mission mission : availableMissions) {
            availableByCode.put(mission.getCode(), mission);
        }

        LinkedHashSet<String> orderedCodes = new LinkedHashSet<>();

        if ("ON_THE_MOVE".equals(locationCode)) {
            orderedCodes.addAll(List.of(
                    "STEADY_BREATHING", "GUM_OR_CANDY", "DRINK_WATER", "LISTEN_TO_MUSIC"
            ));
        } else {
            orderedCodes.addAll(LOCATION_PREFIX.getOrDefault(locationCode, List.of()));
            orderedCodes.addAll(TRIGGER_ORDER.getOrDefault(triggerCode, List.of()));
        }

        List<Mission> candidates = orderedCodes.stream()
                .filter(code -> !"ON_THE_MOVE".equals(locationCode) || ON_THE_MOVE_ALLOWED.contains(code))
                .map(availableByCode::get)
                .filter(java.util.Objects::nonNull)
                .toList();

        candidates = applyCravingOrder(candidates, craving);

        if (!candidates.isEmpty()) {
            return candidates;
        }

        Mission fallback = availableByCode.get(LOCATION_FALLBACK.get(locationCode));
        return fallback == null ? List.of() : List.of(fallback);
    }

    private List<Mission> applyCravingOrder(List<Mission> candidates, CravingBefore craving) {
        if (craving == CravingBefore.MEDIUM) {
            return candidates;
        }

        MissionEffortType preferredEffort = craving == CravingBefore.LOW
                ? MissionEffortType.LOW_EFFORT
                : MissionEffortType.ACTIVE;

        List<Mission> ordered = new ArrayList<>(candidates.size());
        candidates.stream()
                .filter(mission -> mission.getEffortType() == preferredEffort)
                .forEach(ordered::add);
        candidates.stream()
                .filter(mission -> mission.getEffortType() != preferredEffort)
                .forEach(ordered::add);
        return List.copyOf(ordered);
    }
}
