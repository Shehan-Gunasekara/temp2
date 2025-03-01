import React, { useState, useEffect, useRef } from "react";
import { DemoTextArea } from "./DemoTextArea";
import { DemoSettings } from "./DemoSettings";
import { PromptControls } from "../prompt/components/PromptControls";
import { usePromptState } from "../prompt/hooks/usePromptState";
import { AlertCircle } from "lucide-react";
import { DemoControls } from "./DemoControls";
import { useLanguage } from "../auth/context/LanguageContext";
import { getTranslation } from "../../utils/translations";

interface PromptInputProps {
  setVideoLoading: (loading: boolean) => void;
  setVideoUrl: (url: string | null) => void;
  setGenerationProgress?: (progress: number) => void;
}

export function DemoPromptInput({
  setVideoLoading,
  setVideoUrl,
  setGenerationProgress,
}: PromptInputProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentprogress, setCurrentProgress] = useState(0);
  const [totalprogress, setTotalProgress] = useState(0);
  const { language } = useLanguage();
  const generateActor = async () => {
    setError(null);
    setVideoLoading(true);
    setLoading(true);
    setCurrentProgress(0);
    setTotalProgress(0);
    setVideoUrl(null); // Reset video URL during loading

    // Simulate generation process
    const stages = [
      // { duration: 1000, progress: 20 },  // Initializing
      // { duration: 2000, progress: 60 },  // Generating
      // { duration: 1500, progress: 90 },  // Processing
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
        setCurrentProgress(Math.round(stageProgress));
        setTotalProgress(Math.round(stageProgress));
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
    }

    // Small delay before showing the final video
    await new Promise((resolve) => setTimeout(resolve, 500));

    setVideoUrl(
      "https://v3.fal.media/files/koala/z_E1Fvk3Q-jfbzB2Ebb6M_video-1736493463.mp4"
    );
    setVideoLoading(false);
    setLoading(false);
  };

  return (
    <div className="space-y-12">
      <section id="prompt-input" className="space-y-8">
        <DemoTextArea
          value={getTranslation(language, "demo_page.input_placeholder")}
        />
        <DemoSettings />

        {error && (
          <div className="flex items-center p-1 gap-2 rounded-lg text-red-700 text-xs sm:text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}
        <DemoControls
          onClick={generateActor}
          loading={loading}
          currentprogress={currentprogress}
          totalprogress={totalprogress}
        />
      </section>
    </div>
  );
}
