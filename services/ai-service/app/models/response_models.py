from typing import List, Dict, Any, Literal
from pydantic import BaseModel

class ServiceSpec(BaseModel):
    name: str
    responsibilities: List[str]
    techSuggestions: List[str] | str | None = None
    events: List[str] | None = None

class DatabaseSpec(BaseModel):
    name: str
    type: str
    schemaDDL: str

class ApiSpec(BaseModel):
    service: str
    path: str
    method: str
    requestSchema: Dict[str, Any] | str | None = None
    responseSchema: Dict[str, Any] | str | None = None

class DiagramSpec(BaseModel):
    type: Literal["mermaid"]
    content: str

class DesignSpec(BaseModel):
    services: List[ServiceSpec]
    databases: List[DatabaseSpec]
    apis: List[ApiSpec]
    diagrams: List[DiagramSpec]
    notes: str
