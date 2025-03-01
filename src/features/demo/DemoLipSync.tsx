import React, { useState, useEffect, useRef } from "react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import {
  Upload,
  Music2,
  Link as LinkIcon,
  X,
  Video,
  AlertCircle,
  Mic,
} from "lucide-react";
import { DemoPreviewCard } from "./DemoPreviewCard";
import { Sparkles, Loader2 } from "lucide-react";
import { Info } from "lucide-react";
import { AudioPlayer } from "../lipsync/components/AudioPlayer";
import { useLanguage } from "../auth/context/LanguageContext";
import { getTranslation } from "../../utils/translations";

interface DemoLipSyncProps {
  videoUrl: string | null;
  setGeneratedVideo: (url: string | null) => void;

  setLipSyncedVideoUrl: (url: string | null) => void;
  setIsNoCredits: any;
  audioUrl: string;
  setAudioUrl: (url: string) => void;
  setAudioObjectUrl: (url: string | null) => void;
  audioObjectUrl: string | null;
  setAudioFile: (file: File | null) => void;
  audioFile: File | null;
  setIsLipSyncing?: (isLoading: boolean) => void;
  setLipSyncProgress?: (progress: number) => void;
}

type InputMethod = "upload" | "record" | "url";

export function DemoLipSync({
  videoUrl,
  setGeneratedVideo,
  setLipSyncedVideoUrl,
  audioUrl,
  setAudioUrl,
  setAudioObjectUrl,
  audioObjectUrl,
  setAudioFile,
  audioFile,
  setIsLipSyncing,
  setLipSyncProgress,
}: DemoLipSyncProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [error, setError] = useState<string | null>(null);
  const [currentprogress, setCurrentProgress] = useState(0);
  const [totalprogress, setTotalProgress] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const tooltipRef = useRef(null);
  const infoButtonRef = useRef(null);
  const { language } = useLanguage();
  const generateLipSync = async () => {
    setLoading(true);
    setIsLipSyncing?.(true);
    setError(null);

    // Reset progress and video
    setProgress(0);
    setCurrentProgress(0);
    setTotalProgress(0);
    setLipSyncedVideoUrl(null); // Reset video URL during loading

    // Simulate lip sync processing
    const stages = [
      // { duration: 1500, progress: 25 },  // Analyzing audio
      // { duration: 2000, progress: 60 },  // Processing frames
      // { duration: 2000, progress: 90 },  // Synchronizing
      { duration: 3000, progress: 100 }, // Finalizing
    ];

    for (const stage of stages) {
      const startTime = Date.now();
      while (Date.now() - startTime < stage.duration) {
        const elapsed = Date.now() - startTime;
        const stageProgress = Math.min(
          100,
          (elapsed / stage.duration) * stage.progress
        );
        const progress = Math.round(stageProgress);

        setProgress(progress);
        setCurrentProgress(progress);
        setTotalProgress(progress);

        await new Promise((resolve) => setTimeout(resolve, 50));
      }
    }

    // Small delay before showing the final video
    await new Promise((resolve) => setTimeout(resolve, 500));

    setLipSyncedVideoUrl(
      "https://res.cloudinary.com/deov2upvz/video/upload/v1736660122/dmiqfqhpnlbkufzkneqj.mov"
    );
    setLoading(false);
    setIsLipSyncing?.(false);
  };

  return (
    <Card className="py-6 px-2 sm:p-6 space-y-6 mx-0 sm:mx-14 sm:min-w-[570px]">
      <div className="flex items-center justify-between">
        <h2 className="text-base lg:text-xl font-medium">
          {" "}
          {getTranslation(language, "demo_page.lip_sync")}
        </h2>
        <p className="sm:text-sm text-xs text-black/60">
          {getTranslation(language, "demo_page.step_2")}
        </p>
      </div>

      <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center gap-4">
          <AudioPlayer audioUrl={audioUrl} />
          <div>
            <p className="text-[10px] sm:text-sm font-medium text-gray-900">
              {getTranslation(language, "demo_page.demo_audio")}
            </p>
            <p className="text-[10px] sm:text-sm text-gray-500">2.5 MB</p>
          </div>
        </div>
      </div>

      <div className="text-[10px] sm:text-xs text-gray-500">
        {getTranslation(language, "demo_page.preview_audio")}
      </div>

      {videoUrl ? (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-base lg:text-xl font-medium">
              {" "}
              {getTranslation(language, "demo_page.input_video")}
            </h2>
          </div>
          <DemoPreviewCard
            currentStep={currentStep}
            title={""}
            isInput={true}
            videoUrl={videoUrl}
            setVideoUrl={setGeneratedVideo}
            isNoCredits={false}
            onLipSyncClick={() => setCurrentStep(2)}
            removeVideo={() => setGeneratedVideo("")}
          />
        </>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-base lg:text-xl font-medium">
              {" "}
              {getTranslation(language, "demo_page.input_video")}
            </h2>
          </div>
          <div className="space-y-4">
            <label className="flex flex-col items-center justify-center gap-4 p-8 border-2 border-dashed rounded-lg">
              <Video className="sm:w-8 w-6 sm:h-8 h-6 text-gray-400" />
              <div className="text-center">
                <p className="sm:text-sm text-xs font-medium text-gray-600">
                  {getTranslation(language, "demo_page.demo_video_use")}
                </p>
                <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
                  {getTranslation(language, "demo_page.preview_demo_video")}
                </p>
              </div>
            </label>
          </div>
        </>
      )}

      <div className="flex flex-col gap-2">
        <div className="flex flex-row gap-6 mb-10">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                {" "}
                {getTranslation(language, "demo_page.enhace_lipsync")}
              </span>
              <div
                className="inline-block"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  ref={infoButtonRef}
                  className="text-gray-400 hover:text-gray-300 focus:outline-none"
                  aria-label="Show information about Enhanced Lipsync"
                >
                  <Info size={16} />
                </button>
              </div>
            </div>

            {showInfo && (
              <div
                ref={tooltipRef}
                className="absolute mt-[-80px] sm:mt-[-40px] sm:ml-[150px] z-10 p-3 bg-gray-800 rounded-lg shadow-lg text-xs max-w-xs text-gray-200"
                onClick={(e) => e.stopPropagation()}
              >
                {getTranslation(language, "demo_page.enhace_lipsync_info")}
                <div className="absolute -top-2 left-4 w-0 h-0 border-8 border-transparent border-b-gray-800" />
              </div>
            )}

            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" value="" className="sr-only peer" />
              <div className="relative w-[52px] h-7 rounded-full peer bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-purple-500"></div>
            </label>
          </div>
        </div>
        {error && (
          <div className="flex items-center p-1 gap-2 rounded-lg text-red-700 text-xs sm:text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}
        <button
          onClick={() => {
            generateLipSync();
          }}
          disabled={loading}
          className="relative px-8 min-w-[180px] inline-flex items-center justify-center rounded-full font-medium transition-all duration-200 focus:outline-none bg-black text-white hover:bg-black/90 disabled:cursor-not-allowed text-xs sm:text-sm md:text-lg px-5 sm:px-6 py-3 sm:py-4 overflow-hidden"
        >
          {loading && (
            <div
              className="absolute left-0 top-0 h-full bg-white bg-opacity-50 transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            />
          )}
          <span className="relative z-10 flex items-center justify-center">
            {totalprogress === 0 && loading ? (
              <>
                <Sparkles className="h-5 w-5 mr-2" />
                {getTranslation(language, "demo_page.hang_tight")}
              </>
            ) : (
              <>
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    {Math.round(progress)}%
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    {getTranslation(language, "demo_page.start_lips_sync")}
                  </>
                )}
              </>
            )}
          </span>
        </button>
      </div>
    </Card>
  );
}
