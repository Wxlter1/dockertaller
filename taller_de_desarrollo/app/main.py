from pathlib import Path

from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from app.api.v1.api import api_router
from app.core.config import settings
from app.db.base import Base
from app.db.session import engine


def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.PROJECT_NAME,
        version=settings.VERSION,
        description=settings.DESCRIPTION,
        contact={"name": "Equipo de Proyecto", "email": "soporte@ejemplo.com"},
    )

    app.mount(
        "/static",
        StaticFiles(directory=Path(__file__).resolve().parent / "static"),
        name="static",
    )
    app.include_router(api_router, prefix="/api/v1")

    @app.on_event("startup")
    def on_startup() -> None:
        Base.metadata.create_all(bind=engine)

    @app.get("/", include_in_schema=False)
    def root() -> FileResponse:
        return FileResponse(Path(__file__).resolve().parent / "static" / "index.html")

    @app.get("/health", tags=["health"])
    def health_check() -> dict:
        return {"status": "ok", "app": settings.PROJECT_NAME}

    return app


app = create_app()
