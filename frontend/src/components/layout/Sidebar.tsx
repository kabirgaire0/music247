'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHome, FaSearch, FaBook, FaPlus, FaHeart } from 'react-icons/fa';
import { useAuthStore } from '@/store/authStore';

export default function Sidebar() {
    const pathname = usePathname();
    const { user } = useAuthStore();

    const navItems = [
        { href: '/', label: 'Home', icon: FaHome },
        { href: '/search', label: 'Search', icon: FaSearch },
        { href: '/library', label: 'Your Library', icon: FaBook },
    ];

    return (
        <aside className="w-64 bg-black h-full flex flex-col p-2 gap-2">
            {/* Logo */}
            <div className="bg-spotify-gray-900 rounded-lg p-4">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-spotify-green rounded-full flex items-center justify-center">
                        <span className="text-black font-bold text-lg">M</span>
                    </div>
                    <span className="text-xl font-bold text-white">Music247</span>
                </Link>
            </div>

            {/* Main Navigation */}
            <nav className="bg-spotify-gray-900 rounded-lg p-4 flex flex-col gap-4">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-4 transition-colors ${isActive ? 'text-white' : 'text-spotify-gray-400 hover:text-white'
                                }`}
                        >
                            <Icon className="text-2xl" />
                            <span className="font-semibold">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Library Section */}
            <div className="bg-spotify-gray-900 rounded-lg p-4 flex-1 overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-spotify-gray-400 text-sm font-semibold">Playlists</span>
                    {user && (
                        <button className="text-spotify-gray-400 hover:text-white transition-colors">
                            <FaPlus />
                        </button>
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    {/* Liked Songs */}
                    <Link
                        href="/liked"
                        className="flex items-center gap-3 p-2 rounded-md hover:bg-spotify-gray-800 transition-colors group"
                    >
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-700 to-spotify-gray-400 rounded flex items-center justify-center">
                            <FaHeart className="text-white text-lg" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-white text-sm font-medium">Liked Songs</span>
                            <span className="text-spotify-gray-400 text-xs">Playlist</span>
                        </div>
                    </Link>

                    {/* Sample playlists */}
                    <div className="border-t border-spotify-gray-800 pt-2 mt-2">
                        <p className="text-spotify-gray-400 text-xs text-center py-4">
                            {user ? 'Your playlists will appear here' : 'Login to create playlists'}
                        </p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
