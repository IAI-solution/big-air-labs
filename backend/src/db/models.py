from datetime import datetime
from typing import List, Optional
from beanie import Document
from pydantic import BaseModel, EmailStr, Field


class ContactFormSubmission(Document):
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    phone: str = Field(..., min_length=1, max_length=20)
    how_did_you_hear: str = Field(..., min_length=1, max_length=100)
    message: str = Field(..., min_length=1, max_length=2000)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        collection = "contact_submissions"

class contactEmail(Document):
    email: EmailStr
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        collection = "contact_emails"

class Source(BaseModel):
    label: str
    url: str

class BlogSection(BaseModel):
    subheading: str
    image: Optional[str] = None
    description: str
    
class Blog(Document):
    title: str
    description: str
    category: str
    hero_image: str
    sections: List[BlogSection] = []
    sources: Optional[List[Source]] = None
    created_at: datetime = Field(default_factory=datetime.now)
    
    class Settings:
        name = "blogs"
