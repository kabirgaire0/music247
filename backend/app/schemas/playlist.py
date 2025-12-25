from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.schemas.music import SongResponse
from app.schemas.user import UserResponse


# Playlist Schemas
class PlaylistBase(BaseModel):
    name: str
    description: Optional[str] = None
    is_public: bool = True


class PlaylistCreate(PlaylistBase):
    pass


class PlaylistUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    is_public: Optional[bool] = None
    cover_url: Optional[str] = None


class PlaylistResponse(PlaylistBase):
    id: int
    cover_url: Optional[str] = None
    user_id: int
    owner: Optional[UserResponse] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class PlaylistWithSongsResponse(PlaylistResponse):
    songs: List[SongResponse] = []
    song_count: int = 0
    total_duration: int = 0

    class Config:
        from_attributes = True


class AddSongToPlaylist(BaseModel):
    song_id: int
