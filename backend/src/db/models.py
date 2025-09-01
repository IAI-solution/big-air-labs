from datetime import datetime
from beanie import Document
from pydantic import EmailStr, Field


class ContactFormSubmission(Document):
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    phone: str = Field(..., min_length=1, max_length=20)
    how_did_you_hear: str = Field(..., min_length=1, max_length=100)
    message: str = Field(..., min_length=1, max_length=2000)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        collection = "contact_submissions"