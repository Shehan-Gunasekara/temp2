import { useState, useEffect } from "react";
import { PreviewCard } from "../../../components/preview/PreviewCard";
import { ImagePromptInput } from "../../prompt/components/ImagePromptInput";
import "react-toastify/dist/ReactToastify.css";
import { getTranslation } from "../../../utils/translations";
import { useLanguage } from "../../auth/context/LanguageContext";
import {
  Copy,
  Check,
  ArrowDownCircle,
  Play,
  Volume2,
  VolumeX,
  Info,
} from "lucide-react";

interface SampleVideo {
  id: string;
  url: string;
  prompt: string;
}

const ImageToVideoGenerator = () => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoLoading, setVideoLoading] = useState(false);
  const [isNoCredits, setIsNoCredits] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedPrompt, setExpandedPrompt] = useState<string | null>(null);
  const [mutedStates, setMutedStates] = useState<Record<string, boolean>>({});
  const [isPaused, setIsPaused] = useState<Record<string, boolean>>({});
  const [isHovered, setIsHovered] = useState<Record<string, boolean>>({});

  const { language } = useLanguage();
  const showConsistentActor = import.meta.env.VITE_SHOW_CONSISTENT_ACTOR === "true";
  const sampleVideos = getTranslation(language, "consistent_actor.sampleVideos") as unknown as SampleVideo[];
  const sourceImageUrl =
    "https://res.cloudinary.com/dxozvqmdl/image/upload/v1739129793/template/gcyvoxc3s9ypsvqwwty3.jpg";

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };
  const handleVideoInteraction = (
    videoId: string,
    videoElement: HTMLVideoElement,
    isClick: boolean = false
  ) => {
    if (isClick) {
      if (isPaused[videoId]) {
        videoElement.play().catch((err) => console.error("Play failed:", err));
        setIsPaused((prev) => ({ ...prev, [videoId]: false }));
      } else {
        videoElement.pause();
        setIsPaused((prev) => ({ ...prev, [videoId]: true }));
      }
    }
  };

  const handleMouseEnter = (videoId: string) => {
    setIsHovered((prev) => ({ ...prev, [videoId]: true }));
  };

  const handleMouseLeave = (videoId: string) => {
    setIsHovered((prev) => ({ ...prev, [videoId]: false }));
  };

  const handlePause = (videoId: string) => {
    setIsPaused((prev) => ({ ...prev, [videoId]: true }));
  };

  const handlePlay = (videoId: string) => {
    setIsPaused((prev) => ({ ...prev, [videoId]: false }));
  };

  const toggleMute = (videoId: string) => {
    setMutedStates((prev) => ({
      ...prev,
      [videoId]: !prev[videoId],
    }));
  };

  // Initialize pause states
  useEffect(() => {
    const initialPauseStates: Record<string, boolean> = {};
    sampleVideos.forEach((video) => {
      initialPauseStates[video.id] = true;
    });
    setIsPaused(initialPauseStates);
  }, []);

  return (
    <main className="flex-1  max-w-7xl mx-auto px-6">
      <div className="pt-28 md:pt-40 pb-0">
        <div className="max-w-3xl mx-auto mb-16 text-center space-y-4 sm:space-y-6">
          <p className="text-xl sm:text-3xl md:text-5xl font-semibold bg-gradient-to-br from-black to-black/60 bg-clip-text text-transparent leading-tight">
            {getTranslation(language, "consistent_actor.hero_title")}
          </p>
          <p className="text-base lg:text-xl text-black/60 max-w-2xl mx-auto">
            {getTranslation(language, "consistent_actor.hero_desc")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,500px] gap-12">
          <div className="space-y-8">
            <ImagePromptInput
              setVideoLoading={setVideoLoading}
              setVideoUrl={setVideoUrl}
              setIsNoCredits={setIsNoCredits}
            />
          </div>
          <div className="lg:sticky lg:top-32 lg:h-fit">
            <PreviewCard
              title={getTranslation(language, "consistent_actor.preview_card_title")}
              isLoading={videoLoading}
              isInput={false}
              videoUrl={videoUrl}
              setVideoUrl={setVideoUrl}
              isNoCredits={isNoCredits}
              currentStep={3}
            />
          </div>
        </div>
      </div>

      {showConsistentActor && (
      <div className="py-8 mt-16">
        <div className="max-w-4xl mx-auto text-center mb-8">
          <h1 className="text-3xl font-bold mb-6">
          {getTranslation(language, "consistent_actor.translations.consistent_actor.hero_title")}
          </h1>

          <div className="flex items-center justify-center gap-8 mb-8">
            <div className="relative group cursor-pointer">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-xl transition-transform duration-300 group-hover:scale-105">
                <img
                  src={sourceImageUrl}
                  alt="Source portrait"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -right-4 top-1/2 transform -translate-y-1/2">
                <div className="bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg transition-all duration-300 hover:scale-110 hover:bg-white group">
                  <ArrowDownCircle className="w-5 h-5 text-gray-600 group-hover:text-gray-800 rotate-[-90deg]" />
                </div>
              </div>
              <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
                <Info className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-gray-50 to-white rounded-lg flex-1 max-w-sm shadow-lg text-left">
              <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <span> {getTranslation(language, "consistent_actor.translations.consistent_actor.sub_title")}</span>
                <div className="relative group">
                  <Info className="w-4 h-4 text-gray-400 cursor-help" />
                  <div className="absolute bottom-full right-1/2 transform -translate-x-1/2 mb-2 w-64 p-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  {getTranslation(language, "consistent_actor.translations.consistent_actor.sub_desc")}
                  </div>
                </div>
              </h2>
              <p className="text-sm text-gray-600">
              {getTranslation(language, "consistent_actor.translations.consistent_actor.description")}
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sampleVideos.map((video) => (
              <div
                key={video.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
              >
                <div
                  className="relative w-full pt-[56.25%] bg-gray-900"
                  onMouseEnter={() => handleMouseEnter(video.id)}
                  onMouseLeave={() => handleMouseLeave(video.id)}
                >
                  <video
                    src={video.url}
                    className="absolute top-0 left-0 w-full h-full object-cover cursor-pointer"
                    muted={mutedStates[video.id]}
                    playsInline
                    onClick={(e) =>
                      handleVideoInteraction(video.id, e.currentTarget, true)
                    }
                    onPause={() => handlePause(video.id)}
                    onPlay={() => handlePlay(video.id)}
                  />
                  {isPaused[video.id] && (
                    <div
                      className={`absolute inset-0 flex items-center justify-center bg-black ${
                        isHovered[video.id] ? "bg-opacity-30" : "bg-opacity-40"
                      } transition-opacity duration-200`}
                      onClick={(e) => {
                        const videoElement = e.currentTarget
                          .previousElementSibling as HTMLVideoElement;
                        handleVideoInteraction(video.id, videoElement, true);
                      }}
                    >
                      <div className="rounded-full bg-white bg-opacity-50 p-4 transform transition-transform duration-200 hover:scale-110">
                        <Play className="w-8 h-8 text-gray-900" />
                      </div>
                    </div>
                  )}
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    <button
                      onClick={() => toggleMute(video.id)}
                      className="p-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 transition-all duration-200"
                      title={mutedStates[video.id] ? "Unmute" : "Mute"}
                    >
                      {mutedStates[video.id] ? (
                        <VolumeX className="w-4 h-4 text-white" />
                      ) : (
                        <Volume2 className="w-4 h-4 text-white" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="p-3">
                  <div className="flex items-start gap-2">
                    <div className="flex-1">
                      <p
                        className={`text-sm text-gray-600 ${
                          expandedPrompt === video.id ? "" : "line-clamp-3"
                        } cursor-pointer hover:text-gray-900`}
                        onClick={() =>
                          setExpandedPrompt(
                            expandedPrompt === video.id ? null : video.id
                          )
                        }
                      >
                        {video.prompt}
                      </p>
                      {video.prompt.length > 150 && (
                        <button
                          onClick={() =>
                            setExpandedPrompt(
                              expandedPrompt === video.id ? null : video.id
                            )
                          }
                          className="text-blue-500 text-xs mt-1 hover:text-blue-600"
                        >
                          {expandedPrompt === video.id
                            ? "Show less"
                            : "Read more"}
                        </button>
                      )}
                    </div>
                    <button
                      onClick={() => copyToClipboard(video.prompt, video.id)}
                      className="flex-shrink-0 flex items-center justify-center p-1.5 hover:bg-gray-100 rounded-full transition-colors group relative"
                      title="Copy prompt"
                    >
                      {copiedId === video.id ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-600" />
                      )}
                      <span
                        className={`absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap transition-opacity ${
                          copiedId === video.id ? "opacity-100" : "opacity-0"
                        }`}
                      >
                        {getTranslation(language, "consistent_actor.translations.copy")}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      )}
    </main>
  );
};

export default ImageToVideoGenerator;
