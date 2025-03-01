import { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { PromptInput } from "../../prompt/components/PromptInput";
import { PreviewCard } from "../../../components/preview/PreviewCard";
import { LipSyncInput } from "../../lipsync/components/LipSyncInput";
import { GeneratorSteps } from "./GeneratorSteps";
import { ToastContainer } from "react-toastify";
import { WideFeatureNotice } from "./WideFeatureNotice";
import { useLanguage } from "../../auth/context/LanguageContext";
import { getTranslation } from "../../../utils/translations";

const VideoGenerator = () => {
  const { language } = useLanguage();
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
  const [audioUrl, setAudioUrl] = useState("");
  const [audioObjectUrl, setAudioObjectUrl] = useState<string | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [showFeatureNotice, setShowFeatureNotice] = useState(true);
  const [selectedOption, setSelectedOption] = useState<"generate" | "select">(
    "generate"
  );

  // Check URL parameters for video and step
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const stepParam = params.get("step");
    const videoParam = params.get("video");

    if (videoParam) {
      const decodedVideoUrl = decodeURIComponent(videoParam);
      setVideoUrl(decodedVideoUrl);
      setGeneratedVideo(decodedVideoUrl);
    }

    if (stepParam) {
      setCurrentStep(parseInt(stepParam));
    }
  }, []);

  const handleMethodSelect = (method: "generate" | "select") => {
    setSelectedOption(method);
    if (method === "select") {
      window.history.pushState({}, "", "/ai-gallery");
      window.dispatchEvent(new PopStateEvent("popstate"));
    }
  };

  const handleCloseNotice = () => {
    setShowFeatureNotice(false);
  };

  const handleTryIt = () => {
    window.history.pushState({}, "", "/template-editor");
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PromptInput
            setVideoLoading={setVideoLoading}
            setVideoUrl={setVideoUrl}
            setIsNoCredits={setIsNoCredits}
          />
        );
      case 2:
        return (
          // <div className="space-y-8">
          <LipSyncInput
            videoUrl={generatedVideo}
            setGeneratedVideo={setGeneratedVideo}
            setLipSyncedVideoUrl={setLipSyncedVideoUrl}
            setIsNoCredits={setIsNoCredits}
            audioUrl={audioUrl}
            setAudioUrl={setAudioUrl}
            setAudioObjectUrl={setAudioObjectUrl}
            audioObjectUrl={audioObjectUrl}
            setAudioFile={setAudioFile}
            audioFile={audioFile}
          />
          // </div>
        );
      default:
        return null;
    }
  };

  return (
    <main className="flex-1 max-w-7xl mx-auto px-6">
      <div className="pt-28 md:pt-40 pb-0">
        <div className="max-w-3xl mx-auto mb-16 text-center space-y-4 sm:space-y-6">
          {showFeatureNotice && (
            <WideFeatureNotice
              onClose={handleCloseNotice}
              onTryIt={handleTryIt}
            />
          )}
          <p className="text-xl sm:text-3xl md:text-5xl font-semibold bg-gradient-to-br from-black to-black/60 bg-clip-text text-transparent leading-tight">
            {getTranslation(language, "ugc_actor.hero_title")}
          </p>
          <p className="text-base lg:text-xl text-black/60 max-w-2xl mx-auto">
            {getTranslation(language, "ugc_actor.hero_desc")}
          </p>
        </div>

        <GeneratorSteps
          currentStep={currentStep}
          videoGenerated={!!videoUrl}
          lipSyncComplete={lipSyncComplete}
          setCurrentStep={setCurrentStep}
          selectedOption={selectedOption}
          onOptionSelect={handleMethodSelect}
        />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,500px] gap-12">
          <div className="space-y-8">{renderCurrentStep()}</div>
          <div className="lg:sticky lg:top-32 lg:h-fit">
            <PreviewCard
              title={getTranslation(
                language,
                "ugc_actor.ugc_video.output_video"
              )}
              isLoading={currentStep == 1 ? videoLoading : isLipSyncing}
              isInput={false}
              videoUrl={currentStep == 1 ? videoUrl : lipSyncedVideoUrl}
              setVideoUrl={
                lipSyncedVideoUrl ? setLipSyncedVideoUrl : setVideoUrl
              }
              isNoCredits={isNoCredits}
              onLipSyncClick={() => {
                setGeneratedVideo(videoUrl);
                setCurrentStep(2);
              }}
              currentStep={currentStep}
            />
          </div>
        </div>
      </div>
      <ToastContainer />
    </main>
  );
};

export default VideoGenerator;
