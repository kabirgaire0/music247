'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import {
    FaPlay, FaPause, FaStepBackward, FaStepForward,
    FaVolumeUp, FaVolumeMute, FaRandom, FaRedo
} from 'react-icons/fa';
import { usePlayerStore } from '@/store/playerStore';
import { songsApi } from '@/utils/api';

export default function Player() {
    const audioRef = useRef<HTMLAudioElement>(null);
    const {
        currentSong, isPlaying, volume, progress, duration,
        togglePlay, setIsPlaying, nextSong, prevSong,
        setVolume, setProgress, setDuration
    } = usePlayerStore();

    // Handle play/pause
    useEffect(() => {
        if (!audioRef.current || !currentSong) return;

        if (isPlaying) {
            audioRef.current.play().catch(() => setIsPlaying(false));
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying, currentSong, setIsPlaying]);

    // Handle song change
    useEffect(() => {
        if (!audioRef.current || !currentSong) return;
        audioRef.current.src = currentSong.audio_url;
        audioRef.current.load();
        if (isPlaying) {
            audioRef.current.play().catch(() => setIsPlaying(false));
            // Record play
            songsApi.recordPlay(currentSong.id).catch(() => { });
        }
    }, [currentSong?.id]);

    // Handle volume change
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setProgress(audioRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const handleEnded = () => {
        nextSong();
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = Number(e.target.value);
        setProgress(time);
        if (audioRef.current) {
            audioRef.current.currentTime = time;
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (!currentSong) {
        return (
            <footer className="h-20 bg-spotify-gray-900 border-t border-spotify-gray-800 flex items-center justify-center">
                <p className="text-spotify-gray-400">Select a song to play</p>
            </footer>
        );
    }

    return (
        <footer className="h-20 bg-spotify-gray-900 border-t border-spotify-gray-800 px-4 flex items-center justify-between">
            <audio
                ref={audioRef}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={handleEnded}
            />

            {/* Song Info */}
            <div className="flex items-center gap-4 w-1/4 min-w-[180px]">
                {currentSong.album?.cover_url && (
                    <div className="relative w-14 h-14 flex-shrink-0">
                        <Image
                            src={currentSong.album.cover_url}
                            alt={currentSong.title}
                            fill
                            className="object-cover rounded"
                        />
                    </div>
                )}
                <div className="flex flex-col min-w-0">
                    <span className="text-white text-sm font-medium truncate">
                        {currentSong.title}
                    </span>
                    <span className="text-spotify-gray-400 text-xs truncate">
                        {currentSong.artist?.name}
                    </span>
                </div>
            </div>

            {/* Player Controls */}
            <div className="flex flex-col items-center gap-2 w-2/4 max-w-[722px]">
                <div className="flex items-center gap-4">
                    <button className="text-spotify-gray-400 hover:text-white transition-colors">
                        <FaRandom className="text-sm" />
                    </button>
                    <button
                        onClick={prevSong}
                        className="text-spotify-gray-400 hover:text-white transition-colors"
                    >
                        <FaStepBackward className="text-lg" />
                    </button>
                    <button
                        onClick={togglePlay}
                        className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform"
                    >
                        {isPlaying ? (
                            <FaPause className="text-black text-sm" />
                        ) : (
                            <FaPlay className="text-black text-sm ml-0.5" />
                        )}
                    </button>
                    <button
                        onClick={nextSong}
                        className="text-spotify-gray-400 hover:text-white transition-colors"
                    >
                        <FaStepForward className="text-lg" />
                    </button>
                    <button className="text-spotify-gray-400 hover:text-white transition-colors">
                        <FaRedo className="text-sm" />
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="flex items-center gap-2 w-full">
                    <span className="text-spotify-gray-400 text-xs w-10 text-right">
                        {formatTime(progress)}
                    </span>
                    <input
                        type="range"
                        min="0"
                        max={duration || 100}
                        value={progress}
                        onChange={handleSeek}
                        className="flex-1 h-1 accent-spotify-green"
                        style={{
                            background: `linear-gradient(to right, #1DB954 ${(progress / (duration || 1)) * 100}%, #535353 0%)`
                        }}
                    />
                    <span className="text-spotify-gray-400 text-xs w-10">
                        {formatTime(duration)}
                    </span>
                </div>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-2 w-1/4 justify-end min-w-[180px]">
                <button
                    onClick={() => setVolume(volume > 0 ? 0 : 0.7)}
                    className="text-spotify-gray-400 hover:text-white transition-colors"
                >
                    {volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
                </button>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="w-24 h-1 accent-spotify-green"
                    style={{
                        background: `linear-gradient(to right, #1DB954 ${volume * 100}%, #535353 0%)`
                    }}
                />
            </div>
        </footer>
    );
}
