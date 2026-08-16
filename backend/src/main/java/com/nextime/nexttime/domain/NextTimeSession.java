package com.nextime.nexttime.domain;

import com.nextime.smokingcontext.domain.SmokingContext;
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
}
