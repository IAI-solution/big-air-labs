from datetime import datetime
from pydantic import BaseModel, EmailStr, Field


class ContactFormCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    phone: str = Field(..., min_length=1, max_length=20)
    how_did_you_hear: str = Field(..., min_length=1, max_length=100)
    message: str = Field(..., min_length=1, max_length=2000)


class ContactFormResponse(BaseModel):
    id: str
    name: str
    email: EmailStr
    phone: str
    how_did_you_hear: str
    message: str
    created_at: datetime

    class Config:
        from_attributes = True