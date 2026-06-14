from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os
from app.core.config import settings
from app.api.routes.health import router as health_router
from app.api.routes.auth import router as auth_router
from app.api.routes.projects import router as projects_router
from app.api.routes.files import router as files_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    os.makedirs(settings.OUTPUT_DIR, exist_ok=True)
    yield
    # Shutdown logic (if any)

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    debug=settings.DEBUG,
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(
    health_router,
    prefix=settings.API_PREFIX,
    tags=["Health"]
)

app.include_router(
    auth_router,
    prefix=f"{settings.API_PREFIX}/auth",
    tags=["Authentication"]
)

app.include_router(
    projects_router,
    prefix=f"{settings.API_PREFIX}/projects",
    tags=["Projects"]
)

app.include_router(
    files_router,
    prefix=f"{settings.API_PREFIX}/files",
    tags=["Files"]
)


@app.get("/")
async def root():
    return {
        "message": "Welcome to DocuMind API",
        "docs": "/docs",
        "health": f"{settings.API_PREFIX}/health"
    }