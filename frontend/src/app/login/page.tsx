'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuthStore();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await login(email, password);
            toast.success('Welcome back!');
            router.push('/');
        } catch (error: any) {
            toast.error(error.response?.data?.detail || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-spotify-gray-900 to-spotify-black flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-spotify-green rounded-full flex items-center justify-center">
                            <span className="text-black font-bold text-xl">M</span>
                        </div>
                        <span className="text-2xl font-bold text-white">Music247</span>
                    </div>
                </div>

                <div className="bg-spotify-gray-900 rounded-lg p-8">
                    <h1 className="text-3xl font-bold text-white text-center mb-8">
                        Log in to Music247
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-white mb-2">
                                Email address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email address"
                                required
                                className="w-full px-4 py-3 bg-spotify-gray-800 border border-spotify-gray-700 rounded-md text-white placeholder-spotify-gray-400 focus:outline-none focus:border-white transition-colors"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-white mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                required
                                className="w-full px-4 py-3 bg-spotify-gray-800 border border-spotify-gray-700 rounded-md text-white placeholder-spotify-gray-400 focus:outline-none focus:border-white transition-colors"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-spotify-green text-black rounded-full font-bold text-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Logging in...' : 'Log In'}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-spotify-gray-700 text-center">
                        <p className="text-spotify-gray-400">
                            Don&apos;t have an account?{' '}
                            <Link href="/register" className="text-white underline hover:text-spotify-green">
                                Sign up for Music247
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <Link href="/" className="text-spotify-gray-400 hover:text-white transition-colors">
                        ← Back to home
                    </Link>
                </div>
            </div>
        </div>
    );
}
