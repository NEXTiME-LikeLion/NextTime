package com.nextime.smokingcontext.domain;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface SmokingContextRepository extends JpaRepository<SmokingContext, UUID> {

    Optional<SmokingContext> findByIdAndContextTypeAndActiveTrue(
            UUID id,
            SmokingContextType contextType
    );
}
