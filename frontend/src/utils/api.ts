import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

// API functions
export const authApi = {
    register: async (email: string, username: string, password: string) => {
        const { data } = await api.post('/api/auth/register', { email, username, password });
        return data;
    },
    login: async (email: string, password: string) => {
        const formData = new FormData();
        formData.append('username', email);
        formData.append('password', password);
        const { data } = await api.post('/api/auth/login', formData, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });
        return data;
    },
    getMe: async () => {
        const { data } = await api.get('/api/auth/me');
        return data;
    },
};

export const songsApi = {
    getAll: async (skip = 0, limit = 20, search?: string) => {
        const params = new URLSearchParams({ skip: String(skip), limit: String(limit) });
        if (search) params.append('search', search);
        const { data } = await api.get(`/api/songs?${params}`);
        return data;
    },
    getFeatured: async (limit = 10) => {
        const { data } = await api.get(`/api/songs/featured?limit=${limit}`);
        return data;
    },
    getById: async (id: number) => {
        const { data } = await api.get(`/api/songs/${id}`);
        return data;
    },
    recordPlay: async (id: number) => {
        const { data } = await api.post(`/api/songs/${id}/play`);
        return data;
    },
};

export const albumsApi = {
    getAll: async (skip = 0, limit = 20) => {
        const { data } = await api.get(`/api/albums?skip=${skip}&limit=${limit}`);
        return data;
    },
    getFeatured: async (limit = 10) => {
        const { data } = await api.get(`/api/albums/featured?limit=${limit}`);
        return data;
    },
    getById: async (id: number) => {
        const { data } = await api.get(`/api/albums/${id}`);
        return data;
    },
};

export const artistsApi = {
    getAll: async (skip = 0, limit = 20) => {
        const { data } = await api.get(`/api/artists?skip=${skip}&limit=${limit}`);
        return data;
    },
    getFeatured: async (limit = 10) => {
        const { data } = await api.get(`/api/artists/featured?limit=${limit}`);
        return data;
    },
    getById: async (id: number) => {
        const { data } = await api.get(`/api/artists/${id}`);
        return data;
    },
};

export const playlistsApi = {
    getMine: async () => {
        const { data } = await api.get('/api/playlists');
        return data;
    },
    getPublic: async (skip = 0, limit = 20) => {
        const { data } = await api.get(`/api/playlists/public?skip=${skip}&limit=${limit}`);
        return data;
    },
    getById: async (id: number) => {
        const { data } = await api.get(`/api/playlists/${id}`);
        return data;
    },
    create: async (name: string, description?: string) => {
        const { data } = await api.post('/api/playlists', { name, description });
        return data;
    },
    addSong: async (playlistId: number, songId: number) => {
        const { data } = await api.post(`/api/playlists/${playlistId}/songs`, { song_id: songId });
        return data;
    },
    removeSong: async (playlistId: number, songId: number) => {
        await api.delete(`/api/playlists/${playlistId}/songs/${songId}`);
    },
    delete: async (id: number) => {
        await api.delete(`/api/playlists/${id}`);
    },
};

export const libraryApi = {
    getLikedSongs: async () => {
        const { data } = await api.get('/api/library/liked');
        return data;
    },
    likeSong: async (songId: number) => {
        const { data } = await api.post(`/api/library/liked/${songId}`);
        return data;
    },
    unlikeSong: async (songId: number) => {
        await api.delete(`/api/library/liked/${songId}`);
    },
    checkIfLiked: async (songId: number) => {
        const { data } = await api.get(`/api/library/liked/${songId}/check`);
        return data;
    },
    getRecentlyPlayed: async () => {
        const { data } = await api.get('/api/library/recently-played');
        return data;
    },
};
