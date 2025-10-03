import json
from typing import List
from fastapi import HTTPException
from src.db.azure_storage import upload_to_azure
from src.db.models import BlogSection


async def parse_blog_sections(form_data) -> List[BlogSection]:
    """Parse sections from JSON string and section_images files"""
    sections = []
    sections_json = form_data.get('sections')
    if not sections_json:
        print("No sections data provided")
        return sections
    
    try:
        sections_data = json.loads(sections_json)
        if not isinstance(sections_data, list):
            raise ValueError("Sections must be an array")
    except (json.JSONDecodeError, ValueError) as e:
        raise HTTPException(status_code=400, detail=f"Invalid sections JSON: {str(e)}")
    section_images = form_data.getlist('section_images')
    for i, section_data in enumerate(sections_data):
        
        if "heading" not in section_data or "paragraph" not in section_data:
            raise HTTPException(
                status_code=400,
                detail=f"Section {i} missing required fields (heading, paragraph)"
            )
        
        heading = section_data["heading"]
        paragraph = section_data["paragraph"]

        section_image_urls = []
        if i < len(section_images):
            img_file = section_images[i]
            if (hasattr(img_file, 'filename') and 
                img_file.filename and 
                img_file.filename.strip() != "" and 
                hasattr(img_file, 'size') and img_file.size > 0):
                img_url = await upload_to_azure(img_file)
                section_image_urls.append(img_url)
            else:
                print(f"No valid image for section {i}")
        else:
            print(f"No image file provided for section {i}")
        # section_images_key = f'section_{i}_images'
        # section_images = form_data.getlist(section_images_key)
        # for img_file in section_images:
        #     if (hasattr(img_file, 'filename') and 
        #         img_file.filename and 
        #         img_file.filename.strip() != "" and 
        #         hasattr(img_file, 'size') and img_file.size > 0):
        #         img_url = await upload_to_azure(img_file)
        #         section_image_urls.append(img_url)
        #     else:
        #         print(f"No valid image for section {i}")
        # if len(section_images) == 0:
        #     print(f"No image files provided for section {i}")

        section = BlogSection(
            subheading=heading,
            image=section_image_urls,
            description=paragraph
        )

        sections.append(section)
    
    return sections