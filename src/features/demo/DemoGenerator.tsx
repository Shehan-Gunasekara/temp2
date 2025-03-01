import { useState } from "react";
import { DemoPromptInput } from "./DemoPromptInput";
import { DemoPreviewCard } from "./DemoPreviewCard";
import { DemoLipSync } from "./DemoLipSync";
import { GeneratorSteps } from "../generator/components/GeneratorSteps";
import demoAudio from "./asset/demo-audio.mp3";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "../auth/context/LanguageContext";
import { getTranslation } from "../../utils/translations";

// Predefined demo content
const DEMO_CONTENT = {
  generatedVideo:
    "https://v3.fal.media/files/koala/z_E1Fvk3Q-jfbzB2Ebb6M_video-1736493463.mp4",
  lipSyncedVideo:
    "https://res.cloudinary.com/deov2upvz/video/upload/v1736660122/dmiqfqhpnlbkufzkneqj.mov",
  demoAudioUrl: demoAudio,
};

const DemoVideoGenerator = () => {
  const navigate = useNavigate();
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [lipSyncedVideoUrl, setLipSyncedVideoUrl] = useState<string | null>(
    null
  );
  const [videoLoading, setVideoLoading] = useState(false);
  const [isLipSyncing, setIsLipSyncing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [lipSyncComplete, setLipSyncComplete] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [isNoCredits, setIsNoCredits] = useState(false);
  const [audioUrl, setAudioUrl] = useState(demoAudio);
  const [audioObjectUrl, setAudioObjectUrl] = useState<string | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [lipSyncProgress, setLipSyncProgress] = useState(0);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [hasLipSynced, setHasLipSynced] = useState(false);
  const { language } = useLanguage();
  const applyVideoToGeneratedVideo = (url: string | null) => {
    setGeneratedVideo(url);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <DemoPromptInput
            setVideoLoading={setVideoLoading}
            setVideoUrl={(url) => {
              setVideoUrl(url || DEMO_CONTENT.generatedVideo);
              setHasGenerated(true);
            }}
            setGenerationProgress={setGenerationProgress}
          />
        );
      case 2:
        return (
          <div className="space-y-8">
            <DemoLipSync
              videoUrl={generatedVideo || DEMO_CONTENT.generatedVideo}
              setGeneratedVideo={applyVideoToGeneratedVideo}
              setLipSyncedVideoUrl={(url) => {
                setLipSyncedVideoUrl(url || DEMO_CONTENT.lipSyncedVideo);
                setLipSyncComplete(true);
                setHasLipSynced(true);
              }}
              setIsNoCredits={setIsNoCredits}
              audioUrl={DEMO_CONTENT.demoAudioUrl}
              setAudioUrl={setAudioUrl}
              setAudioObjectUrl={setAudioObjectUrl}
              audioObjectUrl={audioObjectUrl}
              setAudioFile={setAudioFile}
              audioFile={audioFile}
              setIsLipSyncing={setIsLipSyncing}
              setLipSyncProgress={setLipSyncProgress}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <main className="flex-1 max-w-7xl mx-auto px-6">
      <div className="pt-28 md:pt-40 pb-0">
        <div className="max-w-3xl mx-auto mb-16 text-center space-y-4 sm:space-y-6">
          <div className="flex flex-col items-center gap-4">
            <span className="px-3 py-1 text-xs font-medium bg-black/5 rounded-full">
              {getTranslation(language, "demo_page.demo")}
            </span>
            <p className="text-xl sm:text-3xl md:text-5xl font-semibold bg-gradient-to-br from-black to-black/60 bg-clip-text text-transparent leading-tight">
              {getTranslation(language, "demo_page.hero_title")}
            </p>
          </div>
          {/* <button
              onClick={() => navigate('/ugc-actor')}
              className="mt-4 inline-flex items-center justify-center px-8 py-3 rounded-full font-medium transition-all duration-200 focus:outline-none bg-black text-white hover:bg-black/90 text-sm sm:text-base"
            > */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-black text-white hover:bg-black/90 inline-flex items-center justify-center rounded-full font-medium transition-all duration-200 focus:outline-none text-[10px] sm:text-sm md:text-lg px-5 sm:px-6 py-2 sm:py-3 relative overflow-hidden group"
            onClick={() => navigate("/ugc-actor")}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 animate-shimmer"
              style={{ backgroundSize: "200% 100%" }}
            />
            <span className="relative z-10">
              {" "}
              {getTranslation(language, "demo_page.start_creating")}
            </span>
            <ArrowRight className="h-5 w-5 ml-2 relative z-10" />
          </motion.button>
          {/* <span className="flex items-center justify-center">
                
                Skip to home
                <ArrowRight className="w-4 h-4 ml-2" />
              </span>
            </button> */}
        </div>

        <GeneratorSteps
          currentStep={currentStep}
          videoGenerated={!!videoUrl}
          lipSyncComplete={lipSyncComplete}
          setCurrentStep={setCurrentStep}
        />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,500px] gap-12">
          <div className="space-y-8">{renderCurrentStep()}</div>
          <div className="lg:sticky lg:top-32 lg:h-fit">
            <DemoPreviewCard
              title={getTranslation(language, "demo_page.output_video")}
              isLoading={currentStep === 1 ? videoLoading : isLipSyncing}
              isInput={false}
              videoUrl={
                currentStep === 1
                  ? hasGenerated && !videoLoading
                    ? DEMO_CONTENT.generatedVideo
                    : null
                  : hasLipSynced && !isLipSyncing
                  ? DEMO_CONTENT.lipSyncedVideo
                  : null
              }
              setVideoUrl={
                lipSyncedVideoUrl ? setLipSyncedVideoUrl : setVideoUrl
              }
              isNoCredits={isNoCredits}
              onLipSyncClick={() => {
                setGeneratedVideo(DEMO_CONTENT.generatedVideo);
                setCurrentStep(2);
                setHasLipSynced(false);
              }}
              currentStep={currentStep}
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default DemoVideoGenerator;
