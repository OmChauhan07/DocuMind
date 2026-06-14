from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

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
