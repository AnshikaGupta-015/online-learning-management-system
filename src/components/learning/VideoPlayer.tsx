import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Maximize, Clock, StickyNote } from 'lucide-react';

interface VideoPlayerProps {
  videoUrl: string;
  lectureTitle: string;
  onTimeUpdate?: (currentTime: number) => void;
  onEnded?: () => void;
  onAddNoteAtTimestamp: (timestampSeconds: number) => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  lectureTitle,
  onTimeUpdate,
  onEnded,
  onAddNoteAtTimestamp,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [videoUrl]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const cur = videoRef.current.currentTime;
      setCurrentTime(cur);
      if (onTimeUpdate) onTimeUpdate(cur);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative bg-slate-950 rounded-xl overflow-hidden shadow-xl border border-slate-800 flex flex-col group">
      
      {/* Video Canvas */}
      <div className="relative aspect-video w-full bg-black flex items-center justify-center">
        <video
          ref={videoRef}
          src={videoUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => {
            setIsPlaying(false);
            if (onEnded) onEnded();
          }}
          className="w-full h-full object-contain cursor-pointer"
          onClick={togglePlay}
          playsInline
        />

        {/* Big play overlay if paused */}
        {!isPlaying && (
          <button
            onClick={togglePlay}
            className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-indigo-600/90 text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
            aria-label="Play Video"
          >
            <Play className="w-8 h-8 ml-1 fill-white" />
          </button>
        )}
      </div>

      {/* Control Bar */}
      <div className="p-3 bg-slate-900 border-t border-slate-800 text-slate-200">
        
        {/* Scrubber */}
        <div className="flex items-center gap-2 mb-2">
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
        </div>

        <div className="flex items-center justify-between text-xs">
          
          {/* Left: Play, Mute, Timers */}
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="p-1.5 rounded hover:bg-slate-800 text-white transition-colors"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
            </button>

            <button
              onClick={() => {
                if (videoRef.current) {
                  videoRef.current.currentTime = Math.max(0, currentTime - 10);
                }
              }}
              className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Rewind 10 seconds"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={toggleMute}
              className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <div className="flex items-center gap-1 font-mono tabular-nums text-slate-400 text-xs">
              <span className="text-white font-medium">{formatTime(currentTime)}</span>
              <span>/</span>
              <span>{formatTime(duration || 0)}</span>
            </div>
          </div>

          {/* Right: Add Note, Speed, Fullscreen */}
          <div className="flex items-center gap-2">
            
            <button
              onClick={() => onAddNoteAtTimestamp(currentTime)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-xs font-medium"
              title="Save a note pinned to current playback timestamp"
            >
              <StickyNote className="w-3.5 h-3.5 text-amber-400" />
              <span>Note at {formatTime(currentTime)}</span>
            </button>

            {/* Speed segmented menu */}
            <div className="flex items-center bg-slate-800 rounded p-0.5 text-[11px] font-mono">
              {[1, 1.25, 1.5, 2].map((speed) => (
                <button
                  key={speed}
                  onClick={() => handleSpeedChange(speed)}
                  className={`px-1.5 py-0.5 rounded transition-colors ${
                    playbackSpeed === speed
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>

            <button
              onClick={handleFullscreen}
              className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Fullscreen"
            >
              <Maximize className="w-4 h-4" />
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};
