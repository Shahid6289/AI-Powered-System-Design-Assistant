import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Settings:
    MODEL_BACKEND: str = os.getenv("MODEL_BACKEND", "template").lower()
    MODEL_NAME: str = os.getenv("MODEL_NAME", "distilgpt2")
    USE_GPU: bool = os.getenv("USE_GPU", "false").lower() == "true"
    OPENAI_API_KEY: str | None = os.getenv("OPENAI_API_KEY")
    HF_TOKEN: str | None = os.getenv("HF_TOKEN")
    GROQ_API_KEY: str | None = os.getenv("GROQ_API_KEY")

    def __post_init__(self):
        if self.MODEL_BACKEND == "groq" and not self.GROQ_API_KEY:
            raise ValueError("GROQ_API_KEY is required when MODEL_BACKEND is set to 'groq'")
        elif self.MODEL_BACKEND == "openai" and not self.OPENAI_API_KEY:
            raise ValueError("OPENAI API KEY is required when MODEL_BACKEND is set to 'openai")

settings = Settings()   