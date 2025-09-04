from pydantic import BaseModel
from typing import List, Optional

class DesignRequest(BaseModel):
    prompt: str
    style: Optional[str] = None
    complexity: Optional[str] = None
    services: Optional[List[str]] = None 
    # diagram_type: str | None = None 