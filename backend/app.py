from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from src.db.mongodb import init_db
from src.contact import router as contact_router

load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database on startup
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
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run( "app:app", host="127.0.0.1", port=8000 )