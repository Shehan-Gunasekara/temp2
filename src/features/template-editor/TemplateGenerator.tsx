import React, { useState, useRef, useEffect } from "react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import {
  Loader,
  Music,
  Upload,
  Video,
  Type,
  Bold,
  Italic,
  Download,
  BookTemplate,
} from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "../auth/context/LanguageContext";
import { getTranslation } from "../../utils/translations";
import { IoIosArrowDown } from "react-icons/io";
import { Sparkles, Loader2, AlertCircle, Settings } from "lucide-react";

import { Select } from "../../components/ui/Select";
import { useAuth } from "../auth/context/useAuth";
import { auth } from "../../lib/firebase";
import { getIdToken } from "firebase/auth";
import { GetUser } from "../../lib/api/user";

export function TemplateGenerator({
  setCurrentStep,

  setgeneratedVideoUrl,
  setVideoUrl,
  videoUrl,
}: any) {
  //   const [isLoading, setIsLoading] = useState(false);
  const { language } = useLanguage();

  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [totalProgress, setTotalProgress] = useState(0);
  const [aspectRatio, setAspectRatio] = useState("9:16");
  const [prompt, setPrompt] = useState("");
  const [seed, setSeed] = useState("");
  const [resolution, setResolution] = useState("1080p");
  const [isNoCredits, setIsNoCredits] = useState(false);
  const requestInterval = useRef<NodeJS.Timeout | null>(null);
  const countDown = useRef(0);
  const [currentprogress, setCurrentProgress] = useState(0);
  //   const [totalprogress, setTotalprogress] = useState(0);
  const timer = useRef<NodeJS.Timeout | null>(null);
  const intervalTimer = useRef(1500);

  const {
    user,
    userData,
    userCredits,
    setUserCredits,
    isEnableEnhanceUGCActor,
  } = useAuth();

  const handleCreateTemplate = (e: React.MouseEvent) => {
    setCurrentStep(2);
    setgeneratedVideoUrl(videoUrl);
  };

  useEffect(() => {
    if (
      currentprogress !== undefined &&
      totalProgress !== undefined &&
      totalProgress !== 0
    ) {
      const currentProgressPrecentage = (currentprogress / totalProgress) * 100;
      if (userData.email === import.meta.env.VITE_DEMO_USER) {
        timer.current = setInterval(() => {
          setProgress((prev) => {
            if (prev < currentProgressPrecentage) {
              return prev + 10;
            } else {
              clearInterval(timer.current!);
            }
            return prev;
          });
        }, 1000);
      } else {
        timer.current = setInterval(() => {
          setProgress((prev) => {
            if (prev < currentProgressPrecentage) {
              return prev + 1;
            } else {
              clearInterval(timer.current!);
            }
            return prev;
          });
        }, intervalTimer.current);
      }
    }
    return () => {
      if (timer.current) {
        clearInterval(timer.current);
      }
    };
  }, [currentprogress, totalProgress, isLoading]);

  // Mock function to simulate video generation
  const generateVideo = async () => {
    if (isLoading) return;
    setError(null);
    setProgress(0);
    setTotalProgress(0);
    // setVideoLoading(true);

    try {
      if (!user) {
        setError(getTranslation(language, "ugc_error.signin_error"));
        return;
      }

      if (!prompt) {
        setError(getTranslation(language, "ugc_error.prompt_required"));
        return;
      }

      if (!user) {
        setError(getTranslation(language, "ugc_error.user_credential"));
        return;
      }

      const token = auth.currentUser
        ? await getIdToken(auth.currentUser)
        : null;

      if (!token) {
        setError(getTranslation(language, "ugc_error.user_credential"));
        return;
      }
      setIsLoading(true);
      //   setVideoLoading(true);
      const userdata = await GetUser(userData.email);
      if (!user) {
        setError(getTranslation(language, "ugc_error.user_credential"));
        setIsLoading(false);

        return;
      } else {
        if (userdata.isCurrentlyGenerating) {
          setError(getTranslation(language, "ugc_error.one_time_generate"));
          setIsLoading(false);
          return;
        }

        if (import.meta.env.VITE_SITE_NAMAE == "Synthetic UGC") {
          if (userdata.credits < 8.75) {
            setError(getTranslation(language, "ugc_error.not_enough_token"));
            setIsNoCredits(true);
            setIsLoading(false);

            return;
          }
        } else {
          if (userdata.credits < 1.75) {
            setError(getTranslation(language, "ugc_error.not_enough_token"));
            setIsNoCredits(true);
            setIsLoading(false);

            return;
          }
        }
      }

      const res = await fetch(
        `${import.meta.env.VITE_END_POINT_URL}/api/fal/v1/generateNoneTalking`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: token }),
          },
          body: JSON.stringify({
            seed: seed ? Number(seed) : null,
            prompt: prompt,
            user_email: user.email,
            user_id: userData._id,
          }),
        }
      );

      const data = await res.json();

      if (data) {
        // setVideoUrl(data.videoUrl);

        try {
          const res = await fetch(
            `${
              import.meta.env.VITE_END_POINT_URL
            }/api/fal/v1/getNoneTalkingGeneratedVideo`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                ...(token && { Authorization: token }),
              },
              body: JSON.stringify({
                request_id: data.requestId,
              }),
            }
          );
          const statusData = await res.json();
          if (statusData) {
            if (statusData.status === "completed") {
              setIsLoading(false);

              if (requestInterval.current) {
                if (import.meta.env.VITE_SITE_NAMAE == "Synthetic UGC") {
                  setUserCredits(userCredits - 8.75);
                } else {
                  setUserCredits(userCredits - 1.75);
                }

                setIsLoading(false);
                setVideoUrl(statusData.outputUrl);
                clearInterval(requestInterval.current);
              }
            } else {
              setCurrentProgress(statusData.progress.currentprogress);
              setTotalProgress(statusData.progress.totalprogress);
            }
          }
        } catch (err) {
          console.error("Error in fetch", err);
          if (requestInterval.current) {
            clearInterval(requestInterval.current);

            setError(getTranslation(language, "ugc_error.failed_to_generate"));
            setIsLoading(false);
          }
        }
        console.debug("data----------------", data);
        requestInterval.current = setInterval(async () => {
          if (countDown.current === 75) {
            try {
              countDown.current = 0;
              const token = auth.currentUser
                ? await getIdToken(auth.currentUser)
                : null;
              const res = await fetch(
                `${
                  import.meta.env.VITE_END_POINT_URL
                }/api/fal/v1/getNoneTalkingGeneratedVideo`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    ...(token && { Authorization: token }),
                  },
                  body: JSON.stringify({
                    request_id: data.requestId,
                  }),
                }
              );
              const statusData = await res.json();
              if (statusData) {
                if (statusData.status === "completed") {
                  setIsLoading(false);

                  if (requestInterval.current) {
                    if (import.meta.env.VITE_SITE_NAMAE == "Synthetic UGC") {
                      setUserCredits(userCredits - 8.75);
                    } else {
                      setUserCredits(userCredits - 1.75);
                    }

                    setIsLoading(false);
                    setVideoUrl(statusData.outputUrl);
                    clearInterval(requestInterval.current);
                  }
                } else {
                  setCurrentProgress(statusData.progress.currentprogress);
                  setTotalProgress(statusData.progress.totalprogress);
                }
              }
            } catch (err) {
              console.error("Error in fetch", err);
              if (requestInterval.current) {
                clearInterval(requestInterval.current);

                setError(
                  getTranslation(language, "ugc_error.failed_to_generate")
                );
                setIsLoading(false);
              }
            }
          } else {
            countDown.current += 1;
          }
        }, 1000);
      }
    } catch (err: any) {
      console.error("Generation failed:", err);
      setError(
        err.response?.message ||
          getTranslation(language, "ugc_error.failed_to_generate")
      );
      setIsLoading(false);
    } finally {
      // setLoading(false);
    }
  };

  const getAspectRatioStyle = () => {
    if (aspectRatio === "9:16") {
      return { aspectRatio: "9/16" };
    } else if (aspectRatio === "16:9") {
      return { aspectRatio: "16/9" };
    } else if (aspectRatio === "1:1") {
      return { aspectRatio: "1/1" };
    }
    return { aspectRatio: "9/16" }; // Default
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };
  const handlePurchase = (e: React.MouseEvent) => {
    e.preventDefault();
    window.history.pushState({}, "", "/purchase");
    window.dispatchEvent(new PopStateEvent("popstate"));
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-white to-black/5 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr,600px] gap-8">
          {/* Main Content */}
          <div className="space-y-6">
            {/* Text Input */}
            <div className="space-y-2">
              <label
                htmlFor="prompt"
                className="block text-sm font-medium text-gray-700"
              >
                Describe your video
              </label>

              <Input
                id="prompt"
                multiline
                rows={4}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe what you want to see in your video..."
                className="text-base shadow-md"
              />
            </div>

            {/* Settings Card */}
            <Card className="overflow-hidden">
              <div className="px-6 py-4 border-b border-black/5 flex items-center space-x-3">
                <Settings className="h-5 w-5 text-black/40" />
                <h3 className="font-medium text-sm sm:text-base">
                  Video Settings
                </h3>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input
                    type="number"
                    label="Seed"
                    placeholder="Random"
                    min={0}
                    max={999999}
                    onChange={(e) => setSeed(e.target.value)}
                  />
                  <Select
                    label="Aspect Ratio"
                    value={aspectRatio}
                    onChange={(e) => setAspectRatio(e.target.value)}
                    options={[{ value: "9:16", label: "9:16 Portrait" }]}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Select
                    label="Resolution"
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                    options={[{ value: "1080p", label: "1080p" }]}
                  />
                </div>
              </div>
              {error && (
                <div className="p-4 text-sm sm:text-xs text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              {/* Generate Button and Progress */}
              <div className="p-6 pt-10 space-y-4">
                <Button
                  onClick={generateVideo}
                  disabled={isLoading}
                  className="w-full py-3"
                >
                  {totalProgress === 0 && isLoading ? (
                    <>
                      <Sparkles className="h-5 w-5 mr-2" />
                      Hang tight, your request is on its way!
                    </>
                  ) : (
                    <>
                      {isLoading ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          {Math.round(progress)}%
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-5 w-5 mr-2" />
                          Generate Video
                        </>
                      )}
                    </>
                  )}
                </Button>
                <p className="flex items-center p-1 gap-2 rounded-lg text-gray-700 sm:text-xs text-[10px]">
                  {getTranslation(
                    language,
                    "ugc_actor.cost_estimation.ugc_video.cs1"
                  )}{" "}
                  {/* {import.meta.env.VITE_CURRENCY} */}
                  {/* {isEnableEnhanceUGCActor ? "1.15" : "0.90"} credits{" "} */}
                  {import.meta.env.VITE_SITE_NAMAE == "Synthetic UGC"
                    ? "4.50"
                    : "0.90"}{" "}
                  {getTranslation(
                    language,
                    "ugc_actor.cost_estimation.ugc_video.cs2"
                  )}{" "}
                  {/* {import.meta.env.VITE_CURRENCY} */}
                  {import.meta.env.VITE_SITE_NAMAE == "Synthetic UGC"
                    ? " 8.75 credits,"
                    : " 1.75 credits,"}
                  {getTranslation(
                    language,
                    "ugc_actor.cost_estimation.ugc_video.cs3"
                  )}{" "}
                  {/* {import.meta.env.VITE_CURRENCY} */}
                  100 credits,
                  {getTranslation(
                    language,
                    "ugc_actor.cost_estimation.ugc_video.cs4"
                  )}{" "}
                  {import.meta.env.VITE_SITE_NAMAE == "Synthetic UGC"
                    ? "11"
                    : "5"}{" "}
                  {getTranslation(
                    language,
                    "ugc_actor.cost_estimation.ugc_video.cs5"
                  )}
                </p>
                {isLoading && (
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-black transition-all duration-300 ease-out rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}
              </div>
            </Card>
          </div>
          {/* Preview Card */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Preview</h2>
              <div className="relative w-full mb-6">
                <div
                  className="relative w-full overflow-hidden cursor-pointer rounded-lg bg-black/5 flex items-center justify-center"
                  style={{
                    ...getAspectRatioStyle(),
                    maxHeight: "70vh",
                    margin: "0 auto",
                  }}
                  onClick={togglePlayPause}
                >
                  {isNoCredits ? (
                    <>
                      {" "}
                      <div className="flex flex-col items-left p-1 gap-2 rounded-lg">
                        <div className=" text-red-700 sm:text-[15px] text-sm font-semibold flex flex-row items-center gap-2">
                          <AlertCircle className="w-4 h-4 flex-shrink-0" />{" "}
                          <p>
                            {" "}
                            {getTranslation(
                              language,
                              "ugc_actor.video_preview.no_credits"
                            )}
                          </p>
                        </div>
                        <div className="text-gray-600 sm:text-xs text-[11px]">
                          {getTranslation(
                            language,
                            "ugc_actor.video_preview.no_credits_desc"
                          )}
                        </div>
                        <div>
                          <button
                            className="px-2 py-1 sm:text-xs text-sm border border-black   font-semibold mt-2"
                            onClick={handlePurchase}
                          >
                            {getTranslation(
                              language,
                              "ugc_actor.video_preview.add_credits"
                            )}
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {videoUrl ? (
                        <div className=" flex flex-col ">
                          <div
                            className=" flex flex-col max-h-[70vh]"
                            style={{
                              ...getAspectRatioStyle(),
                              maxWidth: "600px",
                              margin: "0 auto",
                            }}
                          >
                            <video
                              ref={videoRef}
                              src={videoUrl}
                              controls
                              crossOrigin="anonymous"
                              className="w-full h-full object-contain rounded-lg "
                              muted
                              autoPlay
                              loop
                            />
                          </div>{" "}
                        </div>
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                          <Video className="w-12 h-12 text-black/30 mb-4" />
                          <p className="text-black/50 text-sm font-medium">
                            Generate a video to see preview
                          </p>
                          <p className="text-black/40 text-xs mt-2">
                            Your video will appear here after generation
                          </p>
                        </div>
                      )}
                    </>
                  )}{" "}
                </div>
              </div>{" "}
              <div className=" border-t flex justify-between items-center">
                <Button
                  //   onClick={handleDownload}
                  variant="secondary"
                  className="flex items-center gap-2 sm:text-sm text-[8px]"
                >
                  <Download className="sm:w-4 w-3 sm:h-4 h-3" />
                  {getTranslation(language, "ugc_actor.ugc_video.download")}
                </Button>

                <Button
                  onClick={handleCreateTemplate}
                  variant="secondary"
                  className="flex items-center gap-2  sm:text-sm text-[8px]"
                >
                  <BookTemplate className="sm:w-4 w-3 sm:h-4 h-3" />
                  create template
                </Button>
              </div>
            </Card>{" "}
          </div>{" "}
        </div>
      </div>
    </div>
  );
}
