from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import init_db
from app.routers import (
    auth_router,
    songs_router,
    albums_router,
    artists_router,
    playlists_router,
    library_router,
)
from app.seed import seed_sample_data


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await init_db()
    await seed_sample_data()
    yield
    # Shutdown
    pass


app = FastAPI(
    title="Music247 API",
    description="A Spotify-like music streaming API",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router)
app.include_router(songs_router)
app.include_router(albums_router)
app.include_router(artists_router)
app.include_router(playlists_router)
app.include_router(library_router)


@app.get("/")
async def root():
    return {"message": "Welcome to Music247 API", "docs": "/docs"}


@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}
