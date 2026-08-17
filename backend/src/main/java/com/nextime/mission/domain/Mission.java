package com.nextime.mission.domain;

import com.nextime.smokingcontext.domain.SmokingContext;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.Getter;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "missions")
@Getter
public class Mission {

    @Id
    private UUID id;

    @Column(nullable = false, unique = true, length = 50)
    private String code;

    @Column(name = "action_type", nullable = false, length = 50)
    private String actionType;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(nullable = false)
    private String description;

    @Column(name = "completion_criteria", nullable = false)
    private String completionCriteria;

    @Column(name = "estimated_seconds", nullable = false)
    private int estimatedSeconds;

    @Column(name = "is_active", nullable = false)
    private boolean active;

    @Enumerated(EnumType.STRING)
    @Column(name = "effort_type", nullable = false, length = 20)
    private MissionEffortType effortType;

    @Column(name = "default_reason", nullable = false)
    private String defaultReason;

    @Column(name = "display_order", nullable = false)
    private short displayOrder;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "mission_available_locations",
            joinColumns = @JoinColumn(name = "mission_id"),
            inverseJoinColumns = @JoinColumn(name = "location_context_id")
    )
    private Set<SmokingContext> availableLocations = new HashSet<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected Mission() {
    }
}
