from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import design_routes, auth_routes
from app.exceptions.handlers import register_exception_handlers

app = FastAPI(
    title="AI-Powered System Design Assistant - AI Service",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

# Routers
app.include_router(design_routes.router, prefix="/api/v1/ai", tags=["AI-Design"])
app.include_router(auth_routes.router, prefix="/api/v1/auth", tags=["Auth"])

# Errors
register_exception_handlers(app)

@app.get("/")
def root():
    return {"status": "ok", "service": "ai-service"}