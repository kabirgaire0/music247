from sqlalchemy import Column, Integer, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class LikedSong(Base):
    __tablename__ = "liked_songs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    song_id = Column(Integer, ForeignKey("songs.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="liked_songs")
    song = relationship("Song", back_populates="liked_by")


class RecentlyPlayed(Base):
    __tablename__ = "recently_played"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    song_id = Column(Integer, ForeignKey("songs.id"), nullable=False)
    played_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="recently_played")
    song = relationship("Song")
