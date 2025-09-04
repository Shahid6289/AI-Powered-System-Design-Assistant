package com.aiassistant.backend.client;

import com.aiassistant.backend.dto.design.CreateDesignRequestDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Map;

@FeignClient(name = "ai-service", url = "${app.ai.baseUrl}")
public interface AIServiceClient {
    @PostMapping(value = "/api/v1/ai/generate", produces = "application/json")
    Map<String, Object> generateDesign(@RequestBody CreateDesignRequestDTO req);
}