from pydantic_settings import BaseSettings
from typing import List, Union
from pydantic import field_validator


class Settings(BaseSettings):
    # Application
    APP_NAME: str = "OptiChain API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    API_PREFIX: str = "/api/v1"

    # Database
    DATABASE_URL: str

    @field_validator('DATABASE_URL', mode='before')
    @classmethod
    def clean_database_url(cls, v):
        """Clean DATABASE_URL - remove accidental prefixes like 'psql '"""
        if isinstance(v, str):
            v = v.strip()
            # Remove accidental 'psql ' prefix if present
            if v.startswith("psql "):
                v = v[5:].strip()
            # Remove surrounding quotes if present
            if (v.startswith("'") and v.endswith("'")) or (v.startswith('"') and v.endswith('"')):
                v = v[1:-1]
        return v

    # Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # CORS - Can be string (comma-separated) or list
    ALLOWED_ORIGINS: Union[str, List[str]] = ["http://localhost:3000", "http://localhost:5173"]

    @field_validator('ALLOWED_ORIGINS', mode='before')
    @classmethod
    def parse_origins(cls, v):
        """Parse ALLOWED_ORIGINS from string or list"""
        if isinstance(v, str):
            # Handle comma-separated string
            if ',' in v:
                return [origin.strip() for origin in v.split(',')]
            # Handle single origin or wildcard
            return [v.strip()]
        return v

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
