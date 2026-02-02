from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine
from . import models
from .routers import auth, initiatives, dashboard

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Executive Strategy & Execution Dashboard API",
    description="Backend for the PoC to demonstrate executive visibility on initiatives.",
    version="0.1.0"
)

# CORS configuration
origins = [
    "http://localhost",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(initiatives.router, prefix="/api", tags=["Initiatives"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Executive Dashboard"])

@app.get("/", tags=["Root"])
async def read_root():
    return {"message": "Welcome to the Executive Strategy & Execution Dashboard API"}
