package com.aiassistant.backend.kafka;

import com.aiassistant.backend.dto.design.CreateDesignRequestDTO;
import com.aiassistant.backend.model.User;
import com.aiassistant.backend.repository.UserRepository;
import com.aiassistant.backend.service.DesignService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@RequiredArgsConstructor
public class DesignJobConsumer {
    private static final Logger logger = LoggerFactory.getLogger(DesignJobConsumer.class);
    private final DesignService designService;
    private final ObjectMapper objectMapper;
    private final UserRepository userRepository;
    private final KafkaTemplate<String, String> kafkaTemplate;

    @KafkaListener(topics = "design-jobs", groupId = "${spring.kafka.consumer.group-id}")
    public void onMessage(String payload) {
        try {

            logger.info("Received Kafka message: {}", payload);
            Map<String, Object> data = objectMapper.readValue(payload, Map.class);
            CreateDesignRequestDTO req = objectMapper.convertValue(data.get("req"), CreateDesignRequestDTO.class);
            Long userId = ((Number) data.get("userId")).longValue();
            // Call DesignService to process (assumes DesignService can handle async)
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found for ID: " + userId));

            designService.createDesign(req, userId.toString()); // Update to use userId if needed
            logger.info("Processed design job for userId: {}", userId);
        } catch (Exception e) {
            // Handle DLQ or logging
            logger.error("Failed to process design job: {}", e.getMessage(), e);
            kafkaTemplate.send("design-jobs-dlq", payload);
        }
    }
}