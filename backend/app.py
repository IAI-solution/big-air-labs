from contextlib import asynccontextmanager
from datetime import datetime
import json
from typing import List, Optional
from fastapi import FastAPI, File, Form, HTTPException, Query, Request, Response, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from pydantic import BaseModel, Field, HttpUrl
from utils import parse_blog_sections
from src.db.azure_storage import upload_to_azure
from src.db.models import Blog, BlogSection, Source
from src.db.mongodb import delete_blog, init_db, save_blog
from src.contact import router as contact_router

load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield


app = FastAPI(
    title="Big air labs Fast_API",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include contact router
app.include_router(contact_router)

@app.get("/")
async def root():
    return {"message": "FastAPI is running. Visit /docs for API documentation."}

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "Backend is running"}


@app.post("/blogs")
async def create_blog(
    request: Request,
    title: str = Form(...),
    description: str = Form(...),
    category: str = Form(...),
    hero_image: UploadFile = File(...),
    sources: Optional[str] = Form(None), 
):
    try:
        hero_image_url = await upload_to_azure(hero_image)

        parsed_sources = None
        if sources:
            try:
                sources_data = json.loads(sources)
                parsed_sources = []
                for source in sources_data:
                    parsed_sources.append(Source(
                        label=source.get("title", ""),
                        url=source.get("url", "")
                    ))
            except json.JSONDecodeError:
                raise HTTPException(status_code=400, detail="Invalid sources format")
        
        form_data = await request.form()
        sections = await parse_blog_sections(form_data)
        
        blog_data = {
            "title": title,
            "description": description,
            "category": category,
            "hero_image": hero_image_url,
            "sections": sections,
            "sources": parsed_sources
        }
        
        blog = Blog(**blog_data)
        saved_blog = await save_blog(blog)
        
        return {
            "status": "success",
            "message": "Blog created successfully", 
            "data": saved_blog
        }
        
    except HTTPException:
        raise
    except Exception as error:
        print(f"Error creating blog: {error}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(error)}")
    

PAGE_SIZE: int = 6
@app.get("/blogs")
async def get_blogs(
    response: Response,
    page: int = Query(1, ge=1, description="Page number (starts from 1)"),
    limit: int = Query(PAGE_SIZE, ge=1, le=50, description="Number of blogs per page"),
    category: str = Query(None, description="Filter by category")
):
    """
    Get blogs with pagination and optional category filtering
    
    - **page**: Page number (default: 1)
    - **limit**: Number of blogs per page (default: 6, max: 50)
    - **category**: Optional category filter
    """
    try:
        query = Blog.find() if not category else Blog.find(Blog.category == category)
        
        total = await query.count()
        
        total_pages = max((total + limit - 1) // limit, 1)
        page = min(page, total_pages)
        
        skip = (page - 1) * limit
    
        blogs = await query.sort(-Blog.created_at).skip(skip).limit(limit).to_list()
        
        response.headers["X-Total-Count"] = str(total)
        response.headers["X-Total-Pages"] = str(total_pages)
        response.headers["X-Current-Page"] = str(page)
        response.headers["X-Category"] = category or "all"
        
        return {
            "status": "success",
            "data": {
                "blogs": [blog.dict() for blog in blogs],
                "pagination": {
                    "current_page": page,
                    "total_pages": total_pages,
                    "total_count": total,
                    "limit": limit,
                    "has_next": page < total_pages,
                    "has_prev": page > 1
                },
                "filters": {
                    "category": category
                }
            }
        }
        
    except Exception as error:
        print(f"Error fetching blogs: {error}")
        raise HTTPException(
            status_code=500, 
            detail=f"Internal Server Error: {str(error)}"
        )


@app.get("/blogs/{blog_id}", response_model=Blog)
async def get_blog(blog_id: str):
    blog = await Blog.get(blog_id)
    if not blog:
        raise HTTPException(status_code=404, detail="Blog not found")
    return blog


PAGE_SIZE: int = 6 
@app.get("/get_all_blogs", response_model=list[Blog])
async def list_blogs(
    response: Response,
    page: int = Query(1, ge=1),
    category: str = Query(None),
):
    query = Blog.find() if not category else Blog.find(Blog.category == category)
    total = await query.count()
    total_pages = max((total + PAGE_SIZE - 1) // PAGE_SIZE, 1)
    page = min(page, total_pages)

    skip = (page - 1) * PAGE_SIZE
    blogs = await query.sort(-Blog.created_at).skip(skip).limit(PAGE_SIZE).to_list()

    response.headers["X-Total-Count"] = str(total)
    response.headers["X-Total-Pages"] = str(total_pages)
    response.headers["X-Current-Page"] = str(page)
    return blogs


@app.delete("/blogs/{blog_id}")
async def remove_blog(blog_id: str):
    ok = await delete_blog(blog_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Blog not found")
    return {"message": "Blog deleted"}