'use client';

import { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { Song, Album, Artist } from '@/utils/types';
import { songsApi, albumsApi, artistsApi } from '@/utils/api';
import { SongCard, AlbumCard, ArtistCard } from '@/components/ui/Cards';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import Player from '@/components/layout/Player';

export default function SearchPage() {
    const [query, setQuery] = useState('');
    const [songs, setSongs] = useState<Song[]>([]);
    const [albums, setAlbums] = useState<Album[]>([]);
    const [artists, setArtists] = useState<Artist[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    // Browse categories for when no search
    const browseCategories = [
        { name: 'Electronic', color: 'bg-pink-600' },
        { name: 'Ambient', color: 'bg-purple-600' },
        { name: 'Indie', color: 'bg-green-600' },
        { name: 'Chill', color: 'bg-blue-600' },
        { name: 'Focus', color: 'bg-yellow-600' },
        { name: 'Workout', color: 'bg-red-600' },
    ];

    useEffect(() => {
        if (!query.trim()) {
            setSongs([]);
            setAlbums([]);
            setArtists([]);
            setHasSearched(false);
            return;
        }

        const searchTimeout = setTimeout(async () => {
            setLoading(true);
            setHasSearched(true);
            try {
                const [songsRes, albumsRes, artistsRes] = await Promise.all([
                    songsApi.getAll(0, 10, query),
                    albumsApi.getAll(0, 10),
                    artistsApi.getAll(0, 10),
                ]);

                setSongs(songsRes);
                // Filter albums and artists client-side since backend might not support search
                setAlbums(albumsRes.filter((a: Album) =>
                    a.title.toLowerCase().includes(query.toLowerCase())
                ));
                setArtists(artistsRes.filter((a: Artist) =>
                    a.name.toLowerCase().includes(query.toLowerCase())
                ));
            } catch (error) {
                console.error('Search failed:', error);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(searchTimeout);
    }, [query]);

    return (
        <div className="h-screen flex flex-col bg-spotify-black">
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />

                <main className="flex-1 overflow-y-auto bg-gradient-to-b from-spotify-gray-900 to-spotify-black">
                    <Header />

                    <div className="px-6 pb-8">
                        {/* Search Input */}
                        <div className="relative max-w-xl mb-8">
                            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-spotify-gray-400" />
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="What do you want to listen to?"
                                className="w-full pl-12 pr-4 py-3 bg-white text-black rounded-full font-medium placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                            />
                        </div>

                        {loading && (
                            <div className="flex items-center justify-center h-32">
                                <div className="w-8 h-8 border-2 border-spotify-green border-t-transparent rounded-full animate-spin" />
                            </div>
                        )}

                        {!loading && !hasSearched && (
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-4">Browse all</h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                                    {browseCategories.map((category) => (
                                        <div
                                            key={category.name}
                                            className={`${category.color} rounded-lg p-4 h-32 relative overflow-hidden cursor-pointer hover:scale-105 transition-transform`}
                                        >
                                            <h3 className="text-xl font-bold text-white">{category.name}</h3>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {!loading && hasSearched && (
                            <div className="space-y-8 animate-fade-in">
                                {/* Songs Results */}
                                {songs.length > 0 && (
                                    <section>
                                        <h2 className="text-2xl font-bold text-white mb-4">Songs</h2>
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                            {songs.map((song, index) => (
                                                <SongCard key={song.id} song={song} songs={songs} index={index} />
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {/* Albums Results */}
                                {albums.length > 0 && (
                                    <section>
                                        <h2 className="text-2xl font-bold text-white mb-4">Albums</h2>
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                                            {albums.map((album) => (
                                                <AlbumCard key={album.id} album={album} />
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {/* Artists Results */}
                                {artists.length > 0 && (
                                    <section>
                                        <h2 className="text-2xl font-bold text-white mb-4">Artists</h2>
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                                            {artists.map((artist) => (
                                                <ArtistCard key={artist.id} artist={artist} />
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {/* No Results */}
                                {songs.length === 0 && albums.length === 0 && artists.length === 0 && (
                                    <div className="text-center py-16">
                                        <h2 className="text-2xl font-bold text-white mb-2">
                                            No results found for &quot;{query}&quot;
                                        </h2>
                                        <p className="text-spotify-gray-400">
                                            Please try a different search term
                                        </p>
                                    </div>
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
