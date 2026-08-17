package com.nextime.user.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

@Embeddable
public class UserSmokingContextId implements Serializable {

    @Column(name = "user_id")
    private UUID userId;

    @Column(name = "context_id")
    private UUID contextId;

    protected UserSmokingContextId() {
    }

    public UserSmokingContextId(UUID userId, UUID contextId) {
        this.userId = userId;
        this.contextId = contextId;
    }

    @Override
    public boolean equals(Object object) {
        if (this == object) {
            return true;
        }
        if (!(object instanceof UserSmokingContextId that)) {
            return false;
        }
        return Objects.equals(userId, that.userId) && Objects.equals(contextId, that.contextId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, contextId);
    }
}
