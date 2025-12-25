from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Song(Base):
    __tablename__ = "songs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False, index=True)
    album_id = Column(Integer, ForeignKey("albums.id"), nullable=True)
    artist_id = Column(Integer, ForeignKey("artists.id"), nullable=False)
    duration = Column(Integer, nullable=False)  # Duration in seconds
    audio_url = Column(String(500), nullable=False)
    plays = Column(Integer, default=0)
    track_number = Column(Integer, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    album = relationship("Album", back_populates="songs")
    artist = relationship("Artist", back_populates="songs")
    playlist_songs = relationship("PlaylistSong", back_populates="song", cascade="all, delete-orphan")
    liked_by = relationship("LikedSong", back_populates="song", cascade="all, delete-orphan")
