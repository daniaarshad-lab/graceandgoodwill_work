"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Mic, Play, Pause, ListMusic } from "lucide-react";

const INTERVIEWS = [
  { id: 1, title: "BBC Interview 1", src: "/audio/bbc-audio-1.mp3" },
  { id: 2, title: "BBC Interview 2", src: "/audio/bbc-audio-2.mp4" },
];

const formatTime = (time: number): string => {
  if (Number.isNaN(time)) return "00:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

export default function BBCAudioCard() {
  const [activeInterview, setActiveInterview] = useState(INTERVIEWS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
      setDuration(0);
    }
  }, [activeInterview]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setProgress(
        (audioRef.current.currentTime / audioRef.current.duration) * 100,
      );
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTo = Number(e.target.value);
    if (audioRef.current) {
      const newTime = (seekTo / 100) * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
      setProgress(seekTo);
    }
  };

  return (
    <div className="group rounded-[2rem] border border-gold-300/10 bg-navy-900/60 shadow-elegant backdrop-blur-lg hover:border-gold-300/20 transition-all duration-300 flex flex-col h-full overflow-hidden">
      <audio
        ref={audioRef}
        src={activeInterview.src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />

      <div className="relative w-full flex-grow flex flex-col justify-between p-6 sm:p-8 group/media">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-navy-950/20 mix-blend-multiply z-10 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950/95 via-navy-950/50 to-transparent z-10 pointer-events-none transition-opacity duration-500" />
          <Image
            src="/image.png"
            alt="BBC Interview"
            fill
            className="object-cover object-top filter contrast-[1.05] brightness-[0.95] group-hover/media:scale-101 transition-transform duration-700"
          />
        </div>
        {/* 
        <div className="relative z-20 flex justify-between items-start">
          <span className="px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-navy-950/70 backdrop-blur-md text-gold-300 border border-gold-400/20 flex items-center gap-1.5 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-gold-400 animate-pulse" />
            BBC Audio Features
          </span>
          <Mic className="w-5 h-5 text-gold-200 drop-shadow-md group-hover:text-gold-300 transition-colors" />
        </div> */}

        <div className="relative z-20 flex flex-col space-y-4 sm:space-y-5 mt-auto mb-0">
          <h3 className="text-lg font-bold text-gold-50 drop-shadow-lg leading-tight">
            Exclusive BBC Care Interviews
          </h3>

          <div className="flex gap-2">
            {INTERVIEWS.map((interview) => (
              <button
                key={interview.id}
                onClick={() => setActiveInterview(interview)}
                className={`flex-1 text-[10px] sm:text-[11px] font-medium tracking-wide uppercase py-2 px-2 rounded-xl border transition-all duration-300 flex items-center justify-center gap-1.5 ${activeInterview.id === interview.id
                  ? "bg-gold-400/25 border-gold-400/40 text-gold-100 shadow-[0_0_15px_rgba(232,186,122,0.2)] backdrop-blur-md"
                  : "bg-navy-950/60 border-gold-300/10 text-gold-100/60 hover:bg-gold-400/15 hover:text-gold-100 hover:border-gold-300/30 backdrop-blur-sm"
                  }`}
              >
                {activeInterview.id === interview.id && (
                  <ListMusic className="w-3.5 h-3.5" />
                )}
                {interview.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-6 pb-6 pt-4 sm:px-8 sm:pb-8 sm:pt-5 bg-gradient-to-b from-navy-950/95 to-navy-900/90 relative z-10 shrink-0">
        <div className="rounded-xl bg-navy-900/50 border border-gold-300/10 p-2.5 sm:p-3 flex items-center gap-3 shadow-inner backdrop-blur-md">
          <button
            onClick={togglePlay}
            className="w-8 h-8 shrink-0 rounded-full bg-gold-400/10 border border-gold-400/30 flex items-center justify-center text-gold-300 hover:bg-gold-400 hover:text-navy-950 hover:border-gold-400 transition-all duration-300 shadow-sm"
            aria-label={isPlaying ? "Pause audio" : "Play audio"}
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5 fill-current" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
            )}
          </button>

          <div className="flex flex-col gap-1 flex-grow">
            <div className="flex justify-between items-center text-[9px] font-mono text-gold-200/60 px-0.5">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>

            <div className="relative w-full h-1 rounded-full bg-navy-800/80 group/slider mt-0.5">
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-gold-600 to-gold-400 rounded-full transition-all duration-75"
                style={{ width: `${progress || 0}%` }}
              />
              <input
                type="range"
                min="0"
                max="100"
                value={progress || 0}
                onChange={handleSeek}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                aria-label="Seek time"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
