import { useState, useRef } from "react";
import { PromptTemplates } from "./templates";
import { PromptTextarea } from "./PromptTextarea";
import { PromptSettings } from "./settings";
import { PromptControls } from "./PromptControls";
import { usePromptState } from "../hooks/usePromptState";
import { AlertCircle } from "lucide-react";
import { auth } from "../../../lib/firebase";
import { getIdToken } from "firebase/auth";
import { useAuth } from "../../auth/context/useAuth";
import { GetUser } from "../../../lib/api/user";
import { getTranslation } from "../../../utils/translations";
import { useLanguage } from "../../auth/context/LanguageContext";

interface PromptInputProps {
  setVideoLoading: (loading: boolean) => void;
  setVideoUrl: (url: string | null) => void;
  setIsNoCredits: any;
}

export function PromptInput({
  setVideoLoading,
  setVideoUrl,
  setIsNoCredits,
}: PromptInputProps) {
  const { language } = useLanguage();
  const { prompt, settings, setPrompt, updateSettings } = usePromptState();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const {
    user,
    userData,
    userCredits,
    setUserCredits,
    isEnableEnhanceUGCActor,
  } = useAuth();
  const requestInterval = useRef<NodeJS.Timeout | null>(null);
  const countDown = useRef(0);
  const [currentprogress, setCurrentProgress] = useState(0);
  const [totalprogress, setTotalProgress] = useState(0);

  const generateActor = async () => {
    if (loading) return;
    setError(null);
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
      setLoading(true);
      setVideoLoading(true);
      const userdata = await GetUser(userData.email);
      if (!user) {
        setError(getTranslation(language, "ugc_error.user_credential"));
        setLoading(false);
        setVideoLoading(false);
        return;
      } else {
        if (userdata.isCurrentlyGenerating) {
          setError(getTranslation(language, "ugc_error.one_time_generate"));
          setLoading(false);
          setVideoLoading(false);
          return;
        }

        if (import.meta.env.VITE_SITE_NAMAE == "Synthetic UGC") {
          if (settings.model === "2") {
            if (userdata.credits < 20) {
              setError(getTranslation(language, "ugc_error.not_enough_token"));
              setIsNoCredits(true);
              setLoading(false);
              setVideoLoading(false);
              return;
            }
          } else {
            if (isEnableEnhanceUGCActor) {
              if (userdata.credits < 10) {
                setError(
                  getTranslation(language, "ugc_error.not_enough_token")
                );
                setIsNoCredits(true);
                setLoading(false);
                setVideoLoading(false);
                return;
              }
            } else {
              if (userdata.credits < 8.75) {
                setError(
                  getTranslation(language, "ugc_error.not_enough_token")
                );
                setIsNoCredits(true);
                setLoading(false);
                setVideoLoading(false);
                return;
              }
            }
          }
        } else {
          if (isEnableEnhanceUGCActor) {
            if (userdata.credits < 2) {
              setError(getTranslation(language, "ugc_error.not_enough_token"));
              setIsNoCredits(true);
              setLoading(false);
              setVideoLoading(false);
              return;
            }
          } else {
            if (userdata.credits < 1.75) {
              setError(getTranslation(language, "ugc_error.not_enough_token"));
              setIsNoCredits(true);
              setLoading(false);
              setVideoLoading(false);
              return;
            }
          }
        }
      }

      const isEnableProMode = isEnableEnhanceUGCActor;
      ///////////////////////demo////////////////////////
      if (userData.email === import.meta.env.VITE_DEMO_USER) {
        const res = await fetch(
          `${import.meta.env.VITE_END_POINT_URL}/api/fal/v1/demoUGCGenerate`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(token && { Authorization: token }),
            },

            body: JSON.stringify({
              seeds: settings.seed,
              prompt: prompt,
              pro_mode: isEnableEnhanceUGCActor,
              aspect_ratio: settings.aspectRatio,
              resolution: settings.resolution,
              duration: settings.duration,
              user_email: user.email,
              user_id: userData._id,
            }),
          }
        );
        const data = await res.json();

        if (data) {
          setCurrentProgress(100);
          setTotalProgress(100);
          // setVideoUrl(data.videoUrl);

          requestInterval.current = setInterval(async () => {
            if (countDown.current === 10) {
              countDown.current = 0;
              const token = auth.currentUser
                ? await getIdToken(auth.currentUser)
                : null;
              const res = await fetch(
                `${
                  import.meta.env.VITE_END_POINT_URL
                }/api/fal/v1/generatedVideo`,
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
                  setLoading(false);
                  setVideoLoading(false);
                  if (requestInterval.current) {
                    if (import.meta.env.VITE_SITE_NAMAE == "Synthetic UGC") {
                      if (isEnableProMode) {
                        setUserCredits(userCredits - 10);
                      } else {
                        setUserCredits(userCredits - 8.75);
                      }
                    } else {
                      if (isEnableProMode) {
                        setUserCredits(userCredits - 2);
                      } else {
                        setUserCredits(userCredits - 1.75);
                      }
                    }

                    setLoading(false);
                    setVideoUrl(statusData.outputUrl);
                    clearInterval(requestInterval.current);
                  }
                }
              }
            } else {
              countDown.current += 1;
            }
          }, 1000);
        }

        return;
      }

      ///////////////////////////////////////////////////

      const selectedModelVersion = settings.model;

      const res = await fetch(
        `${import.meta.env.VITE_END_POINT_URL}/api/fal/v1/generate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: token }),
          },
          body: JSON.stringify({
            seed: settings.seed,
            prompt: prompt,
            pro_mode: isEnableEnhanceUGCActor,
            aspect_ratio: settings.aspectRatio,
            resolution: settings.resolution,
            duration: settings.duration,
            user_email: user.email,
            user_id: userData._id,
            version: selectedModelVersion,
          }),
        }
      );

      const data = await res.json();

      if (data) {
        // setVideoUrl(data.videoUrl);
        const duration = settings.duration;
        try {
          const res = await fetch(
            `${import.meta.env.VITE_END_POINT_URL}/api/fal/v1/generatedVideo`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                ...(token && { Authorization: token }),
              },
              body: JSON.stringify({
                request_id: data.requestId,
                duration: duration,
                version: selectedModelVersion,
              }),
            }
          );
          const statusData = await res.json();
          if (statusData) {
            if (statusData.status === "completed") {
              setLoading(false);
              setVideoLoading(false);
              if (requestInterval.current) {
                if (selectedModelVersion === "2") {
                  if (import.meta.env.VITE_SITE_NAMAE == "Synthetic UGC") {
                    setUserCredits(userCredits - 20);
                  } else {
                    setUserCredits(userCredits - 4);
                  }
                } else {
                  if (import.meta.env.VITE_SITE_NAMAE == "Synthetic UGC") {
                    if (isEnableProMode) {
                      setUserCredits(userCredits - 10);
                    } else {
                      setUserCredits(userCredits - 8.75);
                    }
                  } else {
                    if (isEnableProMode) {
                      setUserCredits(userCredits - 2);
                    } else {
                      setUserCredits(userCredits - 1.75);
                    }
                  }
                }

                setLoading(false);
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
            setLoading(false);
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
                }/api/fal/v1/generatedVideo`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    ...(token && { Authorization: token }),
                  },
                  body: JSON.stringify({
                    request_id: data.requestId,
                    duration: duration,
                    version: selectedModelVersion,
                  }),
                }
              );
              const statusData = await res.json();
              if (statusData) {
                if (statusData.status === "completed") {
                  setLoading(false);
                  setVideoLoading(false);
                  if (requestInterval.current) {
                    if (selectedModelVersion === "2") {
                      if (import.meta.env.VITE_SITE_NAMAE == "Synthetic UGC") {
                        setUserCredits(userCredits - 20);
                      } else {
                        setUserCredits(userCredits - 4);
                      }
                    } else {
                      if (import.meta.env.VITE_SITE_NAMAE == "Synthetic UGC") {
                        if (isEnableProMode) {
                          setUserCredits(userCredits - 10);
                        } else {
                          setUserCredits(userCredits - 8.75);
                        }
                      } else {
                        if (isEnableProMode) {
                          setUserCredits(userCredits - 2);
                        } else {
                          setUserCredits(userCredits - 1.75);
                        }
                      }
                    }
                    setLoading(false);
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
                setLoading(false);
              }
            }
          } else {
            countDown.current += 1;
          }
        }, 1000);
      }

      // const response = await axios.post(`${import.meta.env.VITE_END_POINT_URL}/api/fal/v1/generate`, {
      //   prompt: prompt,
      //   pro_mode: settings.enhancedDetail,
      //   aspect_ratio: settings.aspectRatio,
      //   resolution: settings.resolution,
      //   user_email: user.email
      // }, {
      //   headers: {
      //     'Content-Type': 'application/json',
      //   }
      // });
    } catch (err: any) {
      console.error("Generation failed:", err);
      setError(
        err.response?.message ||
          getTranslation(language, "ugc_error.failed_to_generate")
      );
      setLoading(false);
      setVideoLoading(false);
    } finally {
      // setLoading(false);
    }
  };

  return (
    <div className="space-y-12">
      <section className="space-y-6">
        <header>
          <h2 className="text-base sm:text-xl md:text-2xl font-medium mb-2">
            {getTranslation(language, "ugc_actor.ugc_video.head_titile")}
          </h2>
          <p className=" text-xs sm:text-base md:text-lg  text-black/60">
            {getTranslation(language, "ugc_actor.ugc_video.head_description")}
          </p>
        </header>
        <PromptTemplates
          onSelect={(prompt) => {
            setPrompt(prompt);
            document
              .getElementById("prompt-input")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
          selectedPrompt={prompt}
        />
      </section>

      <section id="prompt-input" className="space-y-8 ">
        <PromptTextarea value={prompt} onChange={setPrompt} />
        <PromptSettings settings={settings} onUpdate={updateSettings} />

        {error && (
          <div className="flex items-center p-1 gap-2 rounded-lg text-red-700 text-xs sm:text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}
        <PromptControls
          onClick={generateActor}
          loading={loading}
          currentprogress={currentprogress}
          totalprogress={totalprogress}
        />
      </section>
    </div>
  );
}
