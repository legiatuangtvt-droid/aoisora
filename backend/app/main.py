from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.config import settings

# Import API routers
from .api.v1 import auth, staff, tasks, shifts, notifications

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
