package com.nextime.user.domain;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "user_tobacco_types")
public class UserTobaccoType {

    @EmbeddedId
    private UserTobaccoTypeId id;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    protected UserTobaccoType() {
    }

    public UserTobaccoType(UUID userId, TobaccoType tobaccoType) {
        id = new UserTobaccoTypeId(userId, tobaccoType);
    }

    @PrePersist
    void prePersist() {
        createdAt = Instant.now();
    }
}
