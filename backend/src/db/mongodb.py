from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from src.db.models import ContactFormSubmission
import os


async def init_db():
    """Initialize database connection"""
    mongodb_url = os.getenv("MONGO_URI", "mongodb://localhost:27017")
    database_name = os.getenv("DATABASE_NAME", "bigair_db")
    
    client = AsyncIOMotorClient(mongodb_url)
    
    await init_beanie(
        database=client[database_name],
        document_models=[ContactFormSubmission]
    )
    
    print(f"Connected to MongoDB: {database_name}")