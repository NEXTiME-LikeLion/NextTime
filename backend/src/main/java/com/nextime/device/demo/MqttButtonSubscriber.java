package com.nextime.device.demo;

import jakarta.annotation.PreDestroy;
import org.eclipse.paho.client.mqttv3.IMqttDeliveryToken;
import org.eclipse.paho.client.mqttv3.MqttCallbackExtended;
import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.eclipse.paho.client.mqttv3.persist.MemoryPersistence;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.concurrent.atomic.AtomicReference;

@Component
public class MqttButtonSubscriber implements MqttCallbackExtended {

    private static final Logger log = LoggerFactory.getLogger(MqttButtonSubscriber.class);

    private final ButtonEventStream eventStream;
    private final String brokerUrl;
    private final String clientId;
    private final String topic;
    private final AtomicReference<ButtonEvent> lastEvent = new AtomicReference<>();

    private MqttClient client;

    public MqttButtonSubscriber(
            ButtonEventStream eventStream,
            @Value("${mqtt.broker-url}") String brokerUrl,
            @Value("${mqtt.client-id}") String clientId,
            @Value("${mqtt.topic}") String topic
    ) {
        this.eventStream = eventStream;
        this.brokerUrl = brokerUrl;
        this.clientId = clientId;
        this.topic = topic;
    }

    @Scheduled(initialDelay = 500, fixedDelay = 3000)
    public synchronized void connectIfNeeded() {
        try {
            if (client != null && client.isConnected()) {
                return;
            }

            if (client == null) {
                client = new MqttClient(brokerUrl, clientId, new MemoryPersistence());
                client.setCallback(this);
            }

            MqttConnectOptions options = new MqttConnectOptions();
            options.setAutomaticReconnect(true);
            options.setCleanSession(true);
            options.setConnectionTimeout(3);

            log.info("MQTT Broker 연결 시도: {}", brokerUrl);
            client.connect(options);
        } catch (Exception exception) {
            log.warn("MQTT 연결 실패. 3초 뒤 재시도합니다: {}", exception.getMessage());
        }
    }

    @Override
    public void connectComplete(boolean reconnect, String serverURI) {
        try {
            client.subscribe(topic, 1);
            log.info("MQTT 연결 완료. 구독 토픽: {}", topic);
        } catch (Exception exception) {
            log.error("MQTT 토픽 구독 실패: {}", topic, exception);
        }
    }

    @Override
    public void connectionLost(Throwable cause) {
        log.warn("MQTT 연결이 끊어졌습니다: {}", cause.getMessage());
    }

    @Override
    public void messageArrived(String receivedTopic, MqttMessage message) {
        String payload = new String(message.getPayload(), StandardCharsets.UTF_8);
        ButtonEvent event = new ButtonEvent(receivedTopic, payload, Instant.now());
        lastEvent.set(event);

        log.info("ESP32 버튼 신호 수신: topic={}, payload={}", receivedTopic, payload);
        eventStream.publish(event);
    }

    @Override
    public void deliveryComplete(IMqttDeliveryToken token) {
        // 구독 전용 클라이언트라 처리할 내용이 없습니다.
    }

    public boolean isConnected() {
        return client != null && client.isConnected();
    }

    public ButtonEvent getLastEvent() {
        return lastEvent.get();
    }

    public String getBrokerUrl() {
        return brokerUrl;
    }

    public String getTopic() {
        return topic;
    }

    @PreDestroy
    public synchronized void close() throws Exception {
        if (client == null) {
            return;
        }
        if (client.isConnected()) {
            client.disconnect();
        }
        client.close();
    }
}
