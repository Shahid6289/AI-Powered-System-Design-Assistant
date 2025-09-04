from typing import Dict, Any, List

def build_mermaid_from_design(design: Dict[str, Any]) -> str:
    services: List[Dict[str, Any]] = design.get("services", [])
    provided_services: List[str] = design.get("provided_services", [])  # NEW: From request
    if not services and not provided_services:
        return "flowchart LR\n  A[User] --> B[API]\n"
    
    nodes = ["U[User]", "F[Frontend]", "G[API Gateway]"]
    edges = ["U --> F", "F --> G"]
    
    # Use provided services if available, else generated ones
    service_names = provided_services or [svc.get("name", f"service-{i+1}") for i, svc in enumerate(services)]
    for idx, name in enumerate(service_names, start=1):
        node_id = f"S{idx}"
        nodes.append(f'{node_id}[{name}]')
        edges.append(f'G --> {node_id}')
    
    dbs = design.get("databases", [])
    if dbs:
        nodes.append('D[(Database)]')
        if service_names:
            edges.append(f'S{len(service_names)} --> D')
    
    return f"flowchart LR\n  {'\n  '.join(nodes)}\n  {'\n  '.join(edges)}\n"
