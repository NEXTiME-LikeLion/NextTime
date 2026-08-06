package com.nextime.device.demo;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.Map;

@RestController
@RequestMapping("/api/demo")
public class MqttDemoController {

    private final MqttButtonSubscriber subscriber;
    private final ButtonEventStream eventStream;

    public MqttDemoController(
            MqttButtonSubscriber subscriber,
            ButtonEventStream eventStream
    ) {
        this.subscriber = subscriber;
        this.eventStream = eventStream;
    }

    @GetMapping("/mqtt/status")
    public Map<String, Object> status() {
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
    public SseEmitter buttonEvents() {
        return eventStream.connect();
    }
}
