from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    # App
    APP_NAME: str = "DocuMind"
    APP_VERSION: str = "0.1.0"
    DEBUG: bool = True

    # API
    API_PREFIX: str = "/api/v1"

    # Gemini
    GEMINI_API_KEY: Optional[str] = None

    # File Upload
    MAX_FILE_SIZE_MB: int = 100
    UPLOAD_DIR: str = "uploads"
    OUTPUT_DIR: str = "outputs"

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True)


settings = Settings()
