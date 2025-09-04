package com.aiassistant.backend.util;

import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
public class MermaidGenerator {
    public String generateOrValidateMermaid(String mermaid) {
        if (mermaid == null || mermaid.trim().isEmpty() || !isValidMermaid(mermaid)) {
            return "flowchart LR\n  A[User] --> B[API Gateway]\n  B --> C[Service]\n";
        }
        return mermaid;
    }

    private boolean isValidMermaid(String mermaid) {
        return mermaid != null && mermaid.trim().startsWith("flowchart") || mermaid.trim().startsWith("sequenceDiagram") || mermaid.trim().startsWith("classDiagram");
    }

    // Optional: Generate Mermaid from rawOutput if needed
    public String generateMermaidFromRawOutput(Map<String, Object> rawOutput) {
        List<Map<String, Object>> services = (List<Map<String, Object>>) rawOutput.get("services");
        List<String> providedServices = (List<String>) rawOutput.getOrDefault("provided_services", List.of());
        if (services == null && providedServices.isEmpty()) {
            return "flowchart LR\n  A[User] --> B[API]\n";
        }

        StringBuilder nodes = new StringBuilder();
        StringBuilder edges = new StringBuilder();
        nodes.append("U[User]\nF[Frontend]\nG[API Gateway]\n");
        edges.append("U --> F\nF --> G\n");

        List<String> serviceNames = providedServices.isEmpty()
                ? services.stream().map(s -> (String) s.get("name")).toList()
                : providedServices;

        for (int i = 0; i < serviceNames.size(); i++) {
            String nodeId = "S" + (i + 1);
            nodes.append(nodeId).append("[").append(serviceNames.get(i)).append("]\n");
            edges.append("G --> ").append(nodeId).append("\n");
        }

        List<Map<String, Object>> dbs = (List<Map<String, Object>>) rawOutput.get("databases");
        if (dbs != null && !dbs.isEmpty()) {
            nodes.append("D[(Database)]\n");
            if (!serviceNames.isEmpty()) {
                edges.append("S").append(serviceNames.size()).append(" --> D\n");
            }
        }

        return "flowchart LR\n" + nodes + edges;
    }
}