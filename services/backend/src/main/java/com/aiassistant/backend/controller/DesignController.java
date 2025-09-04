package com.aiassistant.backend.controller;

import com.aiassistant.backend.dto.design.CreateDesignRequestDTO;
import com.aiassistant.backend.dto.design.DesignResponseDTO;
import com.aiassistant.backend.service.DesignService;
import com.fasterxml.jackson.core.JsonProcessingException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/designs")
@RequiredArgsConstructor
public class DesignController {

    private final DesignService designService;

    @PostMapping
    public ResponseEntity<DesignResponseDTO> create(@Valid @RequestBody CreateDesignRequestDTO req,
                                                    @AuthenticationPrincipal org.springframework.security.core.userdetails.User principal) throws JsonProcessingException {
        return ResponseEntity.ok(designService.createDesign(req, principal.getUsername()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DesignResponseDTO> get(@PathVariable Long id,
                                                 @AuthenticationPrincipal org.springframework.security.core.userdetails.User principal) {
        return ResponseEntity.ok(designService.getDesign(id, principal.getUsername()));
    }

    @GetMapping
    public ResponseEntity<List<DesignResponseDTO>> list(@AuthenticationPrincipal org.springframework.security.core.userdetails.User principal) {
        return ResponseEntity.ok(designService.listDesigns(principal.getUsername()));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<DesignResponseDTO>> getDesignsByUser(@PathVariable Long userId){
        List<DesignResponseDTO> designs = designService.getDesignsByUser(userId);
        return ResponseEntity.ok(designs);
    }
}
