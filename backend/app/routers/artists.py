from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import List, Optional
from app.database import get_db
from app.models.artist import Artist
from app.models.song import Song
from app.schemas.music import ArtistResponse, ArtistCreate, ArtistWithAlbumsResponse, SongResponse, AlbumResponse

router = APIRouter(prefix="/api/artists", tags=["Artists"])


@router.get("", response_model=List[ArtistResponse])
async def get_artists(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    query = select(Artist)
    
    if search:
        query = query.where(Artist.name.ilike(f"%{search}%"))
    
    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    artists = result.scalars().all()
    
    return [ArtistResponse.model_validate(artist) for artist in artists]


@router.get("/featured", response_model=List[ArtistResponse])
async def get_featured_artists(
    limit: int = Query(10, ge=1, le=50),
    db: AsyncSession = Depends(get_db)
):
    query = select(Artist).order_by(Artist.monthly_listeners.desc()).limit(limit)
    result = await db.execute(query)
    artists = result.scalars().all()
    
    return [ArtistResponse.model_validate(artist) for artist in artists]


@router.get("/{artist_id}", response_model=ArtistWithAlbumsResponse)
async def get_artist(artist_id: int, db: AsyncSession = Depends(get_db)):
    query = select(Artist).options(
        selectinload(Artist.albums),
        selectinload(Artist.songs)
    ).where(Artist.id == artist_id)
    
    result = await db.execute(query)
    artist = result.scalar_one_or_none()
    
    if not artist:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Artist not found"
        )
    
    # Get top songs (sorted by plays)
    top_songs_query = select(Song).where(Song.artist_id == artist_id).order_by(Song.plays.desc()).limit(10)
    top_songs_result = await db.execute(top_songs_query)
    top_songs = top_songs_result.scalars().all()
    
    artist_data = ArtistWithAlbumsResponse.model_validate(artist)
    artist_data.albums = [AlbumResponse.model_validate(album) for album in artist.albums]
    artist_data.top_songs = [SongResponse.model_validate(song) for song in top_songs]
    
    return artist_data


@router.post("", response_model=ArtistResponse, status_code=status.HTTP_201_CREATED)
async def create_artist(artist_data: ArtistCreate, db: AsyncSession = Depends(get_db)):
    artist = Artist(**artist_data.model_dump())
    db.add(artist)
    await db.commit()
    await db.refresh(artist)
    
    return ArtistResponse.model_validate(artist)
