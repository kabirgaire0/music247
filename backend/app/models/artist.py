from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Artist(Base):
    __tablename__ = "artists"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    bio = Column(Text, nullable=True)
    image_url = Column(String(500), nullable=True)
    monthly_listeners = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    albums = relationship("Album", back_populates="artist", cascade="all, delete-orphan")
    songs = relationship("Song", back_populates="artist")
