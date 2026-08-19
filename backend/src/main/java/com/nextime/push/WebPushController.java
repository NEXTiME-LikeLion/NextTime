package com.nextime.push;

import com.nextime.security.AuthenticatedUser;
import com.nextime.security.CurrentUser;
import jakarta.validation.Valid;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/push/subscriptions")
public class WebPushController {

    private final WebPushSubscriptionRepository repository;
    private final WebPushAudience audience;

    public WebPushController(
            WebPushSubscriptionRepository repository,
            WebPushAudience audience
    ) {
        this.repository = repository;
        this.audience = audience;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void subscribe(
            @CurrentUser AuthenticatedUser user,
            @Valid @RequestBody PushSubscriptionRequest request
    ) {
        if (!audience.allows(user.email())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }

        WebPushSubscription subscription = repository.findByEndpoint(request.endpoint())
                .map(existing -> {
                    existing.replace(user.userId(), request.keys().p256dh(), request.keys().auth());
                    return existing;
                })
                .orElseGet(() -> new WebPushSubscription(
                        user.userId(),
                        request.endpoint(),
                        request.keys().p256dh(),
                        request.keys().auth()
                ));

        repository.save(subscription);
    }

    @DeleteMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Transactional
    public void unsubscribe(
            @CurrentUser AuthenticatedUser user,
            @Valid @RequestBody PushUnsubscriptionRequest request
    ) {
        repository.deleteByUserIdAndEndpoint(user.userId(), request.endpoint());
    }
}
