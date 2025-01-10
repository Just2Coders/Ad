import React, { useState, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, X } from "lucide-react";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Card } from "./ui/card";

interface VideoPlayerProps {
  videoUrl?: string;
  minWatchTime?: number;
  onComplete?: () => void;
  onCodeAppear?: (code: string) => void;
  onClose?: () => void;
}

const sampleVideos = [
  "https://download.samplelib.com/mp4/sample-5s.mp4",
  "https://download.samplelib.com/mp4/sample-10s.mp4",
  "https://download.samplelib.com/mp4/sample-15s.mp4",
  "https://download.samplelib.com/mp4/sample-20s.mp4",
  "https://download.samplelib.com/mp4/sample-30s.mp4",
];

const VideoPlayer = ({
  videoUrl = sampleVideos[Math.floor(Math.random() * sampleVideos.length)],
  minWatchTime = 5,
  onComplete = () => {},
  onCodeAppear = () => {},
  onClose = () => {},
}: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [canClose, setCanClose] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [codeShown, setCodeShown] = useState(false);

  const videoRef = React.useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  }, [videoRef.current?.duration]);

  const generateVerificationCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setVerificationCode(code);
    return code;
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      setCurrentTime(current);
      setProgress((current / duration) * 100);

      // Show verification code at 3 seconds
      if (current >= 3 && !codeShown) {
        const code = generateVerificationCode();
        onCodeAppear(code);
        setCodeShown(true);
      }

      // Enable close button after minimum watch time
      if (current >= minWatchTime && !canClose) {
        setCanClose(true);
      }
    }
  };

  const handleClose = () => {
    if (canClose) {
      onClose();
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <Card className="w-[854px] bg-background p-4 space-y-4">
      <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          className="w-full h-full"
          src={videoUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
          autoPlay
        />

        {/* Verification Code Overlay */}
        {codeShown && currentTime < 5 && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/90 text-white px-6 py-4 rounded-lg text-2xl font-bold">
            {verificationCode}
          </div>
        )}

        {/* Timer Overlay */}
        <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-md">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>

        {/* Close Button */}
        {canClose && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 left-4 text-white hover:text-white/80"
            onClick={handleClose}
          >
            <X className="h-6 w-6" />
          </Button>
        )}

        {/* Controls Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <div className="flex flex-col gap-2">
            <Progress value={progress} className="w-full" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:text-white/80"
                  onClick={handlePlayPause}
                >
                  {isPlaying ? (
                    <Pause className="h-6 w-6" />
                  ) : (
                    <Play className="h-6 w-6" />
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:text-white/80"
                  onClick={toggleMute}
                >
                  {isMuted ? (
                    <VolumeX className="h-6 w-6" />
                  ) : (
                    <Volume2 className="h-6 w-6" />
                  )}
                </Button>
              </div>

              <div className="text-white text-sm">
                {!canClose
                  ? `Wait ${formatTime(minWatchTime - currentTime)} to close`
                  : "You can now close the video"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default VideoPlayer;
