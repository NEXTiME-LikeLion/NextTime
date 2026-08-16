package com.nextime.smokingrecord.domain;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface SmokingRecordRepository extends JpaRepository<SmokingRecord, UUID> {
}
