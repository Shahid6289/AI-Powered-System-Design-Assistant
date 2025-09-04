package com.aiassistant.backend.dto.design;

import lombok.Data;

import java.util.Map;

@Data
public class ApiDTO {
    private String service;
    private String path;
    private String method;
    private Map<String, Object> requestSchema;
    private Map<String, Object> responseSchema;
}