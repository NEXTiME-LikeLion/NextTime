package com.nextime.smokingrecord.domain;

import com.nextime.smokingcontext.domain.SmokingContext;
import com.nextime.user.domain.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "smoking_records")
@Getter
public class SmokingRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "smoked_at", nullable = false)
    private Instant smokedAt;

    @ManyToMany
    @JoinTable(
            name = "smoking_record_contexts",
            joinColumns = @JoinColumn(name = "smoking_record_id"),
            inverseJoinColumns = @JoinColumn(name = "context_id")
    )
    private Set<SmokingContext> contexts = new HashSet<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected SmokingRecord() {
    }

    public SmokingRecord(User user, SmokingContext trigger, Instant recordedAt) {
        this.user = user;
        this.smokedAt = recordedAt;
        this.createdAt = recordedAt;
        this.updatedAt = recordedAt;
        if (trigger != null) {
            this.contexts.add(trigger);
        }
    }

    public SmokingContext triggerOrNull() {
        return contexts.stream().findFirst().orElse(null);
    }
}
