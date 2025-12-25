from app.routers.auth import router as auth_router
from app.routers.songs import router as songs_router
from app.routers.albums import router as albums_router
from app.routers.artists import router as artists_router
from app.routers.playlists import router as playlists_router
from app.routers.library import router as library_router

__all__ = [
    "auth_router",
    "songs_router",
    "albums_router",
    "artists_router",
    "playlists_router",
    "library_router",
]
