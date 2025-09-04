package com.aiassistant.backend.dto.design;

import lombok.Data;

@Data
public class DiagramDTO {
    private String type;    // mermaid/plantuml
    private String content; // diagram text
}
