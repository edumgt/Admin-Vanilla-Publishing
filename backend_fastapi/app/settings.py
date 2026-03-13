import json
import os
from dataclasses import dataclass


def _parse_bool(value: str | None, default: bool) -> bool:
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "yes", "on"}


def _parse_csv(value: str | None, default: list[str]) -> tuple[str, ...]:
    if not value:
        return tuple(default)
    items = [item.strip() for item in value.split(",")]
    return tuple(item for item in items if item)


def _parse_demo_users(value: str | None, app_env: str, enabled: bool) -> dict[str, str]:
    if not enabled:
        return {}
    if value:
        try:
            parsed = json.loads(value)
            if isinstance(parsed, dict):
                return {str(key): str(password) for key, password in parsed.items()}
        except json.JSONDecodeError:
            pass
    if app_env == "production":
        return {}
    return {
        "admin": "1111",
        "manager": "1111",
        "guest": "1111",
    }


@dataclass(frozen=True)
class Settings:
    app_env: str
    database_url: str
    cors_allow_origins: tuple[str, ...]
    jwt_secret_key: str
    access_token_ttl_minutes: int
    refresh_token_ttl_minutes: int
    demo_auth_enabled: bool
    demo_users: dict[str, str]


def load_settings() -> Settings:
    app_env = os.getenv("APP_ENV", "development").strip().lower()
    database_url = os.getenv(
        "DATABASE_URL",
        "postgresql+psycopg2://newhomepage:newhomepage@localhost:5432/newhomepage",
    )
    default_origins = [
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]
    cors_allow_origins = _parse_csv(os.getenv("CORS_ALLOW_ORIGINS"), default_origins)
    jwt_secret_key = os.getenv("JWT_SECRET_KEY", "newhomepage-dev-secret")
    access_token_ttl_minutes = int(os.getenv("ACCESS_TOKEN_TTL_MINUTES", "60"))
    refresh_token_ttl_minutes = int(os.getenv("REFRESH_TOKEN_TTL_MINUTES", str(60 * 24 * 7)))
    demo_auth_enabled = _parse_bool(
        os.getenv("DEMO_AUTH_ENABLED"),
        app_env != "production",
    )
    demo_users = _parse_demo_users(os.getenv("DEMO_USERS_JSON"), app_env, demo_auth_enabled)
    return Settings(
        app_env=app_env,
        database_url=database_url,
        cors_allow_origins=cors_allow_origins,
        jwt_secret_key=jwt_secret_key,
        access_token_ttl_minutes=access_token_ttl_minutes,
        refresh_token_ttl_minutes=refresh_token_ttl_minutes,
        demo_auth_enabled=demo_auth_enabled,
        demo_users=demo_users,
    )


settings = load_settings()
