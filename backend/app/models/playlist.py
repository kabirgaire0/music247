from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Playlist(Base):
    __tablename__ = "playlists"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(String(500), nullable=True)
    cover_url = Column(String(500), nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    is_public = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    owner = relationship("User", back_populates="playlists")
    playlist_songs = relationship("PlaylistSong", back_populates="playlist", cascade="all, delete-orphan")


class PlaylistSong(Base):
    __tablename__ = "playlist_songs"

    id = Column(Integer, primary_key=True, index=True)
    playlist_id = Column(Integer, ForeignKey("playlists.id"), nullable=False)
    song_id = Column(Integer, ForeignKey("songs.id"), nullable=False)
    added_at = Column(DateTime(timezone=True), server_default=func.now())
    position = Column(Integer, nullable=True)

    # Relationships
    playlist = relationship("Playlist", back_populates="playlist_songs")
    song = relationship("Song", back_populates="playlist_songs")
