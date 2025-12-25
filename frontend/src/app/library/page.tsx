'use client';

import { useEffect, useState } from 'react';
import { FaBook, FaPlus } from 'react-icons/fa';
import { Playlist, Song } from '@/utils/types';
import { playlistsApi, libraryApi } from '@/utils/api';
import { useAuthStore } from '@/store/authStore';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import Player from '@/components/layout/Player';
import Link from 'next/link';
import { SongCard } from '@/components/ui/Cards';

export default function LibraryPage() {
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [recentlyPlayed, setRecentlyPlayed] = useState<Song[]>([]);
    const [loading, setLoading] = useState(true);
    const { user, checkAuth } = useAuthStore();

    useEffect(() => {
        checkAuth();
    }, []);

    useEffect(() => {
        if (user) {
            fetchLibrary();
        } else {
            setLoading(false);
        }
    }, [user]);

    const fetchLibrary = async () => {
        try {
            const [playlistsData, recentData] = await Promise.all([
                playlistsApi.getMine(),
                libraryApi.getRecentlyPlayed(),
            ]);
            setPlaylists(playlistsData);
            setRecentlyPlayed(recentData);
        } catch (error) {
            console.error('Failed to fetch library:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="h-screen flex flex-col bg-spotify-black">
                <div className="flex flex-1 overflow-hidden">
                    <Sidebar />
                    <main className="flex-1 flex items-center justify-center bg-gradient-to-b from-spotify-gray-900 to-spotify-black">
                        <div className="text-center">
                            <FaBook className="text-6xl text-spotify-gray-400 mx-auto mb-4" />
                            <h1 className="text-2xl font-bold text-white mb-2">Your Library</h1>
                            <p className="text-spotify-gray-400 mb-6">Log in to see your saved music</p>
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

                <main className="flex-1 overflow-y-auto bg-gradient-to-b from-spotify-gray-900 to-spotify-black">
                    <Header />

                    <div className="px-6 pb-8">
                        <div className="flex items-center justify-between mb-6">
                            <h1 className="text-3xl font-bold text-white">Your Library</h1>
                            <button className="text-spotify-gray-400 hover:text-white transition-colors">
                                <FaPlus className="text-xl" />
                            </button>
                        </div>

                        {loading ? (
                            <div className="flex items-center justify-center h-32">
                                <div className="w-8 h-8 border-2 border-spotify-green border-t-transparent rounded-full animate-spin" />
                            </div>
                        ) : (
                            <div className="space-y-8">
                                {/* Playlists Section */}
                                <section>
                                    <h2 className="text-xl font-bold text-white mb-4">Playlists</h2>
                                    {playlists.length === 0 ? (
                                        <div className="bg-spotify-gray-900 rounded-lg p-6 text-center">
                                            <p className="text-spotify-gray-400">No playlists yet. Create one to get started!</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                            {playlists.map((playlist) => (
                                                <Link key={playlist.id} href={`/playlist/${playlist.id}`}>
                                                    <div className="bg-spotify-gray-900 p-4 rounded-lg card-hover cursor-pointer">
                                                        <div className="aspect-square bg-spotify-gray-700 rounded mb-4 flex items-center justify-center">
                                                            <span className="text-4xl">🎵</span>
                                                        </div>
                                                        <h3 className="text-white font-bold truncate">{playlist.name}</h3>
                                                        <p className="text-spotify-gray-400 text-sm">Playlist</p>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </section>

                                {/* Recently Played Section */}
                                {recentlyPlayed.length > 0 && (
                                    <section>
                                        <h2 className="text-xl font-bold text-white mb-4">Recently Played</h2>
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                            {recentlyPlayed.slice(0, 10).map((song, index) => (
                                                <SongCard key={song.id} song={song} songs={recentlyPlayed} index={index} />
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
