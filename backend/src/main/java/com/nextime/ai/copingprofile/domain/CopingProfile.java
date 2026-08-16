package com.nextime.ai.copingprofile.domain;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OrderColumn;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "coping_profiles")
public class CopingProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "coping_profile_actions", joinColumns = @JoinColumn(name = "coping_profile_id"))
    @OrderColumn(name = "action_order")
    @Enumerated(EnumType.STRING)
    @Column(name = "action", nullable = false, length = 40)
    private List<CopingAction> actions = new ArrayList<>();

    @Column(name = "custom_action", length = 200)
    private String customAction;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    protected CopingProfile() {
    }

    public CopingProfile(UUID userId, List<CopingAction> actions, String customAction) {
        this.userId = userId;
        this.actions = new ArrayList<>(actions);
        this.customAction = customAction;
    }

    @PrePersist
    void prePersist() {
        createdAt = Instant.now();
    }

    public UUID getId() {
        return id;
    }

    public List<CopingAction> getActions() {
        return List.copyOf(actions);
    }

    public String getCustomAction() {
        return customAction;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
