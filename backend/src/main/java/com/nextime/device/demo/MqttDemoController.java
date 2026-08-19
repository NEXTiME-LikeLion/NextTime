package com.nextime.device.demo;

import com.nextime.push.WebPushAudience;
import com.nextime.security.AuthenticatedUser;
import com.nextime.security.CurrentUser;
import org.springframework.http.MediaType;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.Map;

@RestController
@RequestMapping("/api/demo")
public class MqttDemoController {

    private final MqttButtonSubscriber subscriber;
    private final ButtonEventStream eventStream;
    private final WebPushAudience audience;

    public MqttDemoController(
            MqttButtonSubscriber subscriber,
            ButtonEventStream eventStream,
            WebPushAudience audience
    ) {
        this.subscriber = subscriber;
        this.eventStream = eventStream;
        this.audience = audience;
    }

    @GetMapping("/mqtt/status")
    public Map<String, Object> status(@CurrentUser AuthenticatedUser user) {
        requireAllowed(user);
        return Map.of(
                "connected", subscriber.isConnected(),
                "brokerUrl", subscriber.getBrokerUrl(),
                "topic", subscriber.getTopic(),
                "lastEvent", subscriber.getLastEvent() == null
                        ? "아직 수신한 신호가 없습니다."
                        : subscriber.getLastEvent()
        );
    }

    @GetMapping(value = "/button-events", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public ResponseEntity<SseEmitter> buttonEvents(@CurrentUser AuthenticatedUser user) {
        requireAllowed(user);
        return ResponseEntity.ok()
                .cacheControl(CacheControl.noCache())
                .header("X-Accel-Buffering", "no")
                .contentType(MediaType.TEXT_EVENT_STREAM)
                .body(eventStream.connect());
    }

    private void requireAllowed(AuthenticatedUser user) {
        if (!audience.allows(user.email())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
    }
}
