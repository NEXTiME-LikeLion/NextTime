package com.nextime.nexttime.domain;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;
import java.util.Optional;
import java.util.Collection;

public interface NextTimeSessionRepository extends JpaRepository<NextTimeSession, UUID> {
    Optional<NextTimeSession> findByIdAndUser_Id(UUID sessionId, UUID userId);

    boolean existsByUser_IdAndStatusIn(
            UUID userId,
            Collection<NextTimeSessionStatus> statuses
    );

}
