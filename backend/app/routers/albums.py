from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import List, Optional
from app.database import get_db
from app.models.album import Album
from app.models.artist import Artist
from app.schemas.music import AlbumResponse, AlbumCreate, AlbumWithSongsResponse, SongResponse

router = APIRouter(prefix="/api/albums", tags=["Albums"])


@router.get("", response_model=List[AlbumResponse])
async def get_albums(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    query = select(Album).options(selectinload(Album.artist))
    
    if search:
        query = query.where(Album.title.ilike(f"%{search}%"))
    
    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    albums = result.scalars().all()
    
    return [AlbumResponse.model_validate(album) for album in albums]


@router.get("/featured", response_model=List[AlbumResponse])
async def get_featured_albums(
    limit: int = Query(10, ge=1, le=50),
    db: AsyncSession = Depends(get_db)
):
    query = select(Album).options(
        selectinload(Album.artist)
    ).order_by(Album.created_at.desc()).limit(limit)
    
    result = await db.execute(query)
    albums = result.scalars().all()
    
    return [AlbumResponse.model_validate(album) for album in albums]


@router.get("/{album_id}", response_model=AlbumWithSongsResponse)
async def get_album(album_id: int, db: AsyncSession = Depends(get_db)):
    query = select(Album).options(
        selectinload(Album.artist),
        selectinload(Album.songs)
    ).where(Album.id == album_id)
    
    result = await db.execute(query)
    album = result.scalar_one_or_none()
    
    if not album:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Album not found"
        )
    
    album_data = AlbumWithSongsResponse.model_validate(album)
    album_data.songs = [SongResponse.model_validate(song) for song in album.songs]
    
    return album_data


@router.post("", response_model=AlbumResponse, status_code=status.HTTP_201_CREATED)
async def create_album(album_data: AlbumCreate, db: AsyncSession = Depends(get_db)):
    # Verify artist exists
    result = await db.execute(select(Artist).where(Artist.id == album_data.artist_id))
    if not result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Artist not found"
        )
    
    album = Album(**album_data.model_dump())
    db.add(album)
    await db.commit()
    await db.refresh(album)
    
    # Reload with artist
    query = select(Album).options(selectinload(Album.artist)).where(Album.id == album.id)
    result = await db.execute(query)
    album = result.scalar_one()
    
    return AlbumResponse.model_validate(album)
