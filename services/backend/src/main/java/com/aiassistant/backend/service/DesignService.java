package com.aiassistant.backend.service;

import com.aiassistant.backend.client.AIServiceClient;
import com.aiassistant.backend.dto.design.CreateDesignRequestDTO;
import com.aiassistant.backend.dto.design.DesignResponseDTO;
import com.aiassistant.backend.mapper.DesignMapper;
import com.aiassistant.backend.model.Design;
import com.aiassistant.backend.model.User;
import com.aiassistant.backend.repository.DesignRepository;
import com.aiassistant.backend.repository.UserRepository;
import com.aiassistant.backend.util.JsonValidator;
import com.aiassistant.backend.util.MermaidGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DesignService {

    private static final Logger logger = LoggerFactory.getLogger(DesignService.class);

    private final DesignRepository designRepository;
    private final AIServiceClient aiClient;
    private final MermaidGenerator mermaidGenerator;
    private final ObjectMapper objectMapper;
    private final JsonValidator jsonValidator;
    private final UserRepository userRepository;
    private final AIOrchestrationService orchestrationService;

    @Transactional
    public DesignResponseDTO createDesign(CreateDesignRequestDTO req, String userEmail) throws JsonProcessingException {
        logger.debug("Creating design for request: {}, user: {}", req, userEmail);

        // Handle user lookup gracefully
        User user = userRepository.findByEmail(userEmail)
                .orElseGet(() -> {
                    try {
                        return userRepository.findById(Long.parseLong(userEmail))
                                .orElseThrow(() -> new RuntimeException("User not found for ID: " + userEmail));
                    } catch (NumberFormatException e) {
                        logger.error("Invalid user ID format: {}", userEmail);
                        throw new RuntimeException("Invalid user ID format: " + userEmail);
                    }
                });

        if (req.getComplexity() != null && req.getComplexity().equalsIgnoreCase("advanced")) {
            logger.info("Queuing advanced job for user: {}", userEmail);
            orchestrationService.queueJob(req, user);
            return DesignResponseDTO.builder()
                    .prompt(req.getPrompt())
                    .rawOutput(Map.of("status", "Job queued")) // Use Map for consistency
                    .build();
        }

        String aiResp = null; // Declare outside try block
        try {
            // Call AI service and parse response
            Map<String, Object> rawOutput = aiClient.generateDesign(req);
            aiResp = objectMapper.writeValueAsString(rawOutput); // Serialize for database
            logger.debug("AI response: {}", aiResp);

            // Validate JSON
            jsonValidator.validateDesign(aiResp);

            // Extract Mermaid diagram
            String mermaid = null;
            try {
                JsonNode jsonNode = objectMapper.readTree(aiResp);
                mermaid = jsonNode.path("diagrams").path(0).path("content").asText();
                if (mermaid.isEmpty()) {
                    logger.warn("No Mermaid diagram found in AI response, generating fallback");
                    mermaid = mermaidGenerator.generateOrValidateMermaid(null);
                } else {
                    mermaid = mermaidGenerator.generateOrValidateMermaid(mermaid);
                }
            } catch (Exception e) {
                logger.warn("Failed to extract Mermaid diagram, generating fallback: {}", e.getMessage());
                mermaid = mermaidGenerator.generateOrValidateMermaid(null);
            }

            // Create and save design
            Design d = new Design();
            d.setPrompt(req.getPrompt());
            d.setRawOutput(aiResp); // Store as string for database
            d.setMermaidCode(mermaid);
            d.setCreatedAt(Instant.now());
            d.setUser(user);

            Design saved = designRepository.save(d);
            return DesignResponseDTO.builder()
                    .id(saved.getId())
                    .prompt(saved.getPrompt())
                    .rawOutput(rawOutput) // Parsed JSON for frontend
                    .mermaidCode(saved.getMermaidCode())
                    .build();
        } catch (JsonProcessingException e) {
            logger.error("Failed to parse AI response: {}", aiResp != null ? aiResp : "null", e);
            throw new RuntimeException("Invalid AI response format: " + e.getMessage());
        } catch (Exception e) {
            logger.error("Error generating design: {}", aiResp != null ? aiResp : "null", e);
            throw new RuntimeException("Failed to generate design: " + e.getMessage());
        }
    }

    @Transactional(readOnly = true)
    public DesignResponseDTO getDesign(Long id, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Design d = designRepository.findById(id)
                .filter(design -> design.getUser().equals(user))
                .orElseThrow(() -> new RuntimeException("Design not found"));

        Map<String, Object> rawOutput;
        try {
            rawOutput = objectMapper.readValue(d.getRawOutput(), Map.class);
        } catch (JsonProcessingException e) {
            logger.error("Failed to parse rawOutput for design {}: {}", id, d.getRawOutput(), e);
            rawOutput = Map.of("error", "Failed to parse rawOutput: " + e.getMessage());
        }

        return DesignResponseDTO.builder()
                .id(d.getId())
                .prompt(d.getPrompt())
                .rawOutput(rawOutput)
                .mermaidCode(d.getMermaidCode())
                .build();
    }

    @Transactional(readOnly = true)
    public List<DesignResponseDTO> listDesigns(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return designRepository.findByUser(user)
                .stream()
                .map(d -> {
                    Map<String, Object> rawOutput;
                    try {
                        rawOutput = objectMapper.readValue(d.getRawOutput(), Map.class);
                    } catch (JsonProcessingException e) {
                        logger.error("Failed to parse rawOutput for design {}: {}", d.getId(), d.getRawOutput(), e);
                        rawOutput = Map.of("error", "Failed to parse rawOutput: " + e.getMessage());
                    }
                    return DesignResponseDTO.builder()
                            .id(d.getId())
                            .prompt(d.getPrompt())
                            .rawOutput(rawOutput)
                            .mermaidCode(d.getMermaidCode())
                            .build();
                })
                .toList();
    }

    @Transactional(readOnly = true)
    public List<DesignResponseDTO> getDesignsByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return designRepository.findByUser(user)
                .stream()
                .map(d -> {
                    Map<String, Object> rawOutput;
                    try {
                        rawOutput = objectMapper.readValue(d.getRawOutput(), Map.class);
                    } catch (JsonProcessingException e) {
                        logger.error("Failed to parse rawOutput for design {}: {}", d.getId(), d.getRawOutput(), e);
                        rawOutput = Map.of("error", "Failed to parse rawOutput: " + e.getMessage());
                    }
                    return DesignResponseDTO.builder()
                            .id(d.getId())
                            .prompt(d.getPrompt())
                            .rawOutput(rawOutput)
                            .mermaidCode(d.getMermaidCode())
                            .build();
                })
                .toList();
    }
}