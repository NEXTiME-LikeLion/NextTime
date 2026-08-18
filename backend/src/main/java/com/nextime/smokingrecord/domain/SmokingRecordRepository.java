package com.nextime.smokingrecord.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;
import java.time.Instant;
import java.util.UUID;

public interface SmokingRecordRepository extends JpaRepository<SmokingRecord, UUID> {

    @EntityGraph(attributePaths = "contexts")
    Optional<SmokingRecord> findByIdAndUser_Id(UUID recordId, UUID userId);

    @EntityGraph(attributePaths = "contexts")
    List<SmokingRecord> findByUser_IdOrderBySmokedAtDesc(UUID userId, Pageable pageable);

    List<SmokingRecord> findByUser_IdAndSmokedAtGreaterThanEqualAndSmokedAtLessThan(
            UUID userId,
            Instant start,
            Instant end
    );
}
