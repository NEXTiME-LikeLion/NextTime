package com.nextime.user.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface UserTobaccoTypeRepository extends JpaRepository<UserTobaccoType, UserTobaccoTypeId> {

    @Modifying(flushAutomatically = true)
    @Query("DELETE FROM UserTobaccoType type WHERE type.id.userId = :userId")
    void deleteAllByUserId(@Param("userId") UUID userId);
}
