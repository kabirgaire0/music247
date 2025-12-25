import { create } from 'zustand';
import { User } from '@/utils/types';
import { authApi } from '@/utils/api';

interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;

    // Actions
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, username: string, password: string) => Promise<void>;
    logout: () => void;
    checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: null,
    isLoading: true,

    login: async (email, password) => {
        const response = await authApi.login(email, password);
        localStorage.setItem('access_token', response.access_token);
        set({ user: response.user, token: response.access_token });
    },

    register: async (email, username, password) => {
        const response = await authApi.register(email, username, password);
        localStorage.setItem('access_token', response.access_token);
        set({ user: response.user, token: response.access_token });
    },

    logout: () => {
        localStorage.removeItem('access_token');
        set({ user: null, token: null });
    },

    checkAuth: async () => {
        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                set({ isLoading: false });
                return;
            }
            const user = await authApi.getMe();
            set({ user, token, isLoading: false });
        } catch {
            localStorage.removeItem('access_token');
            set({ user: null, token: null, isLoading: false });
        }
    },
}));
