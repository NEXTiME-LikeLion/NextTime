package com.nextime.push;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface WebPushSubscriptionRepository extends JpaRepository<WebPushSubscription, UUID> {
    Optional<WebPushSubscription> findByEndpoint(String endpoint);

    long deleteByUserIdAndEndpoint(UUID userId, String endpoint);

    @Query("""
            SELECT subscription
            FROM WebPushSubscription subscription, User user
            WHERE subscription.userId = user.id
              AND LOWER(user.email) IN :emails
            """)
    List<WebPushSubscription> findAllByAllowedUserEmails(
            @Param("emails") Collection<String> emails
    );
}
