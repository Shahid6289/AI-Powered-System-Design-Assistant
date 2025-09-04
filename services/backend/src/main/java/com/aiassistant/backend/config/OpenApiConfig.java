package com.aiassistant.backend.config;

import io.swagger.v3.oas.models.ExternalDocumentation;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.OpenAPI;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {
    @Bean
    public OpenAPI springOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("AI System Design Assistant API")
                        .description("Backend REST API")
                        .version("v1"))
                .externalDocs(new ExternalDocumentation().description("Project Docs").url("https://example.com"));
    }
}
