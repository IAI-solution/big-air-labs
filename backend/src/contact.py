from fastapi import APIRouter, HTTPException, status
from typing import List
from src.db.models import ContactFormSubmission
from src.db.schemas import ContactFormCreate, ContactFormResponse

router = APIRouter(tags=["contact"])


@router.post("/contact", response_model=ContactFormResponse, status_code=status.HTTP_201_CREATED)
async def create_contact_submission(contact_data: ContactFormCreate):
    """Submit contact form"""
    try:
        submission = ContactFormSubmission(**contact_data.model_dump())
        await submission.save()
        
        return ContactFormResponse(
            id=str(submission.id),
            name=submission.name,
            email=submission.email,
            phone=submission.phone,
            how_did_you_hear=submission.how_did_you_hear,
            message=submission.message,
            created_at=submission.created_at
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to submit contact form"
        )


@router.get("/all_contacts", response_model=List[ContactFormResponse])
async def get_contact_submissions():
    """Get all contact submissions"""
    try:
        submissions = await ContactFormSubmission.find_all().to_list()
        return [
            ContactFormResponse(
                id=str(submission.id),
                name=submission.name,
                email=submission.email,
                phone=submission.phone,
                how_did_you_hear=submission.how_did_you_hear,
                message=submission.message,
                created_at=submission.created_at
            )
            for submission in submissions
        ]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve submissions"
        )