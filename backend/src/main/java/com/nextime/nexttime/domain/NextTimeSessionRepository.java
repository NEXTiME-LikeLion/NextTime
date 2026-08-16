package com.nextime.nexttime.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;
import java.util.Optional;
import java.util.Collection;
import java.time.Instant;
import java.util.List;

public interface NextTimeSessionRepository extends JpaRepository<NextTimeSession, UUID> {
    Optional<NextTimeSession> findByIdAndUser_Id(UUID sessionId, UUID userId);

    @EntityGraph(attributePaths = {"recommendedMission", "contexts"})
    @Query("""
            select session
            from NextTimeSession session
            where session.id = :sessionId
              and session.user.id = :userId
            """)
    Optional<NextTimeSession> findWithRecommendationByIdAndUser_Id(
            @Param("sessionId") UUID sessionId,
            @Param("userId") UUID userId
    );

    @EntityGraph(attributePaths = {"recommendedMission", "contexts"})
    Optional<NextTimeSession> findByIdAndUser_IdAndStatus(
            UUID sessionId,
            UUID userId,
            NextTimeSessionStatus status
    );

    boolean existsByUser_IdAndStatusIn(
            UUID userId,
            Collection<NextTimeSessionStatus> statuses
    );

    @EntityGraph(attributePaths = {"recommendedMission", "contexts"})
    List<NextTimeSession> findByUser_IdAndStatusAndResultRecordedAtGreaterThanEqualOrderByResultRecordedAtDesc(
            UUID userId,
            NextTimeSessionStatus status,
            Instant since
    );

    List<NextTimeSession> findTop3ByUser_IdAndStatusOrderByResultRecordedAtDesc(
            UUID userId,
            NextTimeSessionStatus status
    );

    List<NextTimeSession> findByUser_IdAndCreatedAtGreaterThanEqualOrderByCreatedAtDesc(
            UUID userId,
            Instant since
    );

}
