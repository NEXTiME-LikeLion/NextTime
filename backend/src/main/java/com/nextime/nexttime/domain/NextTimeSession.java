package com.nextime.nexttime.domain;

import com.nextime.smokingcontext.domain.SmokingContext;
import com.nextime.smokingcontext.domain.SmokingContextType;
import com.nextime.mission.domain.Mission;
import com.nextime.user.domain.User;
import jakarta.persistence.*;
import lombok.Getter;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

import static com.nextime.nexttime.domain.NextTimeSessionStatus.CONTEXT_SAVED;
import static com.nextime.nexttime.domain.NextTimeSessionStatus.CREATED;

@Entity
@Table(name = "next_time_sessions")
@Getter
public class NextTimeSession {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private NextTimeSessionStatus status;

    @Enumerated(EnumType.STRING)
    @Column(name = "craving_before", length = 10)
    private CravingBefore cravingBefore;

    @Enumerated(EnumType.STRING)
    @Column(name = "craving_after", length = 10)
    private CravingAfter cravingAfter;

    @Enumerated(EnumType.STRING)
    @Column(name = "mission_helpfulness", length = 20)
    private MissionHelpfulness missionHelpfulness;

    @Enumerated(EnumType.STRING)
    @Column(name = "recommendation_source", length = 20)
    private RecommendationSource recommendationSource;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recommended_mission_id")
    private Mission recommendedMission;

    @Column(name = "mission_code_snapshot", length = 50)
    private String missionCodeSnapshot;

    @Column(name = "mission_name_snapshot", length = 150)
    private String missionNameSnapshot;

    @Column(name = "mission_description_snapshot")
    private String missionDescriptionSnapshot;

    @Column(name = "completion_criteria_snapshot")
    private String completionCriteriaSnapshot;

    @Column(name = "estimated_seconds_snapshot")
    private Integer estimatedSecondsSnapshot;

    @Column(name = "recommendation_reason")
    private String recommendationReason;

    @Column(name = "recommended_at")
    private Instant recommendedAt;

    @Column(name = "mission_started_at")
    private Instant missionStartedAt;

    @Column(name = "mission_completed_at")
    private Instant missionCompletedAt;

    @Column(name = "mission_skipped_at")
    private Instant missionSkippedAt;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private NextTimeResult result;

    @Column(name = "result_recorded_at")
    private Instant resultRecordedAt;

    @Column(name = "result_feedback", length = 500)
    private String resultFeedback;

    @Column(name = "result_memory_summary", length = 500)
    private String resultMemorySummary;

    @Enumerated(EnumType.STRING)
    @Column(name = "result_memory_source", length = 20)
    private ResultMemorySource resultMemorySource;

    @Column(name = "future_voice_hook", length = 200)
    private String futureVoiceHook;

    @Column(name = "future_voice_acknowledge", length = 200)
    private String futureVoiceAcknowledge;

    @Column(name = "future_voice_reason", length = 200)
    private String futureVoiceReason;

    @Column(name = "future_voice_closing", length = 200)
    private String futureVoiceClosing;

    @Enumerated(EnumType.STRING)
    @Column(name = "future_voice_source", length = 20)
    private FutureVoiceSource futureVoiceSource;

    @Column(name = "future_voice_generated_at")
    private Instant futureVoiceGeneratedAt;

    @ManyToMany
    @JoinTable(
            name = "next_time_session_contexts",
            joinColumns = @JoinColumn(name = "session_id"),
            inverseJoinColumns = @JoinColumn(name = "context_id")
    )
    private Set<SmokingContext> contexts = new HashSet<>();

    @Column(name = "context_saved_at")
    private Instant contextSavedAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @Version
    @Column(nullable = false)
    private long version;

    protected NextTimeSession() {
    }

    public NextTimeSession(User user) {
        Instant now = Instant.now();
        this.user = user;
        this.status = CREATED;
        this.createdAt = now;
        this.updatedAt = now;
    }

    public void saveContext(
            CravingBefore cravingBefore,
            SmokingContext location,
            SmokingContext trigger,
            Instant savedAt
    ) {
        this.cravingBefore = cravingBefore;
        this.contexts.clear();
        this.contexts.add(location);
        this.contexts.add(trigger);
        this.status = CONTEXT_SAVED;
        this.contextSavedAt = savedAt;
        this.updatedAt = savedAt;
    }

    public void rewind(Instant rewoundAt) {
        this.status = CREATED;
        this.cravingBefore = null;
        this.cravingAfter = null;
        this.missionHelpfulness = null;
        this.recommendationSource = null;
        this.recommendedMission = null;
        this.missionCodeSnapshot = null;
        this.missionNameSnapshot = null;
        this.missionDescriptionSnapshot = null;
        this.completionCriteriaSnapshot = null;
        this.estimatedSecondsSnapshot = null;
        this.recommendationReason = null;
        this.recommendedAt = null;
        this.missionStartedAt = null;
        this.missionCompletedAt = null;
        this.missionSkippedAt = null;
        this.result = null;
        this.resultRecordedAt = null;
        this.resultFeedback = null;
        this.resultMemorySummary = null;
        this.resultMemorySource = null;
        this.futureVoiceHook = null;
        this.futureVoiceAcknowledge = null;
        this.futureVoiceReason = null;
        this.futureVoiceClosing = null;
        this.futureVoiceSource = null;
        this.futureVoiceGeneratedAt = null;
        this.contexts.clear();
        this.contextSavedAt = null;
        this.updatedAt = rewoundAt;
    }

