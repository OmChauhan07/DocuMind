from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional, List

class Settings(BaseSettings):
    # App
    APP_NAME: str = "DocuMind"
    APP_VERSION: str = "0.1.0"
    DEBUG: bool = True

    # API
    API_PREFIX: str = "/api/v1"

    # Security
    SECRET_KEY: str = "supersecretkey-please-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:3000"]

    # Database
    DATABASE_URL: str = "sqlite:///./documind.db" # Default to sqlite for local dev

    # Gemini
    GEMINI_API_KEY: Optional[str] = None

    # File Upload
    MAX_FILE_SIZE_MB: int = 100
    UPLOAD_DIR: str = "uploads"
    OUTPUT_DIR: str = "outputs"

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True)


settings = Settings()

if not settings.DEBUG and settings.SECRET_KEY == "supersecretkey-please-change-in-production":
    print("WARNING: Using the default SECRET_KEY in a non-debug environment is a critical security vulnerability!")
