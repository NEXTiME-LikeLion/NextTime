package com.nextime.mission.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface MissionRepository extends JpaRepository<Mission, UUID> {

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
            select mission_id
            from user_mission_preferences
            where user_id = :userId
              and preference_type = 'AVAILABLE'
              and source = 'USER_SELECTED'
            """, nativeQuery = true)
    List<UUID> findUserSelectedAvailableMissionIds(@Param("userId") UUID userId);

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
            WHERE user_mission_preferences.source <> 'USER_SELECTED'
            """, nativeQuery = true)
    void saveAutomaticExclusion(
            @Param("userId") UUID userId,
            @Param("missionId") UUID missionId
    );
}
