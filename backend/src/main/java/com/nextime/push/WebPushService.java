package com.nextime.push;

import nl.martijndwars.webpush.Notification;
import nl.martijndwars.webpush.PushService;
import org.apache.http.HttpResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;

import java.nio.charset.StandardCharsets;
import java.util.Map;

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

    public void notifyButtonPressed() {
        byte[] payload = payload();

        for (WebPushSubscription subscription
                : repository.findAllByAllowedUserEmails(audience.emails())) {
            try {
                Notification notification = new Notification(
                        subscription.getEndpoint(),
                        subscription.getP256dh(),
                        subscription.getAuth(),
                        payload
                );
                HttpResponse response = pushService.send(notification);
                int status = response.getStatusLine().getStatusCode();

                if (status == 404 || status == 410) {
                    repository.deleteById(subscription.getId());
                } else if (status < 200 || status >= 300) {
                    log.warn("Web Push 전송 실패: status={}, endpoint={}", status, subscription.getEndpoint());
                }
            } catch (Exception exception) {
                log.warn("Web Push 전송 중 오류: endpoint={}", subscription.getEndpoint(), exception);
            }
        }
    }

    private byte[] payload() {
        try {
            return objectMapper.writeValueAsBytes(Map.of(
                    "title", "NEXTiME",
                    "body", "버튼이 눌렸습니다.",
                    "url", "/next-time"
            ));
        } catch (Exception exception) {
            return "{\"title\":\"NEXTiME\",\"body\":\"버튼이 눌렸습니다.\",\"url\":\"/next-time\"}"
                    .getBytes(StandardCharsets.UTF_8);
        }
    }
}
