package com.nextime.ai.nextme.domain;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface NextMeGenerationRepository extends JpaRepository<NextMeGeneration, UUID> {
    Optional<NextMeGeneration> findFirstByUserIdOrderByCreatedAtDesc(UUID userId);
}
