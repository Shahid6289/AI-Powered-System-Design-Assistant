package com.aiassistant.backend.dto.design;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

@Data
public class CreateDesignRequestDTO {
    @NotBlank
    private String prompt;
    private String style;       // e.g., "microservices", "monolith"
    private String complexity;  // e.g., "basic", "advanced"
    private List<String> services;
}
