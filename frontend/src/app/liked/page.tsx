'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { FaHeart, FaPlay, FaClock } from 'react-icons/fa';
import { Song } from '@/utils/types';
import { libraryApi } from '@/utils/api';
import { usePlayerStore } from '@/store/playerStore';
import { useAuthStore } from '@/store/authStore';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import Player from '@/components/layout/Player';
import Link from 'next/link';

export default function LikedSongsPage() {
    const [songs, setSongs] = useState<Song[]>([]);
    const [loading, setLoading] = useState(true);
    const { playQueue } = usePlayerStore();
    const { user } = useAuthStore();

    useEffect(() => {
        if (user) {
            fetchLikedSongs();
        } else {
            setLoading(false);
        }
    }, [user]);

    const fetchLikedSongs = async () => {
        try {
            const data = await libraryApi.getLikedSongs();
            setSongs(data);
        } catch (error) {
            console.error('Failed to fetch liked songs:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (!user) {
        return (
            <div className="h-screen flex flex-col bg-spotify-black">
                <div className="flex flex-1 overflow-hidden">
                    <Sidebar />
                    <main className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <FaHeart className="text-6xl text-spotify-gray-400 mx-auto mb-4" />
                            <h1 className="text-2xl font-bold text-white mb-2">Liked Songs</h1>
                            <p className="text-spotify-gray-400 mb-6">Log in to see your liked songs</p>
                            <Link
                                href="/login"
                                className="bg-spotify-green text-black px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform"
                            >
                                Log in
                            </Link>
                        </div>
                    </main>
                </div>
                <Player />
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-spotify-black">
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />

                <main className="flex-1 overflow-y-auto">
                    <div className="bg-gradient-to-b from-indigo-700/60 via-spotify-gray-900 to-spotify-black">
                        <Header />

                        {/* Playlist Header */}
                        <div className="px-6 pb-6 flex items-end gap-6">
                            <div className="w-56 h-56 bg-gradient-to-br from-indigo-700 to-spotify-gray-400 rounded flex items-center justify-center shadow-2xl">
                                <FaHeart className="text-white text-6xl" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="text-sm text-white font-medium uppercase">Playlist</span>
                                <h1 className="text-5xl font-bold text-white">Liked Songs</h1>
                                <div className="flex items-center gap-2 text-sm text-spotify-gray-300 mt-2">
                                    <span className="font-semibold text-white">{user.username}</span>
                                    <span>•</span>
                                    <span>{songs.length} songs</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="px-6 pb-8 bg-gradient-to-b from-spotify-gray-900/50 to-spotify-black">
                        {loading ? (
                            <div className="flex items-center justify-center h-32">
                                <div className="w-8 h-8 border-2 border-spotify-green border-t-transparent rounded-full animate-spin" />
                            </div>
                        ) : songs.length === 0 ? (
                            <div className="text-center py-16">
                                <h2 className="text-xl font-bold text-white mb-2">Songs you like will appear here</h2>
                                <p className="text-spotify-gray-400">Save songs by tapping the heart icon</p>
                            </div>
                        ) : (
                            <>
                                {/* Play Button */}
                                <div className="py-6">
                                    <button
                                        onClick={() => playQueue(songs, 0)}
                                        className="w-14 h-14 bg-spotify-green rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-xl"
                                    >
                                        <FaPlay className="text-black text-xl ml-1" />
                                    </button>
                                </div>

                                {/* Track List Header */}
                                <div className="grid grid-cols-[16px_4fr_3fr_1fr] gap-4 px-4 py-2 border-b border-spotify-gray-700 text-spotify-gray-400 text-sm">
                                    <span>#</span>
                                    <span>Title</span>
                                    <span>Album</span>
                                    <span className="flex justify-end"><FaClock /></span>
                                </div>

                                {/* Tracks */}
                                <div className="mt-2">
                                    {songs.map((song, index) => (
                                        <div
                                            key={song.id}
                                            onClick={() => playQueue(songs, index)}
                                            className="grid grid-cols-[16px_4fr_3fr_1fr] gap-4 px-4 py-2 rounded-md hover:bg-white/10 cursor-pointer group"
                                        >
                                            <span className="text-spotify-gray-400 flex items-center">
                                                <span className="group-hover:hidden">{index + 1}</span>
                                                <FaPlay className="hidden group-hover:block text-white text-sm" />
                                            </span>
                                            <div className="flex items-center gap-4 min-w-0">
                                                {song.album?.cover_url && (
                                                    <Image
                                                        src={song.album.cover_url}
                                                        alt={song.title}
                                                        width={40}
                                                        height={40}
                                                        className="rounded flex-shrink-0"
                                                    />
                                                )}
                                                <div className="min-w-0">
                                                    <span className="text-white font-medium block truncate">{song.title}</span>
                                                    <span className="text-spotify-gray-400 text-sm block truncate">{song.artist?.name}</span>
                                                </div>
                                            </div>
                                            <span className="text-spotify-gray-400 text-sm flex items-center truncate">
                                                {song.album?.title}
                                            </span>
                                            <span className="text-spotify-gray-400 text-sm flex items-center justify-end">
                                                {formatDuration(song.duration)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </main>
            </div>

            <Player />
        </div>
    );
}
