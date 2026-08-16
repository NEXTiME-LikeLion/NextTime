package com.nextime.ai.copingprofile.domain;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;
import java.util.Optional;

public interface CopingProfileRepository extends JpaRepository<CopingProfile, UUID> {
    Optional<CopingProfile> findFirstByUserIdOrderByCreatedAtDesc(UUID userId);
}
