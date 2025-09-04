package com.aiassistant.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "design_requests")
@Getter @Setter
public class DesignRequest {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "text")
    private String prompt;

    private String status; // QUEUED/RUNNING/COMPLETED/FAILED

    private Instant createdAt;
    private Instant completedAt;
}
