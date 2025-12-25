import { create } from 'zustand';
import { Song } from '@/utils/types';

interface PlayerState {
    currentSong: Song | null;
    queue: Song[];
    isPlaying: boolean;
    volume: number;
    progress: number;
    duration: number;

    // Actions
    playSong: (song: Song) => void;
    playQueue: (songs: Song[], startIndex?: number) => void;
    togglePlay: () => void;
    setIsPlaying: (isPlaying: boolean) => void;
    nextSong: () => void;
    prevSong: () => void;
    setVolume: (volume: number) => void;
    setProgress: (progress: number) => void;
    setDuration: (duration: number) => void;
    addToQueue: (song: Song) => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
    currentSong: null,
    queue: [],
    isPlaying: false,
    volume: 0.7,
    progress: 0,
    duration: 0,

    playSong: (song) => {
        set({ currentSong: song, isPlaying: true, progress: 0 });
    },

    playQueue: (songs, startIndex = 0) => {
        const song = songs[startIndex];
        set({
            queue: songs,
            currentSong: song,
            isPlaying: true,
            progress: 0
        });
    },

    togglePlay: () => {
        set((state) => ({ isPlaying: !state.isPlaying }));
    },

    setIsPlaying: (isPlaying) => {
        set({ isPlaying });
    },

    nextSong: () => {
        const { queue, currentSong } = get();
        if (!currentSong || queue.length === 0) return;

        const currentIndex = queue.findIndex((s) => s.id === currentSong.id);
        const nextIndex = (currentIndex + 1) % queue.length;
        set({ currentSong: queue[nextIndex], progress: 0, isPlaying: true });
    },

    prevSong: () => {
        const { queue, currentSong, progress } = get();
        if (!currentSong || queue.length === 0) return;

        // If more than 3 seconds in, restart current song
        if (progress > 3) {
            set({ progress: 0 });
            return;
        }

        const currentIndex = queue.findIndex((s) => s.id === currentSong.id);
        const prevIndex = currentIndex === 0 ? queue.length - 1 : currentIndex - 1;
        set({ currentSong: queue[prevIndex], progress: 0, isPlaying: true });
    },

    setVolume: (volume) => {
        set({ volume });
    },

    setProgress: (progress) => {
        set({ progress });
    },

    setDuration: (duration) => {
        set({ duration });
    },

    addToQueue: (song) => {
        set((state) => ({ queue: [...state.queue, song] }));
    },
}));
