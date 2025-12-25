'use client';

import Link from 'next/link';
import { FaChevronLeft, FaChevronRight, FaUser } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function Header() {
    const router = useRouter();
    const { user, logout } = useAuthStore();

    return (
        <header className="h-16 flex items-center justify-between px-6 sticky top-0 z-10 bg-gradient-to-b from-spotify-gray-900/80 to-transparent backdrop-blur-sm">
            {/* Navigation buttons */}
            <div className="flex items-center gap-2">
                <button
                    onClick={() => router.back()}
                    className="w-8 h-8 bg-black/70 rounded-full flex items-center justify-center hover:bg-black/90 transition-colors"
                >
                    <FaChevronLeft className="text-white text-sm" />
                </button>
                <button
                    onClick={() => router.forward()}
                    className="w-8 h-8 bg-black/70 rounded-full flex items-center justify-center hover:bg-black/90 transition-colors"
                >
                    <FaChevronRight className="text-white text-sm" />
                </button>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-4">
                {user ? (
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-spotify-gray-700 rounded-full flex items-center justify-center">
                            <FaUser className="text-white text-sm" />
                        </div>
                        <span className="text-white font-semibold text-sm">{user.username}</span>
                        <button
                            onClick={logout}
                            className="text-spotify-gray-400 hover:text-white text-sm font-semibold transition-colors"
                        >
                            Log out
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-4">
                        <Link
                            href="/register"
                            className="text-spotify-gray-400 hover:text-white font-semibold text-sm transition-colors"
                        >
                            Sign up
                        </Link>
                        <Link
                            href="/login"
                            className="bg-white text-black rounded-full px-8 py-3 font-bold text-sm hover:scale-105 transition-transform"
                        >
                            Log in
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
}
