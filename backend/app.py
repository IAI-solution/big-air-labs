from contextlib import asynccontextmanager
from datetime import datetime
from typing import List, Optional
from fastapi import FastAPI, File, HTTPException, Query, Response, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from pydantic import BaseModel, Field, HttpUrl
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
    allow_origins=["https://bigairlab.com", "https://www.bigairlab.com"],
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

class BlogCreateRequest(BaseModel):
    title: str
    description: str
    category: str
    hero_image: HttpUrl
    sections: Optional[List[BlogSection]] = []
    sources: Optional[List[Source]] = None

@app.post("/upload-image")
async def upload_image(file: UploadFile = File(...)):
    url = await upload_to_azure(file)
    return {"url": url}


@app.post("/blogs")
async def create_blog(blog_data: BlogCreateRequest):
    blog = Blog(**blog_data.model_dump())
    saved_blog = await save_blog(blog)
    
    return saved_blog


@app.post("/blogs/{blog_id}/sections", response_model=Blog)
async def add_section(blog_id: str, section: BlogSection):
    blog = await Blog.get(blog_id)
    if not blog:
        raise HTTPException(status_code=404, detail="Blog not found")

    blog.sections.append(section)
    await blog.save()
    return blog


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