    public SmokingContext contextOf(SmokingContextType type) {
        return contexts.stream()
                .filter(context -> context.getContextType() == type)
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("세션 Context가 완전하지 않습니다."));
    }

    public void recommend(
            Mission mission,
            String reason,
            RecommendationSource source,
            Instant recommendedAt
    ) {
        if (status != CONTEXT_SAVED) {
            throw new IllegalStateException("Context 저장 상태에서만 미션을 추천할 수 있습니다.");
        }

        this.recommendedMission = mission;
        this.missionCodeSnapshot = mission.getCode();
        this.missionNameSnapshot = mission.getName();
        this.missionDescriptionSnapshot = mission.getDescription();
        this.completionCriteriaSnapshot = mission.getCompletionCriteria();
        this.estimatedSecondsSnapshot = mission.getEstimatedSeconds();
        this.recommendationReason = reason;
        this.recommendationSource = source;
        this.recommendedAt = recommendedAt;
        this.status = NextTimeSessionStatus.MISSION_RECOMMENDED;
        this.updatedAt = recommendedAt;
    }

    public void startMission(Instant startedAt) {
        if (status != NextTimeSessionStatus.MISSION_RECOMMENDED) {
            throw new IllegalStateException("추천 완료 상태에서만 미션을 시작할 수 있습니다.");
        }

        this.status = NextTimeSessionStatus.MISSION_STARTED;
        this.missionStartedAt = startedAt;
        this.updatedAt = startedAt;
    }

    public void completeMission(Instant completedAt) {
        if (status != NextTimeSessionStatus.MISSION_STARTED) {
            throw new IllegalStateException("시작한 미션만 완료할 수 있습니다.");
        }

        this.status = NextTimeSessionStatus.MISSION_COMPLETED;
        this.missionCompletedAt = completedAt;
        this.updatedAt = completedAt;
    }

    public void skipMission(Instant skippedAt) {
        if (status != NextTimeSessionStatus.MISSION_RECOMMENDED) {
            throw new IllegalStateException("추천 완료 상태에서만 미션을 건너뛸 수 있습니다.");
        }

        this.status = NextTimeSessionStatus.CANCELLED;
        this.missionSkippedAt = skippedAt;
        this.updatedAt = skippedAt;
    }

    public void recordResult(
            NextTimeResult result,
            CravingAfter cravingAfter,
            MissionHelpfulness missionHelpfulness,
            String feedback,
            String memorySummary,
            ResultMemorySource memorySource,
            Instant recordedAt
    ) {
        if (status != NextTimeSessionStatus.MISSION_COMPLETED && status != NextTimeSessionStatus.CANCELLED) {
            throw new IllegalStateException("완료하거나 건너뛴 미션에만 결과를 기록할 수 있습니다.");
        }

        this.result = result;
        this.cravingAfter = cravingAfter;
        this.missionHelpfulness = missionHelpfulness;
        this.resultFeedback = feedback;
        this.resultMemorySummary = memorySummary;
        this.resultMemorySource = memorySource;
        this.resultRecordedAt = recordedAt;
        this.status = NextTimeSessionStatus.RESULT_RECORDED;
        this.updatedAt = recordedAt;
    }

    public void replaceResultMemory(String memorySummary, ResultMemorySource memorySource) {
        if (status != NextTimeSessionStatus.RESULT_RECORDED) {
            throw new IllegalStateException("결과 기록 완료 상태에서만 기억 문구를 변경할 수 있습니다.");
        }

        this.resultMemorySummary = memorySummary;
        this.resultMemorySource = memorySource;
        this.updatedAt = Instant.now();
    }

    public void saveFutureVoice(
            String hook,
            String acknowledge,
            String reason,
            String closing,
            FutureVoiceSource source,
            Instant generatedAt
    ) {
        if (status != CONTEXT_SAVED) {
            throw new IllegalStateException("현재 상황 저장 완료 상태에서만 미래의 목소리를 생성할 수 있습니다.");
        }
        this.futureVoiceHook = hook;
        this.futureVoiceAcknowledge = acknowledge;
        this.futureVoiceReason = reason;
        this.futureVoiceClosing = closing;
        this.futureVoiceSource = source;
        this.futureVoiceGeneratedAt = generatedAt;
        this.updatedAt = generatedAt;
    }

    public void replaceFutureVoice(
            String hook,
            String acknowledge,
            String reason,
            String closing,
            FutureVoiceSource source
    ) {
        if (futureVoiceSource == null) {
            throw new IllegalStateException("생성된 미래의 목소리가 없습니다.");
        }
        this.futureVoiceHook = hook;
        this.futureVoiceAcknowledge = acknowledge;
        this.futureVoiceReason = reason;
        this.futureVoiceClosing = closing;
        this.futureVoiceSource = source;
        this.updatedAt = Instant.now();
    }
}
