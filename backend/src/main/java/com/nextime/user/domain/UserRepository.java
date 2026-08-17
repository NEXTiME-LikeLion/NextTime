package com.nextime.user.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByCognitoSub(String cognitoSub);

    Optional<User> findByEmail(String email);

    @Modifying(flushAutomatically = true, clearAutomatically = true)
    @Query(value = """
            INSERT INTO users (
                cognito_sub,
                email,
                onboarding_completed,
                created_at,
                updated_at
            )
            VALUES (:cognitoSub, :email, FALSE, now(), now())
            ON CONFLICT (cognito_sub) DO NOTHING
            """, nativeQuery = true)
    int insertIfAbsent(
            @Param("cognitoSub") String cognitoSub,
            @Param("email") String email
    );
}
