from app.schemas.user import UserBase, UserCreate, UserResponse, UserLogin, Token
from app.schemas.music import (
    ArtistBase, ArtistCreate, ArtistResponse, ArtistWithAlbumsResponse,
    AlbumBase, AlbumCreate, AlbumResponse, AlbumWithSongsResponse,
    SongBase, SongCreate, SongResponse
)
from app.schemas.playlist import (
    PlaylistBase, PlaylistCreate, PlaylistUpdate, PlaylistResponse,
    PlaylistWithSongsResponse, AddSongToPlaylist
)

__all__ = [
    "UserBase", "UserCreate", "UserResponse", "UserLogin", "Token",
    "ArtistBase", "ArtistCreate", "ArtistResponse", "ArtistWithAlbumsResponse",
    "AlbumBase", "AlbumCreate", "AlbumResponse", "AlbumWithSongsResponse",
    "SongBase", "SongCreate", "SongResponse",
    "PlaylistBase", "PlaylistCreate", "PlaylistUpdate", "PlaylistResponse",
    "PlaylistWithSongsResponse", "AddSongToPlaylist"
]
