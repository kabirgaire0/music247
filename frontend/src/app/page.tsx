'use client';

import { useEffect, useState } from 'react';
import { Song, Album, Artist } from '@/utils/types';
import { songsApi, albumsApi, artistsApi } from '@/utils/api';
import { SongCard, AlbumCard, ArtistCard } from '@/components/ui/Cards';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import Player from '@/components/layout/Player';
import { useAuthStore } from '@/store/authStore';

export default function Home() {
    const [featuredSongs, setFeaturedSongs] = useState<Song[]>([]);
    const [featuredAlbums, setFeaturedAlbums] = useState<Album[]>([]);
    const [featuredArtists, setFeaturedArtists] = useState<Artist[]>([]);
    const [loading, setLoading] = useState(true);
    const { checkAuth } = useAuthStore();

    useEffect(() => {
        checkAuth();
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [songs, albums, artists] = await Promise.all([
                songsApi.getFeatured(8),
                albumsApi.getFeatured(6),
                artistsApi.getFeatured(6),
            ]);
            setFeaturedSongs(songs);
            setFeaturedAlbums(albums);
            setFeaturedArtists(artists);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    return (
        <div className="h-screen flex flex-col bg-spotify-black">
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />

                <main className="flex-1 overflow-y-auto bg-gradient-to-b from-indigo-900/40 via-spotify-black to-spotify-black">
                    <Header />

                    <div className="px-6 pb-8">
                        <h1 className="text-3xl font-bold text-white mb-6 animate-fade-in">
                            {getGreeting()}
                        </h1>

                        {loading ? (
                            <div className="flex items-center justify-center h-64">
                                <div className="w-8 h-8 border-2 border-spotify-green border-t-transparent rounded-full animate-spin" />
                            </div>
                        ) : (
                            <div className="space-y-8 animate-slide-up">
                                {/* Featured Songs */}
                                <section>
                                    <h2 className="text-2xl font-bold text-white mb-4">
                                        Popular Tracks
                                    </h2>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                        {featuredSongs.slice(0, 5).map((song, index) => (
                                            <SongCard
                                                key={song.id}
                                                song={song}
                                                songs={featuredSongs}
                                                index={index}
                                            />
                                        ))}
                                    </div>
                                </section>

                                {/* Featured Albums */}
                                <section>
                                    <h2 className="text-2xl font-bold text-white mb-4">
                                        Featured Albums
                                    </h2>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                                        {featuredAlbums.map((album) => (
                                            <AlbumCard key={album.id} album={album} />
                                        ))}
                                    </div>
                                </section>

                                {/* Featured Artists */}
                                <section>
                                    <h2 className="text-2xl font-bold text-white mb-4">
                                        Popular Artists
                                    </h2>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                                        {featuredArtists.map((artist) => (
                                            <ArtistCard key={artist.id} artist={artist} />
                                        ))}
                                    </div>
                                </section>

                                {/* More Songs */}
                                {featuredSongs.length > 5 && (
                                    <section>
                                        <h2 className="text-2xl font-bold text-white mb-4">
                                            Discover More
                                        </h2>
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                            {featuredSongs.slice(5).map((song, index) => (
                                                <SongCard
                                                    key={song.id}
                                                    song={song}
                                                    songs={featuredSongs}
                                                    index={index + 5}
                                                />
                                            ))}
                                        </div>
                                    </section>
                                )}
                            </div>
                        )}
                    </div>
                </main>
            </div>

            <Player />
        </div>
    );
}
