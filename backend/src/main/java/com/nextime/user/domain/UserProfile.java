package com.nextime.user.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "user_profiles")
public class UserProfile {

    @Id
    @Column(name = "user_id")
    private UUID userId;

    @Enumerated(EnumType.STRING)
    @Column(name = "smoking_frequency", length = 30)
    private SmokingFrequency smokingFrequency;

    @Enumerated(EnumType.STRING)
    @Column(name = "goal_type", length = 30)
    private OnboardingGoal goal;

    @Column(name = "difficult_moment", length = 500)
    private String difficultMoment;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected UserProfile() {
    }

    public UserProfile(
            UUID userId,
            SmokingFrequency smokingFrequency,
            OnboardingGoal goal,
            String difficultMoment
    ) {
        this.userId = userId;
        this.smokingFrequency = smokingFrequency;
        this.goal = goal;
        this.difficultMoment = difficultMoment;
    }

    public void updateOnboarding(
            SmokingFrequency smokingFrequency,
            OnboardingGoal goal,
            String difficultMoment
    ) {
        this.smokingFrequency = smokingFrequency;
        this.goal = goal;
        this.difficultMoment = difficultMoment;
    }

    @PrePersist
    void prePersist() {
        Instant now = Instant.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    void preUpdate() {
        updatedAt = Instant.now();
    }

    public SmokingFrequency getSmokingFrequency() {
        return smokingFrequency;
    }
}
