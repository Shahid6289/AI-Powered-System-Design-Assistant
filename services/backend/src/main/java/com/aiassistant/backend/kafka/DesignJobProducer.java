package com.aiassistant.backend.kafka;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Component;
import java.util.concurrent.CompletableFuture;

@Component
@RequiredArgsConstructor
public class DesignJobProducer {
    private static final Logger logger = LoggerFactory.getLogger(DesignJobProducer.class);
    private final KafkaTemplate<String, String> kafkaTemplate;

    public void send(String payload) {
        CompletableFuture<SendResult<String, String>> future = kafkaTemplate.send("design-jobs", payload);
        future.whenComplete((result, ex) -> {
            if (ex != null) {
                logger.error("Failed to send message to design-jobs: {}", ex.getMessage(), ex);
                kafkaTemplate.send("design-jobs-dlq", payload); // NEW: Send to DLQ
            } else {
                logger.info("Sent message to design-jobs: {}", payload);
            }
        });
    }
}