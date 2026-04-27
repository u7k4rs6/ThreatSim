import os
from dataclasses import dataclass


@dataclass(frozen=True)
class Settings:
    gemini_api_key: str | None
    gemini_model: str
    nvd_api_key: str | None
    mission_dir: str
    supabase_url: str | None
    supabase_service_role_key: str | None
    supabase_jwt_secret: str | None


def load_settings() -> Settings:
    return Settings(
        gemini_api_key=os.environ.get("GEMINI_API_KEY") or None,
        gemini_model=os.environ.get("GEMINI_MODEL", "gemini-2.0-flash"),
        nvd_api_key=os.environ.get("NVD_API_KEY") or None,
        mission_dir="/mission",
        supabase_url=os.environ.get("SUPABASE_URL") or None,
        supabase_service_role_key=os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
        or None,
        supabase_jwt_secret=os.environ.get("SUPABASE_JWT_SECRET") or None,
    )
