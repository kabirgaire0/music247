from sqlalchemy import select
from app.database import async_session_maker
from app.models.artist import Artist
from app.models.album import Album
from app.models.song import Song


async def seed_sample_data():
    """Seed the database with sample music data for demonstration."""
    async with async_session_maker() as db:
        # Check if data already exists
        result = await db.execute(select(Artist).limit(1))
        if result.scalar_one_or_none():
            print("Sample data already exists, skipping seed.")
            return
        
        print("Seeding sample data...")
        
        # Sample artists
        artists = [
            Artist(
                name="The Midnight",
                bio="The Midnight is an American electronic music duo from Los Angeles.",
                image_url="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
                monthly_listeners=1500000
            ),
            Artist(
                name="ODESZA",
                bio="ODESZA is an American electronic music duo from Bellingham, Washington.",
                image_url="https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400",
                monthly_listeners=8500000
            ),
            Artist(
                name="Tycho",
                bio="Tycho is an American ambient music project led by Scott Hansen.",
                image_url="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400",
                monthly_listeners=3200000
            ),
            Artist(
                name="Bonobo",
                bio="Bonobo is the stage name of British musician Simon Green.",
                image_url="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400",
                monthly_listeners=4100000
            ),
            Artist(
                name="Flume",
                bio="Harley Edward Streten, known professionally as Flume, is an Australian musician.",
                image_url="https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400",
                monthly_listeners=9800000
            ),
        ]
        
        for artist in artists:
            db.add(artist)
        await db.commit()
        
        # Refresh to get IDs
        for artist in artists:
            await db.refresh(artist)
        
        # Sample albums
        albums = [
            Album(
                title="Endless Summer",
                artist_id=artists[0].id,
                cover_url="https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=400",
                album_type="album"
            ),
            Album(
                title="A Moment Apart",
                artist_id=artists[1].id,
                cover_url="https://images.unsplash.com/photo-1614149162883-504ce4d13909?w=400",
                album_type="album"
            ),
            Album(
                title="Dive",
                artist_id=artists[2].id,
                cover_url="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
                album_type="album"
            ),
            Album(
                title="Migration",
                artist_id=artists[3].id,
                cover_url="https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400",
                album_type="album"
            ),
            Album(
                title="Hi This Is Flume",
                artist_id=artists[4].id,
                cover_url="https://images.unsplash.com/photo-1506157786151-b8491531f063?w=400",
                album_type="album"
            ),
        ]
        
        for album in albums:
            db.add(album)
        await db.commit()
        
        for album in albums:
            await db.refresh(album)
        
        # Sample songs with free audio URLs from Pixabay (royalty-free)
        sample_audio_urls = [
            "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3",
            "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3",
            "https://cdn.pixabay.com/download/audio/2022/10/25/audio_946ba661c5.mp3",
            "https://cdn.pixabay.com/download/audio/2023/05/16/audio_166b9c7242.mp3",
            "https://cdn.pixabay.com/download/audio/2022/03/15/audio_8cb749d484.mp3",
        ]
        
        songs_data = [
            # The Midnight - Endless Summer
            ("Sunset", albums[0].id, artists[0].id, 245, sample_audio_urls[0], 1, 1250000),
            ("Gloria", albums[0].id, artists[0].id, 312, sample_audio_urls[1], 2, 980000),
            ("Days of Thunder", albums[0].id, artists[0].id, 289, sample_audio_urls[2], 3, 750000),
            # ODESZA - A Moment Apart
            ("A Moment Apart", albums[1].id, artists[1].id, 268, sample_audio_urls[3], 1, 2100000),
            ("Higher Ground", albums[1].id, artists[1].id, 225, sample_audio_urls[4], 2, 1850000),
            ("Line of Sight", albums[1].id, artists[1].id, 241, sample_audio_urls[0], 3, 1650000),
            # Tycho - Dive
            ("Dive", albums[2].id, artists[2].id, 356, sample_audio_urls[1], 1, 890000),
            ("Coastal Brake", albums[2].id, artists[2].id, 315, sample_audio_urls[2], 2, 720000),
            ("A Walk", albums[2].id, artists[2].id, 302, sample_audio_urls[3], 3, 650000),
            # Bonobo - Migration
            ("Migration", albums[3].id, artists[3].id, 248, sample_audio_urls[4], 1, 1100000),
            ("Kerala", albums[3].id, artists[3].id, 289, sample_audio_urls[0], 2, 1450000),
            ("Break Apart", albums[3].id, artists[3].id, 315, sample_audio_urls[1], 3, 980000),
            # Flume
            ("Hi This Is Flume", albums[4].id, artists[4].id, 532, sample_audio_urls[2], 1, 2500000),
            ("Rushing Back", albums[4].id, artists[4].id, 229, sample_audio_urls[3], 2, 3100000),
            ("Never Be Like You", albums[4].id, artists[4].id, 234, sample_audio_urls[4], 3, 4500000),
        ]
        
        for title, album_id, artist_id, duration, audio_url, track_number, plays in songs_data:
            song = Song(
                title=title,
                album_id=album_id,
                artist_id=artist_id,
                duration=duration,
                audio_url=audio_url,
                track_number=track_number,
                plays=plays
            )
            db.add(song)
        
        await db.commit()
        print("Sample data seeded successfully!")
