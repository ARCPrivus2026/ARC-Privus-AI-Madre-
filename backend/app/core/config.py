"""
Core configuration module for ARC Privus AI Madre
Handles all application settings and environment variables
"""
from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables
    All sensitive data should be stored in environment variables
    """
    
    # Project metadata
    PROJECT_NAME: str = "ARC Privus AI Madre"
    PROJECT_DESCRIPTION: str = "Plataforma central de inteligencia artificial matriz - autónoma, escalable y ética"
    VERSION: str = "1.0.0"
    
    # Environment
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    # API Configuration
    API_V1_PREFIX: str = "/api/v1"
    
    # CORS
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:8000",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:8000"
    ]
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "CHANGE_THIS_IN_PRODUCTION_USE_STRONG_SECRET")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    ALGORITHM: str = "HS256"
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./arc_privus.db")
    
    # AI Module Configuration
    AI_MODEL_PATH: str = os.getenv("AI_MODEL_PATH", "./models")
    MAX_CONCURRENT_AI_REQUESTS: int = 10
    
    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FILE: str = "logs/arc_privus.log"
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 60
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Create global settings instance
settings = Settings()
