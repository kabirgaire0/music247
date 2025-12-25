from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from typing import List
from app.database import get_db
from app.models.playlist import Playlist, PlaylistSong
from app.models.song import Song
from app.models.user import User
from app.schemas.playlist import (
    PlaylistResponse, PlaylistCreate, PlaylistUpdate,
    PlaylistWithSongsResponse, AddSongToPlaylist
)
from app.schemas.music import SongResponse
from app.auth import get_current_user

router = APIRouter(prefix="/api/playlists", tags=["Playlists"])


@router.get("", response_model=List[PlaylistResponse])
async def get_my_playlists(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = select(Playlist).where(Playlist.user_id == current_user.id).order_by(Playlist.created_at.desc())
    result = await db.execute(query)
    playlists = result.scalars().all()
    
    return [PlaylistResponse.model_validate(playlist) for playlist in playlists]


@router.get("/public", response_model=List[PlaylistResponse])
async def get_public_playlists(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    query = select(Playlist).options(
        selectinload(Playlist.owner)
    ).where(Playlist.is_public == True).offset(skip).limit(limit)
    
    result = await db.execute(query)
    playlists = result.scalars().all()
    
    return [PlaylistResponse.model_validate(playlist) for playlist in playlists]


@router.get("/{playlist_id}", response_model=PlaylistWithSongsResponse)
async def get_playlist(playlist_id: int, db: AsyncSession = Depends(get_db)):
    query = select(Playlist).options(
        selectinload(Playlist.owner),
        selectinload(Playlist.playlist_songs).selectinload(PlaylistSong.song).selectinload(Song.artist)
    ).where(Playlist.id == playlist_id)
    
    result = await db.execute(query)
    playlist = result.scalar_one_or_none()
    
    if not playlist:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Playlist not found"
        )
    
    # Build response with songs
    songs = [SongResponse.model_validate(ps.song) for ps in playlist.playlist_songs]
    total_duration = sum(song.duration for song in songs)
    
    response = PlaylistWithSongsResponse.model_validate(playlist)
    response.songs = songs
    response.song_count = len(songs)
    response.total_duration = total_duration
    
    return response


@router.post("", response_model=PlaylistResponse, status_code=status.HTTP_201_CREATED)
async def create_playlist(
    playlist_data: PlaylistCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    playlist = Playlist(
        **playlist_data.model_dump(),
        user_id=current_user.id
    )
    db.add(playlist)
    await db.commit()
    await db.refresh(playlist)
    
    return PlaylistResponse.model_validate(playlist)


@router.put("/{playlist_id}", response_model=PlaylistResponse)
async def update_playlist(
    playlist_id: int,
    playlist_data: PlaylistUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(Playlist).where(Playlist.id == playlist_id))
    playlist = result.scalar_one_or_none()
    
    if not playlist:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Playlist not found"
        )
    
    if playlist.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this playlist"
        )
    
    update_data = playlist_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(playlist, key, value)
    
    await db.commit()
    await db.refresh(playlist)
    
    return PlaylistResponse.model_validate(playlist)


@router.delete("/{playlist_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_playlist(
    playlist_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(Playlist).where(Playlist.id == playlist_id))
    playlist = result.scalar_one_or_none()
    
    if not playlist:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Playlist not found"
        )
    
    if playlist.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this playlist"
        )
    
    await db.delete(playlist)
    await db.commit()


@router.post("/{playlist_id}/songs", response_model=PlaylistWithSongsResponse)
async def add_song_to_playlist(
    playlist_id: int,
    song_data: AddSongToPlaylist,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Get playlist
    result = await db.execute(select(Playlist).where(Playlist.id == playlist_id))
    playlist = result.scalar_one_or_none()
    
    if not playlist:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Playlist not found"
        )
    
    if playlist.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to modify this playlist"
        )
    
    # Verify song exists
    result = await db.execute(select(Song).where(Song.id == song_data.song_id))
    if not result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Song not found"
        )
    
    # Check if song already in playlist
    result = await db.execute(
        select(PlaylistSong).where(
            PlaylistSong.playlist_id == playlist_id,
            PlaylistSong.song_id == song_data.song_id
        )
    )
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Song already in playlist"
        )
    
    # Get next position
    result = await db.execute(
        select(func.max(PlaylistSong.position)).where(PlaylistSong.playlist_id == playlist_id)
    )
    max_position = result.scalar() or 0
    
    # Add song
    playlist_song = PlaylistSong(
        playlist_id=playlist_id,
        song_id=song_data.song_id,
        position=max_position + 1
    )
    db.add(playlist_song)
    await db.commit()
    
    # Return updated playlist
    return await get_playlist(playlist_id, db)


@router.delete("/{playlist_id}/songs/{song_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_song_from_playlist(
    playlist_id: int,
    song_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Get playlist
    result = await db.execute(select(Playlist).where(Playlist.id == playlist_id))
    playlist = result.scalar_one_or_none()
    
    if not playlist:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Playlist not found"
        )
    
    if playlist.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to modify this playlist"
        )
    
    # Find and remove song
    result = await db.execute(
        select(PlaylistSong).where(
            PlaylistSong.playlist_id == playlist_id,
            PlaylistSong.song_id == song_id
        )
    )
    playlist_song = result.scalar_one_or_none()
    
    if not playlist_song:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Song not in playlist"
        )
    
    await db.delete(playlist_song)
    await db.commit()
