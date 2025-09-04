package com.aiassistant.backend.dto.design;

import lombok.Builder;
import lombok.Data;
import java.util.Map;

@Data
@Builder
public class DesignResponseDTO {
    private Long id;
    private String prompt;
    private Map<String, Object> rawOutput; // Changed to Map<String, Object> for clarity
    private String mermaidCode;
}