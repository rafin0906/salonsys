import os
import logging
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

load_dotenv()

logger = logging.getLogger("saloon_api")

DATABASE_URL = os.getenv("DATABASE_URL", "")

# If DATABASE_URL is not provided or contains placeholder [YOUR-PASSWORD],
# fall back to local SQLite so the server starts without crashing.
if not DATABASE_URL or "[YOUR-PASSWORD]" in DATABASE_URL:
    logger.warning(
        "DATABASE_URL contains placeholder '[YOUR-PASSWORD]'. "
        "Falling back to local SQLite database 'sqlite:///./saloon.db'. "
        "Update backend/.env with your real Supabase password to connect to remote Postgres."
    )
    DATABASE_URL = "sqlite:///./saloon.db"
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
else:
    # Ensure correct driver format for psycopg 3
    if DATABASE_URL.startswith("postgresql://"):
        DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+psycopg://", 1)
    
    try:
        engine = create_engine(DATABASE_URL, pool_pre_ping=True)
    except Exception as e:
        logger.error(f"Failed to connect to Supabase: {e}. Falling back to SQLite.")
        DATABASE_URL = "sqlite:///./saloon.db"
        engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
