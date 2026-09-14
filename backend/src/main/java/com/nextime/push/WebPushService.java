package com.nextime.push;

import nl.martijndwars.webpush.Notification;
import nl.martijndwars.webpush.PushService;
import nl.martijndwars.webpush.Urgency;
import org.apache.http.HttpResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class WebPushService {

    private static final Logger log = LoggerFactory.getLogger(WebPushService.class);
    private final WebPushSubscriptionRepository repository;
    private final WebPushAudience audience;
    private final PushService pushService;
    private final ObjectMapper objectMapper;

    public WebPushService(
            WebPushSubscriptionRepository repository,
            WebPushAudience audience,
            PushService pushService,
            ObjectMapper objectMapper
    ) {
        this.repository = repository;
        this.audience = audience;
        this.pushService = pushService;
        this.objectMapper = objectMapper;
    }

    @Async("webPushExecutor")
    public void notifyButtonPressed() {
        long startedAt = System.nanoTime();
        List<WebPushSubscription> subscriptions =
                repository.findAllByAllowedUserEmails(audience.emails());
        PushSendResult result = send(subscriptions, payload(
                "NEXTiME",
                "버튼이 눌렸습니다.",
                "/next-time"
        ));
        log.info("MQTT 버튼 Web Push 결과: elapsedMs={}, subscriptions={}, accepted={}, removed={}, failed={}",
                elapsedMillis(startedAt), result.subscriptions(), result.accepted(), result.removed(), result.failed());
    }

    public PushSendResult sendTest(UUID userId) {
        List<WebPushSubscription> subscriptions = repository.findAllByUserId(userId);
        PushSendResult result = send(subscriptions, payload(
                "NEXTiME 테스트",
                "백엔드에서 보낸 테스트 알림입니다.",
                "/next-time"
        ));
        log.info("사용자 테스트 Web Push 결과: userId={}, subscriptions={}, accepted={}, removed={}, failed={}",
                userId, result.subscriptions(), result.accepted(), result.removed(), result.failed());
        return result;
    }

    private PushSendResult send(List<WebPushSubscription> subscriptions, byte[] payload) {
        int accepted = 0;
        int removed = 0;
        int failed = 0;

        for (WebPushSubscription subscription : subscriptions) {
            try {
                Notification notification = Notification.builder()
                        .endpoint(subscription.getEndpoint())
                        .userPublicKey(subscription.getP256dh())
                        .userAuth(subscription.getAuth())
                        .payload(payload)
                        .urgency(Urgency.HIGH)
                        .ttl(60)
                        .topic("nextime-button")
                        .build();
                HttpResponse response = pushService.send(notification);
                int status = response.getStatusLine().getStatusCode();

                if (status == 404 || status == 410) {
                    repository.deleteById(subscription.getId());
                    removed++;
                } else if (status < 200 || status >= 300) {
                    failed++;
                    log.warn("Web Push 전송 실패: status={}, endpoint={}", status, subscription.getEndpoint());
                } else {
                    accepted++;
                    log.info("Web Push 전송 수락: status={}, subscriptionId={}",
                            status, subscription.getId());
                }
            } catch (Exception exception) {
                failed++;
                log.warn("Web Push 전송 중 오류: endpoint={}", subscription.getEndpoint(), exception);
            }
        }

        return new PushSendResult(subscriptions.size(), accepted, removed, failed);
    }

    private byte[] payload(String title, String body, String url) {
        try {
            return objectMapper.writeValueAsBytes(Map.of(
                    "title", title,
                    "body", body,
                    "url", url
            ));
        } catch (Exception exception) {
            return "{\"title\":\"NEXTiME\",\"body\":\"알림이 도착했습니다.\",\"url\":\"/next-time\"}"
                    .getBytes(StandardCharsets.UTF_8);
        }
    }

    private long elapsedMillis(long startedAt) {
        return (System.nanoTime() - startedAt) / 1_000_000;
    }

    public record PushSendResult(
            int subscriptions,
            int accepted,
            int removed,
            int failed
    ) {
    }
}
