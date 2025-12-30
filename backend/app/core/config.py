from pydantic_settings import BaseSettings
from typing import List, Union
from pydantic import field_validator
from .properties import get_properties


# Load properties
props = get_properties()


class Settings(BaseSettings):
    # Application - from properties with env override
    APP_NAME: str = props.get_str("app.name", "OptiChain API")
    APP_VERSION: str = props.get_str("app.version", "1.0.0")
    DEBUG: bool = props.get_bool("app.debug", True)
    API_PREFIX: str = props.get_str("app.api_prefix", "/api/v1")

    # Database - from properties with env override
    DATABASE_URL: str = props.get_str("database.url", "")
    DATABASE_POOL_SIZE: int = props.get_int("database.pool_size", 10)
    DATABASE_MAX_OVERFLOW: int = props.get_int("database.max_overflow", 20)

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

    # Security - from properties with env override
    SECRET_KEY: str = props.get_str("security.secret_key", "")
    ALGORITHM: str = props.get_str("security.algorithm", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = props.get_int("security.access_token_expire_minutes", 30)

    # CORS - from properties with env override
    ALLOWED_ORIGINS: Union[str, List[str]] = props.get_list("cors.allowed_origins", default=["http://localhost:3000", "http://localhost:5173"])

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

    # Upload Settings - from properties
    UPLOAD_MAX_FILE_SIZE_MB: int = props.get_int("upload.max_file_size_mb", 50)
    UPLOAD_ALLOWED_IMAGE_TYPES: List[str] = props.get_list("upload.allowed_image_types", default=["image/jpeg", "image/png", "image/gif", "image/webp"])
    UPLOAD_ALLOWED_VIDEO_TYPES: List[str] = props.get_list("upload.allowed_video_types", default=["video/mp4", "video/webm", "video/quicktime"])
    UPLOAD_LOCAL_STORAGE_PATH: str = props.get_str("upload.local_storage_path", "./uploads")

    # Google Drive Settings - from properties
    GOOGLE_DRIVE_ENABLED: bool = props.get_bool("google_drive.enabled", False)
    GOOGLE_DRIVE_FOLDER_ID: str = props.get_str("google_drive.folder_id", "")
    GOOGLE_DRIVE_CREDENTIALS_FILE: str = props.get_str("google_drive.credentials_file", "credentials.json")
    GOOGLE_DRIVE_TOKEN_FILE: str = props.get_str("google_drive.token_file", "token.json")
    GOOGLE_DRIVE_SHARE_MODE: str = props.get_str("google_drive.share_mode", "public")

    # Manual Settings - from properties
    MANUAL_DEFAULT_THUMBNAIL_WIDTH: int = props.get_int("manual.default_thumbnail_width", 400)
    MANUAL_DEFAULT_THUMBNAIL_HEIGHT: int = props.get_int("manual.default_thumbnail_height", 300)
    MANUAL_MAX_STEPS_PER_DOCUMENT: int = props.get_int("manual.max_steps_per_document", 100)
    MANUAL_ENABLE_VIDEO_PROCESSING: bool = props.get_bool("manual.enable_video_processing", True)

    # Notification Settings
    NOTIFICATION_ENABLED: bool = props.get_bool("notification.enabled", True)
    NOTIFICATION_RETENTION_DAYS: int = props.get_int("notification.retention_days", 30)

    # Logging Settings
    LOGGING_LEVEL: str = props.get_str("logging.level", "INFO")
    LOGGING_FILE: str = props.get_str("logging.file", "logs/app.log")

    # Cache Settings
    CACHE_ENABLED: bool = props.get_bool("cache.enabled", False)
    CACHE_TYPE: str = props.get_str("cache.type", "memory")
    CACHE_TTL_SECONDS: int = props.get_int("cache.ttl_seconds", 300)

    # Performance Settings
    REQUEST_TIMEOUT_SECONDS: int = props.get_int("performance.request_timeout_seconds", 30)
    MAX_CONCURRENT_REQUESTS: int = props.get_int("performance.max_concurrent_requests", 100)

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
