from motor.motor_asyncio import AsyncIOMotorClient
from beanie import PydanticObjectId, init_beanie
from src.db.models import ContactFormSubmission, contactEmail
import os
from src.db.models import Blog


async def init_db():
    """Initialize database connection"""
    mongodb_url = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    database_name = os.getenv("DATABASE_NAME", "bigair_db")
    
    client = AsyncIOMotorClient(mongodb_url)
    
    await init_beanie(
        database=client[database_name],
        document_models=[ContactFormSubmission, contactEmail, Blog]
    )
    
    print(f"Connected to MongoDB")


async def save_blog(blog: Blog) -> Blog:
    await blog.insert()
    return blog


async def delete_blog(blog_id: PydanticObjectId) -> bool:
    blog = await Blog.get(blog_id)
    if not blog:
        return False
    await blog.delete()
    return True