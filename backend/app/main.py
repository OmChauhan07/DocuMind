from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routes.health import router as health_router
from app.api.routes.auth import router as auth_router

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    debug=settings.DEBUG
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


@app.get("/")
async def root():
    return {
        "message": "Welcome to DocuMind API",
        "docs": "/docs",
        "health": f"{settings.API_PREFIX}/health"
    }