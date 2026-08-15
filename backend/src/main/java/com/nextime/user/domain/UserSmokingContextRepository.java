package com.nextime.user.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface UserSmokingContextRepository
        extends JpaRepository<UserSmokingContext, UserSmokingContextId> {

    @Modifying(flushAutomatically = true)
    @Query("DELETE FROM UserSmokingContext context WHERE context.id.userId = :userId")
    void deleteAllByUserId(@Param("userId") UUID userId);
}
