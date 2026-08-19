package com.nextime.ai.nextme.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "next_me_generations")
public class NextMeGeneration {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Enumerated(EnumType.STRING)
    @Column(name = "change_reason_1", nullable = false, length = 30)
    private ChangeReason changeReason1;

    @Enumerated(EnumType.STRING)
    @Column(name = "change_reason_2", length = 30)
    private ChangeReason changeReason2;

    @Column(name = "custom_reason", length = 200)
    private String customReason;

    @Column(name = "decision_trigger", nullable = false, length = 500)
    private String decisionTrigger;

    @Column(name = "future_self", nullable = false, length = 500)
    private String futureSelf;

    @Column(name = "message_to_future_self", nullable = false, length = 500)
    private String messageToFutureSelf;

    @Column(nullable = false, length = 36)
    private String headline;

    @Column(name = "start_reason", nullable = false, length = 24)
    private String startReason;

    @Enumerated(EnumType.STRING)
    @Column(name = "nextbud_theme", nullable = false, length = 40)
    private NextBudTheme nextBudTheme;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private GenerationSource source;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    protected NextMeGeneration() {
    }

    public NextMeGeneration(
            UUID userId,
            List<ChangeReason> changeReasons,
            String customReason,
            String decisionTrigger,
            String futureSelf,
            String messageToFutureSelf,
            String headline,
            String startReason,
            NextBudTheme nextBudTheme,
            GenerationSource source
    ) {
        this.userId = userId;
        this.changeReason1 = changeReasons.getFirst();
        this.changeReason2 = changeReasons.size() == 2 ? changeReasons.get(1) : null;
        this.customReason = customReason;
        this.decisionTrigger = decisionTrigger;
        this.futureSelf = futureSelf;
        this.messageToFutureSelf = messageToFutureSelf;
        this.headline = headline;
        this.startReason = startReason;
        this.nextBudTheme = nextBudTheme;
        this.source = source;
    }

    @PrePersist
    void prePersist() {
        createdAt = Instant.now();
    }

    public UUID getId() {
        return id;
    }

    public GenerationSource getSource() {
        return source;
    }

    public String getHeadline() {
        return headline;
    }

    public String getDecisionTrigger() {
        return decisionTrigger;
    }

    public String getFutureSelf() {
        return futureSelf;
    }

    public String getMessageToFutureSelf() {
        return messageToFutureSelf;
    }

    public List<ChangeReason> getChangeReasons() {
        return changeReason2 == null
                ? List.of(changeReason1)
                : List.of(changeReason1, changeReason2);
    }

    public String getCustomReason() {
        return customReason;
    }

    public void updateGoal(String nextMe, String motivation, String leftMessage) {
        if (nextMe != null) {
            this.futureSelf = nextMe;
            this.headline = truncate(nextMe, 36);
        }
        if (motivation != null) {
            this.decisionTrigger = motivation;
        }
        if (leftMessage != null) {
            this.messageToFutureSelf = leftMessage;
        }
    }

    private String truncate(String value, int maxLength) {
        int length = value.codePointCount(0, value.length());
        return length <= maxLength ? value : value.substring(0, value.offsetByCodePoints(0, maxLength));
    }

    public String getStartReason() {
        return startReason;
    }

    public NextBudTheme getNextBudTheme() {
        return nextBudTheme;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
