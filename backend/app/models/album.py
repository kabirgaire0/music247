from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Date
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Album(Base):
    __tablename__ = "albums"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False, index=True)
    artist_id = Column(Integer, ForeignKey("artists.id"), nullable=False)
    cover_url = Column(String(500), nullable=True)
    release_date = Column(Date, nullable=True)
    album_type = Column(String(50), default="album")  # album, single, ep
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    artist = relationship("Artist", back_populates="albums")
    songs = relationship("Song", back_populates="album", cascade="all, delete-orphan")
