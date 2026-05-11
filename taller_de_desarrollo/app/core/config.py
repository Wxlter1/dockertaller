from pydantic import PostgresDsn, field_validator
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "Taller de Desarrollo"
    VERSION: str = "0.1.0"
    DESCRIPTION: str = "API REST para la propuesta de título con arquitectura limpia y documentación automática."
    DATABASE_URL: str = "sqlite:///./app.db"
    SERVER_HOST: str = "0.0.0.0"
    SERVER_PORT: int = 8000

    @field_validator("DATABASE_URL", mode="before")
    @classmethod
    def default_db_url(cls, v: str) -> str:
        return v or "sqlite:///./app.db"

    class Config:
        case_sensitive = True
        env_file = ".env"


settings = Settings()
