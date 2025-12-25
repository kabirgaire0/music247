'use client';

import Image from 'next/image';
import { FaPlay } from 'react-icons/fa';
import { Song, Album, Artist, Playlist } from '@/utils/types';
import { usePlayerStore } from '@/store/playerStore';
import Link from 'next/link';

interface SongCardProps {
    song: Song;
    songs?: Song[];
    index?: number;
}

export function SongCard({ song, songs, index }: SongCardProps) {
    const { playQueue, playSong } = usePlayerStore();

    const handlePlay = () => {
        if (songs && index !== undefined) {
            playQueue(songs, index);
        } else {
            playSong(song);
        }
    };

    return (
        <div
            className="bg-spotify-gray-900 p-4 rounded-lg card-hover group cursor-pointer"
            onClick={handlePlay}
        >
            <div className="relative mb-4">
                <div className="aspect-square relative rounded-md overflow-hidden shadow-lg">
                    {song.album?.cover_url ? (
                        <Image
                            src={song.album.cover_url}
                            alt={song.title}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-spotify-gray-700 flex items-center justify-center">
                            <span className="text-4xl">🎵</span>
                        </div>
                    )}
                </div>
                <button className="play-button absolute bottom-2 right-2 w-12 h-12 bg-spotify-green rounded-full flex items-center justify-center shadow-xl hover:scale-105 transition-all">
                    <FaPlay className="text-black ml-1" />
                </button>
            </div>
            <h3 className="text-white font-bold truncate">{song.title}</h3>
            <p className="text-spotify-gray-400 text-sm truncate mt-1">
                {song.artist?.name}
            </p>
        </div>
    );
}

interface AlbumCardProps {
    album: Album;
}

export function AlbumCard({ album }: AlbumCardProps) {
    return (
        <Link href={`/album/${album.id}`}>
            <div className="bg-spotify-gray-900 p-4 rounded-lg card-hover group cursor-pointer">
                <div className="relative mb-4">
                    <div className="aspect-square relative rounded-md overflow-hidden shadow-lg">
                        {album.cover_url ? (
                            <Image
                                src={album.cover_url}
                                alt={album.title}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-spotify-gray-700 flex items-center justify-center">
                                <span className="text-4xl">💿</span>
                            </div>
                        )}
                    </div>
                    <button className="play-button absolute bottom-2 right-2 w-12 h-12 bg-spotify-green rounded-full flex items-center justify-center shadow-xl hover:scale-105 transition-all">
                        <FaPlay className="text-black ml-1" />
                    </button>
                </div>
                <h3 className="text-white font-bold truncate">{album.title}</h3>
                <p className="text-spotify-gray-400 text-sm truncate mt-1">
                    {album.artist?.name}
                </p>
            </div>
        </Link>
    );
}

interface ArtistCardProps {
    artist: Artist;
}

export function ArtistCard({ artist }: ArtistCardProps) {
    return (
        <Link href={`/artist/${artist.id}`}>
            <div className="bg-spotify-gray-900 p-4 rounded-lg card-hover group cursor-pointer">
                <div className="relative mb-4">
                    <div className="aspect-square relative rounded-full overflow-hidden shadow-lg">
                        {artist.image_url ? (
                            <Image
                                src={artist.image_url}
                                alt={artist.name}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-spotify-gray-700 flex items-center justify-center">
                                <span className="text-4xl">👤</span>
                            </div>
                        )}
                    </div>
                    <button className="play-button absolute bottom-2 right-2 w-12 h-12 bg-spotify-green rounded-full flex items-center justify-center shadow-xl hover:scale-105 transition-all">
                        <FaPlay className="text-black ml-1" />
                    </button>
                </div>
                <h3 className="text-white font-bold truncate text-center">{artist.name}</h3>
                <p className="text-spotify-gray-400 text-sm truncate mt-1 text-center">
                    Artist
                </p>
            </div>
        </Link>
    );
}
