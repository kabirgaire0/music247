from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, date


# Artist Schemas
class ArtistBase(BaseModel):
    name: str
    bio: Optional[str] = None
    image_url: Optional[str] = None


class ArtistCreate(ArtistBase):
    pass


class ArtistResponse(ArtistBase):
    id: int
    monthly_listeners: int = 0
    created_at: datetime

    class Config:
        from_attributes = True


# Album Schemas
class AlbumBase(BaseModel):
    title: str
    cover_url: Optional[str] = None
    release_date: Optional[date] = None
    album_type: str = "album"


class AlbumCreate(AlbumBase):
    artist_id: int


class AlbumResponse(AlbumBase):
    id: int
    artist_id: int
    artist: Optional[ArtistResponse] = None
    created_at: datetime

    class Config:
        from_attributes = True


# Song Schemas
class SongBase(BaseModel):
    title: str
    duration: int
    audio_url: str
    track_number: Optional[int] = None


class SongCreate(SongBase):
    artist_id: int
    album_id: Optional[int] = None


class SongResponse(SongBase):
    id: int
    album_id: Optional[int] = None
    artist_id: int
    plays: int = 0
    artist: Optional[ArtistResponse] = None
    album: Optional[AlbumResponse] = None
    created_at: datetime

    class Config:
        from_attributes = True


class AlbumWithSongsResponse(AlbumResponse):
    songs: List[SongResponse] = []

    class Config:
        from_attributes = True


class ArtistWithAlbumsResponse(ArtistResponse):
    albums: List[AlbumResponse] = []
    top_songs: List[SongResponse] = []

    class Config:
        from_attributes = True
