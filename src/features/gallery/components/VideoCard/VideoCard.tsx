import React, { useState } from "react";
import { PlayButton } from "./PlayButton";
import { VideoOverlay } from "./VideoOverlay";
import { GalleryVideo } from "../../types";
import { X, Download } from "lucide-react";

interface Props {
  video: GalleryVideo;
  activeTab: string;
}

export function VideoCard({ video, activeTab }: Props) {
  const [isHovered, setIsHovered] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowPreview(true);
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await fetch(video.videoUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `video-${video.id}.mp4`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  return (
    <>
      <button
        onClick={handlePlay}
        className="block w-full group focus:outline-none relative"
        aria-label="Play UGC video"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className="relative"
          style={{ aspectRatio: `${activeTab == "minmax" ? "16/9" : "9/16"}` }}
        >
          <video
            src={video.videoUrl}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            muted
            playsInline
          />
          <VideoOverlay />
          <PlayButton />
        </div>

        {isHovered && (
          <div
            className="absolute bottom-0 left-0 right-0 p-4 bg-black/75 text-white text-sm 
            transform transition-transform duration-200 ease-in-out translate-y-0"
          >
            <p className="line-clamp-2">{video.prompt}</p>
            <p className="text-xs text-white/60 mt-1">
              {new Date(video.createdAt).toLocaleDateString()}
            </p>
          </div>
        )}
      </button>

      {showPreview && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={() => setShowPreview(false)}
        >
          <div
            className="relative w-full max-w-[90%] max-h-[90%] md:w-[360px] md:h-auto flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close and Download buttons */}
            <div className="absolute -top-8 right-0 flex items-center gap-3">
              <button
                onClick={handleDownload}
                className="text-white hover:text-white/80 transition-colors flex items-center gap-2"
                aria-label="Download video"
              >
                <Download className="h-5 w-5" />
                <span className="text-sm">Download</span>
              </button>
              <button
                onClick={() => setShowPreview(false)}
                className="text-white hover:text-white/80 transition-colors"
                aria-label="Close preview"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Video container */}
            <div
              className="relative rounded-xl overflow-hidden w-full"
              style={{
                aspectRatio: `${activeTab === "minmax" ? "16/9" : "9/16"}`,
              }}
            >
              <video
                src={video.videoUrl}
                className={` ${
                  activeTab === "minmax" ? "h-full" : "h-3/4"
                } w-full  object-contain rounded-xl`}
                controls
                autoPlay
                playsInline
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
