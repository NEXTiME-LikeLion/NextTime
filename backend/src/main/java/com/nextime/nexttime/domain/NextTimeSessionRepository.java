package com.nextime.nexttime.domain;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;
import java.util.Optional;

public interface NextTimeSessionRepository extends JpaRepository<NextTimeSession, UUID> {
    Optional<NextTimeSession> findByIdAndUser_Id(UUID sessionId, UUID userId);
}
