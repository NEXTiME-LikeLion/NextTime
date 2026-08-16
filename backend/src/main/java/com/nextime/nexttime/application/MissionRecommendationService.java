package com.nextime.nexttime.application;

import com.nextime.ai.copingprofile.domain.CopingAction;
import com.nextime.ai.copingprofile.domain.CopingProfileRepository;
import com.nextime.common.error.BusinessException;
import com.nextime.common.error.ErrorCode;
import com.nextime.mission.domain.Mission;
import com.nextime.mission.domain.MissionRepository;
import com.nextime.nexttime.api.MissionRecommendationResponse;
import com.nextime.nexttime.domain.NextTimeSession;
import com.nextime.nexttime.domain.NextTimeSessionRepository;
import com.nextime.nexttime.domain.RecommendationSource;
import com.nextime.smokingcontext.domain.SmokingContext;
import com.nextime.smokingcontext.domain.SmokingContextType;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import static com.nextime.nexttime.domain.NextTimeSessionStatus.CONTEXT_SAVED;
import static com.nextime.nexttime.domain.NextTimeSessionStatus.MISSION_RECOMMENDED;
import static com.nextime.nexttime.domain.NextTimeSessionStatus.RESULT_RECORDED;

@Service
@RequiredArgsConstructor
public class MissionRecommendationService {

    private static final Map<CopingAction, String> COPING_TO_MISSION = Map.ofEntries(
            Map.entry(CopingAction.LEAVE_THE_PLACE, "LEAVE_THE_SPOT"),
            Map.entry(CopingAction.TAKE_A_WALK, "SHORT_WALK"),
            Map.entry(CopingAction.DRINK_WATER, "DRINK_WATER"),
            Map.entry(CopingAction.BRUSH_OR_RINSE, "BRUSH_OR_RINSE"),
            Map.entry(CopingAction.GUM_OR_CANDY, "GUM_OR_CANDY"),
            Map.entry(CopingAction.STRETCH, "SHORT_STRETCHING"),
            Map.entry(CopingAction.CONTROL_BREATHING, "STEADY_BREATHING"),
            Map.entry(CopingAction.WASH_WITH_COLD_WATER, "COLD_WATER"),
            Map.entry(CopingAction.LISTEN_TO_MUSIC, "LISTEN_TO_MUSIC"),
            Map.entry(CopingAction.TALK_TO_SOMEONE, "TALK_TO_SOMEONE"),
            Map.entry(CopingAction.HIDE_CIGARETTES, "HIDE_TOBACCO")
    );

    private final NextTimeSessionRepository sessionRepository;
    private final MissionRepository missionRepository;
    private final CopingProfileRepository copingProfileRepository;
    private final MissionCandidatePolicy candidatePolicy;

    @Transactional
    public MissionRecommendationResponse recommend(UUID userId, UUID sessionId) {
        NextTimeSession session = sessionRepository
                .findWithRecommendationByIdAndUser_Id(sessionId, userId)
                .orElseThrow(() -> new BusinessException(
                        ErrorCode.RESOURCE_NOT_FOUND,
                        "NEXT TIME 세션을 찾을 수 없습니다."
                ));

        if (session.getStatus() == MISSION_RECOMMENDED) {
            return MissionRecommendationResponse.from(session);
        }
        if (session.getStatus() != CONTEXT_SAVED) {
            throw new BusinessException(
                    ErrorCode.CONFLICT,
                    session.getStatus().ordinal() < CONTEXT_SAVED.ordinal()
                            ? "현재 상황을 먼저 저장해 주세요."
                            : "미션을 시작한 후에는 다시 추천할 수 없습니다."
            );
        }

        SmokingContext location = session.contextOf(SmokingContextType.LOCATION);
        SmokingContext trigger = session.contextOf(SmokingContextType.TRIGGER);

        Set<UUID> excludedIds = new HashSet<>(missionRepository.findExcludedMissionIds(userId));
        List<Mission> available = missionRepository.findActiveAvailableAt(location.getId()).stream()
                .filter(mission -> !excludedIds.contains(mission.getId()))
                .toList();

        MissionCandidatePolicy.CandidatePlan plan = candidatePolicy.planCandidates(
                location.getCode(),
                trigger.getCode(),
                session.getCravingBefore(),
                available
        );
        if (plan.candidates().isEmpty()) {
            throw new BusinessException(
                    ErrorCode.INTERNAL_ERROR,
                    "행동 미션을 추천할 수 없습니다."
            );
        }

        Set<String> preferredCodes = preferredMissionCodes(userId);
        List<NextTimeSession> history = sessionRepository
                .findByUser_IdAndStatusAndResultRecordedAtGreaterThanEqualOrderByResultRecordedAtDesc(
                        userId,
                        RESULT_RECORDED,
                        Instant.now().minus(30, ChronoUnit.DAYS)
                );

        Selection selection = select(
                plan.candidates(),
                history,
                trigger.getCode(),
                location.getCode(),
                trigger.getName(),
                location.getName(),
                preferredCodes,
                plan.fallback()
        );

        Instant now = Instant.now();
        session.recommend(selection.mission(), selection.reason(), selection.source(), now);
        return MissionRecommendationResponse.from(session);
    }

