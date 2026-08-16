package com.nextime.ai.copingprofile.domain;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface CopingProfileRepository extends JpaRepository<CopingProfile, UUID> {
}
