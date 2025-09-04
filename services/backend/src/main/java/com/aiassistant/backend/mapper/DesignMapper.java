package com.aiassistant.backend.mapper;

import com.aiassistant.backend.dto.design.DesignResponseDTO;
import com.aiassistant.backend.model.Design;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class DesignMapper {

    private final ObjectMapper objectMapper;

    public DesignMapper(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public DesignResponseDTO toDTO(Design d) {
        Map<String, Object> rawOutput;
        try {
            rawOutput = objectMapper.readValue(d.getRawOutput(), Map.class);
        } catch (JsonProcessingException e) {
            rawOutput = Map.of("error", "Failed to parse rawOutput: " + e.getMessage());
        }

        return DesignResponseDTO.builder()
                .id(d.getId())
                .prompt(d.getPrompt())
                .rawOutput(rawOutput)
                .mermaidCode(d.getMermaidCode())
                .build();
    }
}