    private Selection select(
            List<Mission> orderedCandidates,
            List<NextTimeSession> history,
            String triggerCode,
            String locationCode,
            String triggerName,
            String locationName,
            Set<String> preferredCodes,
            boolean fallback
    ) {
        if (fallback) {
            Mission mission = orderedCandidates.getFirst();
            return new Selection(mission, mission.getDefaultReason(), RecommendationSource.FALLBACK);
        }

        List<Mission> exactCandidates = excludeNegativeWhenAlternativesExist(
                orderedCandidates,
                scores(history, orderedCandidates, triggerCode, locationCode)
        );
        Map<String, Integer> exactScores = scores(history, exactCandidates, triggerCode, locationCode);
        Mission exact = highestPositive(exactCandidates, exactScores, preferredCodes);
        if (exact != null) {
            return new Selection(
                    exact,
                    "비슷한 " + triggerName + "·" + locationName
                            + " 상황에서 이 행동이 도움이 됐다고 기록한 적이 있어요.",
                    RecommendationSource.RULE
            );
        }

        List<Mission> triggerCandidates = excludeNegativeWhenAlternativesExist(
                exactCandidates,
                scores(history, exactCandidates, triggerCode, null)
        );
        Map<String, Integer> triggerScores = scores(history, triggerCandidates, triggerCode, null);
        Mission trigger = highestPositive(triggerCandidates, triggerScores, preferredCodes);
        if (trigger != null) {
            return new Selection(
                    trigger,
                    "비슷한 " + triggerName + " 상황에서 이 행동이 도움이 됐다고 기록한 적이 있어요.",
                    RecommendationSource.RULE
            );
        }

        Mission selected = triggerCandidates.stream()
                .filter(mission -> preferredCodes.contains(mission.getCode()))
                .findFirst()
                .orElseGet(() -> triggerCandidates.isEmpty()
                        ? orderedCandidates.getFirst()
                        : triggerCandidates.getFirst());
        return new Selection(selected, selected.getDefaultReason(), RecommendationSource.RULE);
    }

    private Map<String, Integer> scores(
            List<NextTimeSession> history,
            List<Mission> candidates,
            String triggerCode,
            String locationCode
    ) {
        Set<UUID> candidateIds = candidates.stream().map(Mission::getId).collect(java.util.stream.Collectors.toSet());
        Map<UUID, List<NextTimeSession>> recentByMission = new LinkedHashMap<>();

        for (NextTimeSession past : history) {
            if (past.getRecommendedMission() == null
                    || !candidateIds.contains(past.getRecommendedMission().getId())
                    || !matches(past, SmokingContextType.TRIGGER, triggerCode)
                    || (locationCode != null && !matches(past, SmokingContextType.LOCATION, locationCode))) {
                continue;
            }
            List<NextTimeSession> recent = recentByMission.computeIfAbsent(
                    past.getRecommendedMission().getId(), ignored -> new ArrayList<>()
            );
            if (recent.size() < 3) {
                recent.add(past);
            }
        }

        Map<String, Integer> result = new HashMap<>();
        for (Mission candidate : candidates) {
            List<NextTimeSession> recent = recentByMission.get(candidate.getId());
            if (recent == null) {
                continue;
            }
            int score = recent.stream()
                    .mapToInt(past -> {
                        int helpfulnessScore = past.getMissionHelpfulness() == null
                                ? 0
                                : past.getMissionHelpfulness().score();
                        return helpfulnessScore + past.getResult().score();
                    })
                    .sum();
            result.put(candidate.getCode(), score);
        }
        return result;
    }

    private boolean matches(NextTimeSession session, SmokingContextType type, String code) {
        return session.getContexts().stream()
                .anyMatch(context -> context.getContextType() == type && context.getCode().equals(code));
    }

    private List<Mission> excludeNegativeWhenAlternativesExist(
            List<Mission> candidates,
            Map<String, Integer> scoreByCode
    ) {
        boolean hasAlternative = candidates.stream()
                .anyMatch(mission -> scoreByCode.getOrDefault(mission.getCode(), 0) >= 0);
        if (!hasAlternative) {
            return candidates;
        }
        return candidates.stream()
                .filter(mission -> scoreByCode.getOrDefault(mission.getCode(), 0) >= 0)
                .toList();
    }

    private Mission highestPositive(
            List<Mission> candidates,
            Map<String, Integer> scoreByCode,
            Set<String> preferredCodes
    ) {
        Map<String, Integer> order = new HashMap<>();
        for (int index = 0; index < candidates.size(); index++) {
            order.put(candidates.get(index).getCode(), index);
        }
        return candidates.stream()
                .filter(mission -> scoreByCode.getOrDefault(mission.getCode(), 0) > 0)
                .max(Comparator
                        .comparingInt((Mission mission) -> scoreByCode.get(mission.getCode()))
                        .thenComparing(mission -> preferredCodes.contains(mission.getCode()))
                        .thenComparingInt(mission -> -order.get(mission.getCode())))
                .orElse(null);
    }

    private Set<String> preferredMissionCodes(UUID userId) {
        return copingProfileRepository.findFirstByUserIdOrderByCreatedAtDesc(userId)
                .map(profile -> profile.getActions().stream()
                        .map(COPING_TO_MISSION::get)
                        .filter(java.util.Objects::nonNull)
                        .collect(java.util.stream.Collectors.toSet()))
                .orElseGet(Set::of);
    }

    private record Selection(Mission mission, String reason, RecommendationSource source) {
    }
}
