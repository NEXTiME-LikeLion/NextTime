package com.nextime.nexttime.repository;

import com.nextime.nexttime.entity.NextTimeSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface NextTimeSessionRepository extends JpaRepository<NextTimeSession, UUID> {
}
