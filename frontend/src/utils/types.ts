export interface Artist {
    id: number;
    name: string;
    bio?: string;
    image_url?: string;
    monthly_listeners: number;
    created_at: string;
}

export interface Album {
    id: number;
    title: string;
    artist_id: number;
    artist?: Artist;
    cover_url?: string;
    release_date?: string;
    album_type: string;
    created_at: string;
}

export interface Song {
    id: number;
    title: string;
    album_id?: number;
    artist_id: number;
    artist?: Artist;
    album?: Album;
    duration: number;
    audio_url: string;
    plays: number;
    track_number?: number;
    created_at: string;
}

export interface Playlist {
    id: number;
    name: string;
    description?: string;
    cover_url?: string;
    user_id: number;
    is_public: boolean;
    created_at: string;
    updated_at?: string;
    songs?: Song[];
    song_count?: number;
    total_duration?: number;
}

export interface User {
    id: number;
    email: string;
    username: string;
    avatar_url?: string;
    is_premium: boolean;
    created_at: string;
}

export interface AuthResponse {
    access_token: string;
    token_type: string;
    user: User;
}
