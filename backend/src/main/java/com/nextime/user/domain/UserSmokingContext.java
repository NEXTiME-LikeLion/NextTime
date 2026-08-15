package com.nextime.user.domain;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "user_smoking_contexts")
public class UserSmokingContext {

    @EmbeddedId
    private UserSmokingContextId id;

    @Column(name = "custom_text", length = 100)
    private String customText;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    protected UserSmokingContext() {
    }

    public UserSmokingContext(UUID userId, UUID contextId, String customText) {
        this.id = new UserSmokingContextId(userId, contextId);
        this.customText = customText;
    }

    @PrePersist
    void prePersist() {
        createdAt = Instant.now();
    }

    public String getCustomText() {
        return customText;
    }
}
