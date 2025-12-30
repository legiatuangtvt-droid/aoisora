from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from .core.config import settings
from .core.properties import reload_properties, get_properties

# Import API routers
from .api.v1 import auth, staff, tasks, shifts, notifications, manual

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    debug=settings.DEBUG,
    docs_url=f"{settings.API_PREFIX}/docs",
    redoc_url=f"{settings.API_PREFIX}/redoc",
    openapi_url=f"{settings.API_PREFIX}/openapi.json",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {
        "message": f"Welcome to {settings.APP_NAME}",
        "version": settings.APP_VERSION,
        "status": "running"
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


@app.get("/config")
async def get_config():
    """Get current configuration (non-sensitive values only)"""
    return {
        "app_name": settings.APP_NAME,
        "app_version": settings.APP_VERSION,
        "debug": settings.DEBUG,
        "upload_max_file_size_mb": settings.UPLOAD_MAX_FILE_SIZE_MB,
        "google_drive_enabled": settings.GOOGLE_DRIVE_ENABLED,
        "cache_enabled": settings.CACHE_ENABLED,
    }


@app.post("/config/reload")
async def reload_config():
    """Reload configuration from application.properties"""
    reload_properties()
    return {"message": "Configuration reloaded. Restart server for full effect."}


# Create uploads directory if not exists
uploads_path = Path(settings.UPLOAD_LOCAL_STORAGE_PATH)
uploads_path.mkdir(parents=True, exist_ok=True)

# Mount static files for uploads
app.mount("/uploads", StaticFiles(directory=str(uploads_path)), name="uploads")


# ============================================
# API v1 Routers
# ============================================

# Auth routes (login, logout, me)
app.include_router(
    auth.router,
    prefix=f"{settings.API_PREFIX}/auth",
    tags=["Authentication"]
)

# Staff management routes
app.include_router(
    staff.router,
    prefix=f"{settings.API_PREFIX}/staff",
    tags=["Staff Management"]
)

# Task routes (WS - Work Schedule)
app.include_router(
    tasks.router,
    prefix=f"{settings.API_PREFIX}/tasks",
    tags=["Tasks (WS)"]
)

# Shift routes (DWS - Dispatch Work Schedule)
app.include_router(
    shifts.router,
    prefix=f"{settings.API_PREFIX}/shifts",
    tags=["Shifts (DWS)"]
)

# Notification routes
app.include_router(
    notifications.router,
    prefix=f"{settings.API_PREFIX}/notifications",
    tags=["Notifications"]
)

# Manual/Knowledge Base routes
app.include_router(
    manual.router,
    prefix=f"{settings.API_PREFIX}",
    tags=["Manual"]
)
