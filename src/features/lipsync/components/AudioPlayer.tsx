import React from "react";
import { Play, Pause } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { FaPause } from "react-icons/fa6";
import { FaPlay } from "react-icons/fa";

interface AudioPlayerProps {
  audioUrl: string;
  className?: string;
}

export function AudioPlayer({ audioUrl, className }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => setIsPlaying(false);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  return (
    <div className={className}>
      <audio ref={audioRef} src={audioUrl} />
      <Button
        variant="ghost"
        size="sm"
        onClick={togglePlay}
        className="h-8 w-8 p-0 text-black"
      >
        {isPlaying ? (
          <p className="h-4 w-4  text-black">
            <FaPause />
          </p>
        ) : (
          <p className="h-4 w-4  text-black">
            <FaPlay />
          </p>
        )}
      </Button>
    </div>
  );
}
