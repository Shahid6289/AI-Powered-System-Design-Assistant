package com.aiassistant.backend.dto.design;

import lombok.Data;

import java.util.List;

@Data
public class ServiceDTO {
    private String name;
    private List<String> responsibilities; // Changed to List<String>
    private List<String> techSuggestions;  // Changed to List<String>
    private List<String> events;
}