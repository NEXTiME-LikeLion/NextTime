package com.nextime.user.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

@Embeddable
public class UserTobaccoTypeId implements Serializable {

    @Column(name = "user_id")
    private UUID userId;

    @Enumerated(EnumType.STRING)
    @Column(name = "tobacco_type", length = 30)
    private TobaccoType tobaccoType;

    protected UserTobaccoTypeId() {
    }

    public UserTobaccoTypeId(UUID userId, TobaccoType tobaccoType) {
        this.userId = userId;
        this.tobaccoType = tobaccoType;
    }

    @Override
    public boolean equals(Object object) {
        if (this == object) {
            return true;
        }
        if (!(object instanceof UserTobaccoTypeId that)) {
            return false;
        }
        return Objects.equals(userId, that.userId) && tobaccoType == that.tobaccoType;
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, tobaccoType);
    }
}
