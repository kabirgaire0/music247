'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuthStore();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            await register(email, username, password);
            toast.success('Account created successfully!');
            router.push('/');
        } catch (error: any) {
            toast.error(error.response?.data?.detail || 'Registration failed');
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
                        Sign up for free
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-white mb-2">
                                Email address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@email.com"
                                required
                                className="w-full px-4 py-3 bg-spotify-gray-800 border border-spotify-gray-700 rounded-md text-white placeholder-spotify-gray-400 focus:outline-none focus:border-white transition-colors"
                            />
                        </div>

                        <div>
                            <label htmlFor="username" className="block text-sm font-semibold text-white mb-2">
                                Username
                            </label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Choose a username"
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
                                placeholder="Create a password"
                                required
                                className="w-full px-4 py-3 bg-spotify-gray-800 border border-spotify-gray-700 rounded-md text-white placeholder-spotify-gray-400 focus:outline-none focus:border-white transition-colors"
                            />
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-white mb-2">
                                Confirm password
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm your password"
                                required
                                className="w-full px-4 py-3 bg-spotify-gray-800 border border-spotify-gray-700 rounded-md text-white placeholder-spotify-gray-400 focus:outline-none focus:border-white transition-colors"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-spotify-green text-black rounded-full font-bold text-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                        >
                            {loading ? 'Creating account...' : 'Sign Up'}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-spotify-gray-700 text-center">
                        <p className="text-spotify-gray-400">
                            Already have an account?{' '}
                            <Link href="/login" className="text-white underline hover:text-spotify-green">
                                Log in here
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
