package com.nextime.mission.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public interface MissionRepository extends JpaRepository<Mission, UUID> {

    interface ExcludedMissionView {
        UUID getMissionId();

        String getCode();

        String getName();

        String getDescription();

        String getSource();

        Instant getExcludedAt();
    }

    interface RestoredMissionView {
        UUID getMissionId();

        Instant getRestoredAt();
    }

    @Query("""
            select distinct mission
            from Mission mission
            join mission.availableLocations location
            where mission.active = true
              and location.id = :locationId
            order by mission.displayOrder
            """)
    List<Mission> findActiveAvailableAt(@Param("locationId") UUID locationId);

    @Query(value = """
            select mission_id
            from user_mission_preferences
            where user_id = :userId
              and preference_type = 'EXCLUDED'
            """, nativeQuery = true)
    List<UUID> findExcludedMissionIds(@Param("userId") UUID userId);

    @Query(value = """
            select
                mission.id as "missionId",
                mission.code as "code",
                mission.name as "name",
                mission.description as "description",
                preference.source as "source",
                preference.updated_at as "excludedAt"
            from user_mission_preferences preference
            join missions mission on mission.id = preference.mission_id
            where preference.user_id = :userId
              and preference.preference_type = 'EXCLUDED'
            order by preference.updated_at desc, mission.display_order asc
            """, nativeQuery = true)
    List<ExcludedMissionView> findExcludedMissions(@Param("userId") UUID userId);

    @Query(value = """
            select
                mission_id as "missionId",
                updated_at as "restoredAt"
            from user_mission_preferences
            where user_id = :userId
              and preference_type = 'AVAILABLE'
              and source = 'USER_SELECTED'
            """, nativeQuery = true)
    List<RestoredMissionView> findRestoredMissions(@Param("userId") UUID userId);

    @Modifying(flushAutomatically = true)
    @Query(value = """
            INSERT INTO user_mission_preferences (
                user_id,
                mission_id,
                preference_type,
                source,
                created_at,
                updated_at
            )
            VALUES (
                :userId,
                :missionId,
                'EXCLUDED',
                'AUTO_EVALUATED',
                now(),
                now()
            )
            ON CONFLICT (user_id, mission_id)
            DO UPDATE SET
                preference_type = 'EXCLUDED',
                source = 'AUTO_EVALUATED',
                updated_at = now()
            """, nativeQuery = true)
    void saveAutomaticExclusion(
            @Param("userId") UUID userId,
            @Param("missionId") UUID missionId
    );

    @Modifying(flushAutomatically = true)
    @Query(value = """
            INSERT INTO user_mission_preferences (
                user_id,
                mission_id,
                preference_type,
                source,
                created_at,
                updated_at
            )
            VALUES (
                :userId,
                :missionId,
                'AVAILABLE',
                'USER_SELECTED',
                :restoredAt,
                :restoredAt
            )
            ON CONFLICT (user_id, mission_id)
            DO UPDATE SET
                preference_type = 'AVAILABLE',
                source = 'USER_SELECTED',
                updated_at = :restoredAt
            """, nativeQuery = true)
    void restoreMission(
            @Param("userId") UUID userId,
            @Param("missionId") UUID missionId,
            @Param("restoredAt") Instant restoredAt
    );
}
