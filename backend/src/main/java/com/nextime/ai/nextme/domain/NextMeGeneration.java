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

    @Column(name = "generated_message", nullable = false, length = 300)
    private String generatedMessage;

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
            String generatedMessage,
            GenerationSource source
    ) {
        this.userId = userId;
        this.changeReason1 = changeReasons.getFirst();
        this.changeReason2 = changeReasons.size() == 2 ? changeReasons.get(1) : null;
        this.customReason = customReason;
        this.decisionTrigger = decisionTrigger;
        this.futureSelf = futureSelf;
        this.messageToFutureSelf = messageToFutureSelf;
        this.generatedMessage = generatedMessage;
        this.source = source;
    }

    @PrePersist
    void prePersist() {
        createdAt = Instant.now();
    }

    public UUID getId() {
        return id;
    }

    public String getGeneratedMessage() {
        return generatedMessage;
    }

    public GenerationSource getSource() {
        return source;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
