package com.aiassistant.backend.dto.design;

import lombok.Data;

@Data
public class DatabaseDTO {
    private String name;
    private String type; // postgres/mongo
    private String schemaDDL;
}
