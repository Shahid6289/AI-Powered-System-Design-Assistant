# app/routes/design_routes.py
from fastapi import APIRouter, HTTPException
from app.models.request_models import DesignRequest
from app.services.llm_service import llm_service
from app.services.diagram_service import build_mermaid_from_design
import logging 

logging.basicConfig(level=logging.DEBUG)  
logger = logging.getLogger(__name__)  

router = APIRouter()

@router.post("/generate")
def generate_design(request: DesignRequest):
    try:
        logger.debug(f"Received request: {request}")  
        design = llm_service.generate_system_design(
            prompt=request.prompt,
            style=request.style,
            complexity=request.complexity,
            services=request.services,
            # diagram_type=request.diagram_type
        )
        design["provided_services"] = request.services or []
        if not design.get("diagrams"):
            mermaid = build_mermaid_from_design(design)
            design.setdefault("diagrams", []).append({"type": "mermaid", "content": mermaid})
        logger.debug(f"Generated design: {design}")  # NEW: Log response
        return design
    except Exception as e:
        logger.exception("Error generating design")  # NEW: Log full stack trace
        raise HTTPException(status_code=500, detail=str(e))