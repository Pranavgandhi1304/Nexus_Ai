import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./nexus.db")
    
    # AI Providers
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    GOOGLE_API_KEY: str = os.getenv("GOOGLE_API_KEY", "")
    AI_PROVIDER: str = os.getenv("AI_PROVIDER", "mock")  # "openai", "google", "mock"
    AI_MODEL: str = os.getenv("AI_MODEL", "gpt-4o-mini")
    
    # Auth
    SECRET_KEY: str = os.getenv("SECRET_KEY", "nexus-ai-super-secret-key-change-in-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Demo Mode
    DEMO_MODE: bool = os.getenv("DEMO_MODE", "true").lower() == "true"
    
    # CORS
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:3000")

    @property
    def has_ai_provider(self) -> bool:
        if self.AI_PROVIDER == "openai" and self.OPENAI_API_KEY:
            return True
        if self.AI_PROVIDER == "google" and self.GOOGLE_API_KEY:
            return True
        return False


settings = Settings()
