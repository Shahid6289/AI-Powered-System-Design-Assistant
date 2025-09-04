package com.aiassistant.backend.util;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class JsonValidator {
    private final ObjectMapper objectMapper;

    public void validateDesign(String json) {
        try {
            JsonNode node = objectMapper.readTree(json);
            if (!node.has("services") || !node.has("databases") || !node.has("apis") || !node.has("diagrams") || !node.has("notes")) {
                throw new IllegalArgumentException("Missing required fields in AI response");
            }
            JsonNode diagrams = node.get("diagrams");
            if (diagrams.isArray() && diagrams.size() > 0) {
                JsonNode firstDiagram = diagrams.get(0);
                if (!firstDiagram.has("type") || !firstDiagram.has("content")) {
                    throw new IllegalArgumentException("Invalid diagram format");
                }
            }
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid JSON format: " + e.getMessage());
        }
    }
}