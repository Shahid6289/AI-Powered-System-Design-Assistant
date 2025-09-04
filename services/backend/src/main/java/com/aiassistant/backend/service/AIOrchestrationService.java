package com.aiassistant.backend.service;

import com.aiassistant.backend.dto.design.CreateDesignRequestDTO;
import com.aiassistant.backend.kafka.DesignJobProducer;
import com.aiassistant.backend.model.User;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class AIOrchestrationService {

    private final DesignJobProducer producer;
    private final ObjectMapper objectMapper;

    public void queueJob(CreateDesignRequestDTO req, User user) {
        try {
            // Serialize to JSON payload
            Map<String, Object> payload = Map.of("req", req, "userId", user.getId());
            String payloadString = objectMapper.writeValueAsString(payload);
            producer.send(payloadString);
        } catch (Exception e) {
            throw new RuntimeException("Failed to queue design job: " + e.getMessage(), e);
        }
    }
}
