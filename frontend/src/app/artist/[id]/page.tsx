'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { FaPlay, FaClock } from 'react-icons/fa';
import { Artist, Album, Song } from '@/utils/types';
import { artistsApi } from '@/utils/api';
import { usePlayerStore } from '@/store/playerStore';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import Player from '@/components/layout/Player';
import { AlbumCard } from '@/components/ui/Cards';

interface ArtistDetails extends Artist {
    albums: Album[];
    top_songs: Song[];
}

export default function ArtistPage() {
    const params = useParams();
    const [artist, setArtist] = useState<ArtistDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const { playQueue } = usePlayerStore();

    useEffect(() => {
        if (params.id) {
            fetchArtist(Number(params.id));
        }
    }, [params.id]);

    const fetchArtist = async (id: number) => {
        try {
            const data = await artistsApi.getById(id);
            setArtist(data);
        } catch (error) {
            console.error('Failed to fetch artist:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const formatListeners = (num: number) => {
        if (num >= 1000000) {
            return `${(num / 1000000).toFixed(1)}M`;
        }
        return `${(num / 1000).toFixed(0)}K`;
    };

    const handlePlayTopSongs = () => {
        if (artist?.top_songs) {
            playQueue(artist.top_songs, 0);
        }
    };

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-spotify-black">
                <div className="w-8 h-8 border-2 border-spotify-green border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!artist) {
        return (
            <div className="h-screen flex items-center justify-center bg-spotify-black">
                <p className="text-white">Artist not found</p>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-spotify-black">
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />

                <main className="flex-1 overflow-y-auto">
                    {/* Artist Hero */}
                    <div
                        className="relative h-80 bg-gradient-to-b from-blue-900 to-transparent"
                        style={{
                            backgroundImage: artist.image_url ? `url(${artist.image_url})` : undefined,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-spotify-black" />
                        <Header />
                        <div className="absolute bottom-6 left-6">
                            <span className="text-sm text-white font-medium flex items-center gap-1">
                                ✓ Verified Artist
                            </span>
                            <h1 className="text-6xl font-bold text-white mt-2">{artist.name}</h1>
                            <p className="text-white mt-4">
                                {formatListeners(artist.monthly_listeners)} monthly listeners
                            </p>
                        </div>
                    </div>

                    <div className="px-6 pb-8 bg-gradient-to-b from-spotify-gray-900/80 to-spotify-black">
                        {/* Play Button */}
                        <div className="py-6 flex items-center gap-6">
                            <button
                                onClick={handlePlayTopSongs}
                                className="w-14 h-14 bg-spotify-green rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-xl"
                            >
                                <FaPlay className="text-black text-xl ml-1" />
                            </button>
                        </div>

                        {/* Popular Tracks */}
                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-white mb-4">Popular</h2>
                            <div>
                                {artist.top_songs?.slice(0, 5).map((song, index) => (
                                    <div
                                        key={song.id}
                                        onClick={() => playQueue(artist.top_songs, index)}
                                        className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 py-2 rounded-md hover:bg-white/10 cursor-pointer group"
                                    >
                                        <span className="text-spotify-gray-400 flex items-center">
                                            <span className="group-hover:hidden">{index + 1}</span>
                                            <FaPlay className="hidden group-hover:block text-white text-sm" />
                                        </span>
                                        <div className="flex items-center gap-4">
                                            {song.album?.cover_url && (
                                                <Image
                                                    src={song.album.cover_url}
                                                    alt={song.title}
                                                    width={40}
                                                    height={40}
                                                    className="rounded"
                                                />
                                            )}
                                            <span className="text-white font-medium">{song.title}</span>
                                        </div>
                                        <span className="text-spotify-gray-400 text-sm flex items-center">
                                            {song.plays.toLocaleString()} plays
                                        </span>
                                        <span className="text-spotify-gray-400 text-sm flex items-center justify-end">
                                            {formatDuration(song.duration)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Albums */}
                        {artist.albums && artist.albums.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">Discography</h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                                    {artist.albums.map((album) => (
                                        <AlbumCard key={album.id} album={album} />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Bio */}
                        {artist.bio && (
                            <section className="mt-8">
                                <h2 className="text-2xl font-bold text-white mb-4">About</h2>
                                <p className="text-spotify-gray-300 max-w-2xl">{artist.bio}</p>
                            </section>
                        )}
                    </div>
                </main>
            </div>

            <Player />
        </div>
    );
}
