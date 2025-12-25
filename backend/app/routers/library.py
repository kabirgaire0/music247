from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from sqlalchemy.orm import selectinload
from typing import List
from app.database import get_db
from app.models.library import LikedSong, RecentlyPlayed
from app.models.song import Song
from app.models.user import User
from app.schemas.music import SongResponse
from app.auth import get_current_user

router = APIRouter(prefix="/api/library", tags=["Library"])


@router.get("/liked", response_model=List[SongResponse])
async def get_liked_songs(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = select(LikedSong).options(
        selectinload(LikedSong.song).selectinload(Song.artist),
        selectinload(LikedSong.song).selectinload(Song.album)
    ).where(
        LikedSong.user_id == current_user.id
    ).order_by(LikedSong.created_at.desc()).offset(skip).limit(limit)
    
    result = await db.execute(query)
    liked_songs = result.scalars().all()
    
    return [SongResponse.model_validate(ls.song) for ls in liked_songs]


@router.post("/liked/{song_id}", status_code=status.HTTP_201_CREATED)
async def like_song(
    song_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Check if song exists
    result = await db.execute(select(Song).where(Song.id == song_id))
    if not result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Song not found"
        )
    
    # Check if already liked
    result = await db.execute(
        select(LikedSong).where(
            LikedSong.user_id == current_user.id,
            LikedSong.song_id == song_id
        )
    )
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Song already liked"
        )
    
    liked_song = LikedSong(user_id=current_user.id, song_id=song_id)
    db.add(liked_song)
    await db.commit()
    
    return {"message": "Song liked", "song_id": song_id}


@router.delete("/liked/{song_id}", status_code=status.HTTP_204_NO_CONTENT)
async def unlike_song(
    song_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(LikedSong).where(
            LikedSong.user_id == current_user.id,
            LikedSong.song_id == song_id
        )
    )
    liked_song = result.scalar_one_or_none()
    
    if not liked_song:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Song not in liked songs"
        )
    
    await db.delete(liked_song)
    await db.commit()


@router.get("/liked/{song_id}/check")
async def check_if_liked(
    song_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(LikedSong).where(
            LikedSong.user_id == current_user.id,
            LikedSong.song_id == song_id
        )
    )
    is_liked = result.scalar_one_or_none() is not None
    
    return {"song_id": song_id, "is_liked": is_liked}


@router.get("/recently-played", response_model=List[SongResponse])
async def get_recently_played(
    limit: int = Query(20, ge=1, le=50),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = select(RecentlyPlayed).options(
        selectinload(RecentlyPlayed.song).selectinload(Song.artist),
        selectinload(RecentlyPlayed.song).selectinload(Song.album)
    ).where(
        RecentlyPlayed.user_id == current_user.id
    ).order_by(RecentlyPlayed.played_at.desc()).limit(limit)
    
    result = await db.execute(query)
    recently_played = result.scalars().all()
    
    # Remove duplicates, keeping most recent
    seen = set()
    unique_songs = []
    for rp in recently_played:
        if rp.song_id not in seen:
            seen.add(rp.song_id)
            unique_songs.append(SongResponse.model_validate(rp.song))
    
    return unique_songs
