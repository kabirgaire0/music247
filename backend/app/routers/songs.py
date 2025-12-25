from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from typing import List, Optional
from app.database import get_db
from app.models.song import Song
from app.models.artist import Artist
from app.models.album import Album
from app.models.library import RecentlyPlayed
from app.models.user import User
from app.schemas.music import SongResponse, SongCreate
from app.auth import get_current_user

router = APIRouter(prefix="/api/songs", tags=["Songs"])


@router.get("", response_model=List[SongResponse])
async def get_songs(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    query = select(Song).options(
        selectinload(Song.artist),
        selectinload(Song.album)
    )
    
    if search:
        query = query.where(Song.title.ilike(f"%{search}%"))
    
    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    songs = result.scalars().all()
    
    return [SongResponse.model_validate(song) for song in songs]


@router.get("/featured", response_model=List[SongResponse])
async def get_featured_songs(
    limit: int = Query(10, ge=1, le=50),
    db: AsyncSession = Depends(get_db)
):
    query = select(Song).options(
        selectinload(Song.artist),
        selectinload(Song.album)
    ).order_by(Song.plays.desc()).limit(limit)
    
    result = await db.execute(query)
    songs = result.scalars().all()
    
    return [SongResponse.model_validate(song) for song in songs]


@router.get("/{song_id}", response_model=SongResponse)
async def get_song(song_id: int, db: AsyncSession = Depends(get_db)):
    query = select(Song).options(
        selectinload(Song.artist),
        selectinload(Song.album)
    ).where(Song.id == song_id)
    
    result = await db.execute(query)
    song = result.scalar_one_or_none()
    
    if not song:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Song not found"
        )
    
    return SongResponse.model_validate(song)


@router.post("/{song_id}/play")
async def record_play(
    song_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Get song
    result = await db.execute(select(Song).where(Song.id == song_id))
    song = result.scalar_one_or_none()
    
    if not song:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Song not found"
        )
    
    # Increment play count
    song.plays += 1
    
    # Record in recently played
    recently_played = RecentlyPlayed(user_id=current_user.id, song_id=song_id)
    db.add(recently_played)
    
    await db.commit()
    
    return {"message": "Play recorded", "plays": song.plays}


@router.post("", response_model=SongResponse, status_code=status.HTTP_201_CREATED)
async def create_song(song_data: SongCreate, db: AsyncSession = Depends(get_db)):
    # Verify artist exists
    result = await db.execute(select(Artist).where(Artist.id == song_data.artist_id))
    if not result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Artist not found"
        )
    
    # Verify album exists if provided
    if song_data.album_id:
        result = await db.execute(select(Album).where(Album.id == song_data.album_id))
        if not result.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Album not found"
            )
    
    song = Song(**song_data.model_dump())
    db.add(song)
    await db.commit()
    await db.refresh(song)
    
    # Reload with relationships
    query = select(Song).options(
        selectinload(Song.artist),
        selectinload(Song.album)
    ).where(Song.id == song.id)
    result = await db.execute(query)
    song = result.scalar_one()
    
    return SongResponse.model_validate(song)
