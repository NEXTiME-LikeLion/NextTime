package com.nextime.mission.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
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
}
