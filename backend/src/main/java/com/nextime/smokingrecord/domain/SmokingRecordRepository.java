package com.nextime.smokingrecord.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;

import java.util.Optional;
import java.util.UUID;

public interface SmokingRecordRepository extends JpaRepository<SmokingRecord, UUID> {

    @EntityGraph(attributePaths = "contexts")
    Optional<SmokingRecord> findByIdAndUser_Id(UUID recordId, UUID userId);
}
