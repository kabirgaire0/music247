'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { FaPlay, FaClock } from 'react-icons/fa';
import { Album, Song } from '@/utils/types';
import { albumsApi } from '@/utils/api';
import { usePlayerStore } from '@/store/playerStore';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import Player from '@/components/layout/Player';

export default function AlbumPage() {
    const params = useParams();
    const [album, setAlbum] = useState<Album & { songs: Song[] } | null>(null);
    const [loading, setLoading] = useState(true);
    const { playQueue } = usePlayerStore();

    useEffect(() => {
        if (params.id) {
            fetchAlbum(Number(params.id));
        }
    }, [params.id]);

    const fetchAlbum = async (id: number) => {
        try {
            const data = await albumsApi.getById(id);
            setAlbum(data);
        } catch (error) {
            console.error('Failed to fetch album:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handlePlayAll = () => {
        if (album?.songs) {
            playQueue(album.songs, 0);
        }
    };

    const handlePlaySong = (index: number) => {
        if (album?.songs) {
            playQueue(album.songs, index);
        }
    };

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-spotify-black">
                <div className="w-8 h-8 border-2 border-spotify-green border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!album) {
        return (
            <div className="h-screen flex items-center justify-center bg-spotify-black">
                <p className="text-white">Album not found</p>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-spotify-black">
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />

                <main className="flex-1 overflow-y-auto">
                    <div className="bg-gradient-to-b from-purple-900/60 via-spotify-gray-900 to-spotify-black">
                        <Header />

                        {/* Album Header */}
                        <div className="px-6 pb-6 flex items-end gap-6">
                            <div className="w-56 h-56 flex-shrink-0 shadow-2xl">
                                {album.cover_url ? (
                                    <Image
                                        src={album.cover_url}
                                        alt={album.title}
                                        width={224}
                                        height={224}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-spotify-gray-700 flex items-center justify-center">
                                        <span className="text-6xl">💿</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="text-sm text-white font-medium uppercase">Album</span>
                                <h1 className="text-5xl font-bold text-white">{album.title}</h1>
                                <div className="flex items-center gap-2 text-sm text-spotify-gray-300 mt-2">
                                    <span className="font-semibold text-white">{album.artist?.name}</span>
                                    <span>•</span>
                                    <span>{album.songs?.length || 0} songs</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Controls and Track List */}
                    <div className="px-6 pb-8 bg-gradient-to-b from-spotify-gray-900/50 to-spotify-black">
                        {/* Play Button */}
                        <div className="py-6">
                            <button
                                onClick={handlePlayAll}
                                className="w-14 h-14 bg-spotify-green rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-xl"
                            >
                                <FaPlay className="text-black text-xl ml-1" />
                            </button>
                        </div>

                        {/* Track List Header */}
                        <div className="grid grid-cols-[16px_4fr_1fr] gap-4 px-4 py-2 border-b border-spotify-gray-700 text-spotify-gray-400 text-sm">
                            <span>#</span>
                            <span>Title</span>
                            <span className="flex justify-end">
                                <FaClock />
                            </span>
                        </div>

                        {/* Tracks */}
                        <div className="mt-2">
                            {album.songs?.map((song, index) => (
                                <div
                                    key={song.id}
                                    onClick={() => handlePlaySong(index)}
                                    className="grid grid-cols-[16px_4fr_1fr] gap-4 px-4 py-2 rounded-md hover:bg-white/10 cursor-pointer group"
                                >
                                    <span className="text-spotify-gray-400 flex items-center">
                                        <span className="group-hover:hidden">{index + 1}</span>
                                        <FaPlay className="hidden group-hover:block text-white text-sm" />
                                    </span>
                                    <div className="flex flex-col">
                                        <span className="text-white font-medium">{song.title}</span>
                                        <span className="text-spotify-gray-400 text-sm">{song.artist?.name}</span>
                                    </div>
                                    <span className="text-spotify-gray-400 text-sm flex items-center justify-end">
                                        {formatDuration(song.duration)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>

            <Player />
        </div>
    );
}
