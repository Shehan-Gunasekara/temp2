import { useState, useRef, useEffect } from "react";
import {
  // Settings,
  // Pointer,
  // RefreshCw,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";
import { Sparkles, Loader2 } from "lucide-react";
import { AlertCircle } from "lucide-react";
import { useAuth } from "../../auth/context/useAuth";
// import { FaLightbulb } from "react-icons/fa";
import { getIdToken } from "firebase/auth";
import { auth } from "../../../lib/firebase";
import { FaCircleInfo } from "react-icons/fa6";
import { GetUser } from "../../../lib/api/user";
import { useLanguage } from "../../auth/context/LanguageContext";
import { getTranslation } from "../../../utils/translations";

interface ImagePromptInputProps {
  setVideoLoading: (loading: boolean) => void;
  setVideoUrl: (url: string | null) => void;
  setIsNoCredits: (noCredits: boolean) => void;
}

export function ImagePromptInput({
  setVideoLoading,
  setVideoUrl,
  setIsNoCredits,
}: ImagePromptInputProps) {
  // const [showSettings, setShowSettings] = useState(false);
  const [prompt, setPrompt] = useState("");
  // const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [totalprogress, setTotalProgress] = useState(0);
  const [currentprogress, setCurrentProgress] = useState(0);
  const { language } = useLanguage();
  const {
    user,
    userData,
    userCredits,
    setUserCredits,
    // setIsFetchUser,
    // isFetchUser,
    // isEnableEnhanceLipSync,
    // setIsEnableEnhanceLipSync,
  } = useAuth();
  const requestInterval = useRef<NodeJS.Timeout | null>(null);
  const countDown = useRef(0);
  const intervalTimer = useRef(2000);
  const timer = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (
      currentprogress !== undefined &&
      totalprogress !== undefined &&
      totalprogress !== 0
    ) {
      const currentProgressPrecentage = (currentprogress / totalprogress) * 100;
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
  }, [currentprogress, totalprogress, loading]);

  const generateImageToVideo = async () => {
    if (loading) return;
    setError(null);
    setProgress(0);
    setTotalProgress(0);

    try {
      if (!user) {
        setError(getTranslation(language, "consistent_error.signin_error"));
        return;
      }

      if (uploadedImageUrl === "" || uploadedImageUrl === null) {
        setError(getTranslation(language, "consistent_error.image_required"));
        return;
      }
      if (prompt === null || prompt === "") {
        setError(getTranslation(language, "consistent_error.prompt_required"));
        return;
      }

      if (!user) {
        setError(getTranslation(language, "consistent_error.user_credential"));
        return;
      }

      const token = auth.currentUser
        ? await getIdToken(auth.currentUser)
        : null;

      if (!token) {
        setError(getTranslation(language, "consistent_error.user_credential"));
        return;
      }
      setLoading(true);
      setVideoLoading(true);

      const userdata = await GetUser(userData.email);
      if (!user) {
        setError(getTranslation(language, "consistent_error.user_credential"));
        setLoading(false);
        setVideoLoading(false);
        return;
      } else {
        if (userdata.isCurrentlyGenerating) {
          setError(
            getTranslation(language, "consistent_error.one_time_generate")
          );
          setLoading(false);
          setVideoLoading(false);
          return;
        }

        if (import.meta.env.VITE_SITE_NAMAE == "Synthetic UGC") {
          if (userdata.credits < 10) {
            setIsNoCredits(true);
            setError(
              getTranslation(language, "consistent_error.not_enough_token")
            );
            return;
          }
        } else {
          if (userdata.credits < 2) {
            setIsNoCredits(true);
            setError(
              getTranslation(language, "consistent_error.not_enough_token")
            );
            return;
          }
        }
      }
      ///////////////////////demo/////////////////////////
      // if (userData.email === import.meta.env.VITE_DEMO_USER) {
      //   const res = await fetch(
      //     `${
      //       import.meta.env.VITE_END_POINT_URL
      //     }/api/fal/v1/demoLypSyncGenerate`,
      //     {
      //       method: "POST",
      //       headers: {
      //         "Content-Type": "application/json",
      //         ...(token && { Authorization: token }),
      //       },
      //       body: JSON.stringify({
      //         video_url: videoUrl,
      //         audio_url: audioUrl,
      //         user_id: userData._id,
      //         audio_duraraion: audioDuration,
      //         lipSyncModel: lipSyncModel,
      //       }),
      //     }
      //   );
      //   const data = await res.json();
      //   console.debug("demo-------------", data);

      //   if (data) {
      //     setCurrentProgress(100);
      //     setTotalProgress(100);
      //     // setVideoUrl(data.videoUrl);
      //     requestInterval.current = setInterval(async () => {
      //       if (countDown.current === 10) {
      //         countDown.current = 0;
      //         const token = auth.currentUser
      //           ? await getIdToken(auth.currentUser)
      //           : null;
      //         const res = await fetch(
      //           `${
      //             import.meta.env.VITE_END_POINT_URL
      //           }/api/fal/v1/lipsyncGeneratedVideo`,
      //           {
      //             method: "POST",
      //             headers: {
      //               "Content-Type": "application/json",
      //               ...(token && { Authorization: token }),
      //             },
      //             body: JSON.stringify({
      //               request_id: data.requestId,
      //             }),
      //           }
      //         );
      //         const statusData = await res.json();
      //         if (statusData) {
      //           if (statusData.status === "completed") {
      //             setLoading(false);

      //             if (requestInterval.current) {
      //               if (isEnableEnhanceLipSync) {
      //                 setUserCredits(userCredits - 3);
      //               } else {
      //                 setUserCredits(userCredits - 2.35);
      //               }

      //               setLoading(false);
      //               setLipSyncedVideoUrl(statusData.outputUrl);
      //               clearInterval(requestInterval.current);
      //             }
      //           }
      //         }
      //       } else {
      //         countDown.current += 1;
      //       }
      //     }, 1000);
      //   }

      //   return;
      // }

      ///////////////////////////////////////////////////

      const res = await fetch(
        `${import.meta.env.VITE_END_POINT_URL}/api/fal/v1/imageToVideo`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: token }),
          },
          body: JSON.stringify({
            prompt: prompt,
            img_url: uploadedImageUrl,
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
            }/api/fal/v1/getImageToVideoResaults`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                ...(token && { Authorization: token }),
              },
              body: JSON.stringify({
                requestId: data.request_id,
              }),
            }
          );
          const statusData = await res.json();
          if (statusData.error) {
            if (requestInterval.current) {
              clearInterval(requestInterval.current);
            }
            setError(statusData.error);
            setLoading(false);
            setVideoLoading(false);
            return;
          }

          if (statusData) {
            if (statusData.status === "completed") {
              setLoading(false);
              setVideoLoading(false);
              if (requestInterval.current) {
                if (import.meta.env.VITE_SITE_NAMAE == "Synthetic UGC") {
                  setUserCredits(userCredits - 10);
                } else {
                  setUserCredits(userCredits - 2);
                }

                setLoading(false);
                setVideoLoading(false);
                setVideoUrl(statusData.outputUrl);
                clearInterval(requestInterval.current);
              }
              return;
            } else {
              setCurrentProgress(statusData.progress.currentprogress);
              setTotalProgress(statusData.progress.totalprogress);
            }
          }
        } catch (err) {
          console.error("Error in fetch", err);
          if (requestInterval.current) {
            clearInterval(requestInterval.current);
            if (err instanceof Error) {
              if (err instanceof Error) {
                setError(err.message);
              } else {
                setError(
                  getTranslation(language, "consistent_error.error_occured")
                );
              }
            } else {
              setError(
                getTranslation(language, "consistent_error.error_occured")
              );
            }
            setLoading(false);
            setVideoLoading(false);
          }
          return;
        }
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
                }/api/fal/v1/getImageToVideoResaults`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    ...(token && { Authorization: token }),
                  },
                  body: JSON.stringify({
                    requestId: data.request_id,
                  }),
                }
              );
              const statusData = await res.json();
              if (statusData.error) {
                if (requestInterval.current) {
                  clearInterval(requestInterval.current);
                  setError(statusData.error);
                  setLoading(false);
                  setVideoLoading(false);
                }
                return;
              }

              if (statusData) {
                if (statusData.status === "completed") {
                  setLoading(false);
                  setVideoLoading(false);
                  if (requestInterval.current) {
                    if (import.meta.env.VITE_SITE_NAMAE == "Synthetic UGC") {
                      setUserCredits(userCredits - 10);
                    } else {
                      setUserCredits(userCredits - 2);
                    }
                    setLoading(false);
                    setVideoLoading(false);
                    setVideoUrl(statusData.outputUrl);
                    clearInterval(requestInterval.current);
                    if (timer.current) {
                      clearInterval(timer.current);
                    }
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
                if (err instanceof Error) {
                  if (err instanceof Error) {
                    setError(err.message);
                  } else {
                    setError(
                      getTranslation(language, "consistent_error.error_occured")
                    );
                  }
                }
                setLoading(false);
                setVideoLoading(false);
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
          getTranslation(language, "consistent_error.failed_to_generate")
      );
      setLoading(false);
      setVideoLoading(false);
    } finally {
      // setLoading(false);
    }
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setError(null);

      const validImageTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!validImageTypes.includes(file.type)) {
        console.error("Invalid file type. Please upload an image.");
        setError(getTranslation(language, "consistent_error.invalid_img"));
        return;
      }
      const maxFileSize = 10 * 1024 * 1024;
      if (file.size > maxFileSize) {
        console.error(
          "File is too large. Please upload a file smaller than 10MB."
        );
        setError(getTranslation(language, "consistent_error.file_too_large"));
        return;
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        `${import.meta.env.VITE_CLOUDINARY_PRESET}`
      ); // Replace with your preset name

      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${
            import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
          }/auto/upload`, // Replace with your cloud name
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await response.json();

        if (data.secure_url) {
          setUploadedImageUrl(data.secure_url);
        }

        // setSelectedImage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        // setIsUploadingAudio(false);
        console.error(`Error uploading to Cloudinary:`, error);
        throw error;
      }
    }
  };

  // const handleGenerate = async () => {
  //   if (!selectedImage) {
  //     alert("Please upload an image first");
  //     return;
  //   }

  //   setVideoLoading(true);
  //   try {
  //     // TODO: Implement API call to generate video from image
  //     // For now, just simulate a delay
  //     await new Promise((resolve) => setTimeout(resolve, 2000));
  //     setVideoUrl("https://example.com/video.mp4"); // Replace with actual API response
  //   } catch (error) {
  //     console.error("Error generating video:", error);
  //     setIsNoCredits(true);
  //   } finally {
  //     setVideoLoading(false);
  //   }
  // };

  // const handleReset = () => {
  //   setPrompt("");
  //   setSelectedImage(null);
  //   setImagePreview(null);
  //   setVideoUrl(null);
  // };

  return (
    <div className="space-y-6 py-6 px-2 sm:p-6 mx-0 sm:mx-14">
      <div className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="prompt"
            className="block text-sm font-medium text-gray-700"
          >
            {getTranslation(language, "consistent_actor.input_title")}
          </label>

          <Input
            id="prompt"
            multiline
            rows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={getTranslation(
              language,
              "consistent_actor.input_placeholder"
            )}
            className="text-base"
          />
        </div>

        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">
                {getTranslation(language, "consistent_actor.upload_face")}
              </label>
              {imagePreview && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    // setSelectedImage(null);
                    setImagePreview(null);
                    setUploadedImageUrl(null);
                  }}
                >
                  {getTranslation(language, "consistent_actor.remove")}
                </Button>
              )}
            </div>

            {imagePreview ? (
              <div className="relative  rounded-lg overflow-hidden">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:border-purple-500 transition-colors cursor-pointer"
              >
                <div className="space-y-2">
                  <div className="mx-auto w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      {getTranslation(
                        language,
                        "consistent_actor.upload_face_title"
                      )}
                    </p>
                    <p className="text-xs text-gray-500 mt-5">
                      jpg, jpeg, png, webp up to 10MB
                    </p>
                  </div>
                </div>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(event) => {
                handleImageUpload(event);
                event.target.value = ""; // Reset the file input value
              }}
              className="hidden"
            />
          </div>
        </Card>
      </div>
      {/* <button
          onClick={() => setShowSettings(!showSettings)}
          className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors"
        >
          <Settings className="h-4 w-4" />
          <span>Advanced Settings</span>
        </button> */}
      {error && (
        <div className="flex items-center p-1 gap-2 rounded-lg text-red-700 text-xs sm:text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}
      <button
        onClick={() => {
          generateImageToVideo();
        }}
        disabled={false}
        className={`px-8 min-w-full inline-flex items-center justify-center rounded-full font-medium transition-all duration-200 focus:outline-none bg-black text-white ${
          !loading && "hover:bg-black/90 "
        } ${
          loading && "cursor-not-allowed"
        } text-xs sm:text-sm md:text-lg px-5 sm:px-6 py-3 sm:py-4`}
      >
        {totalprogress === 0 && loading ? (
          <>
            <Sparkles className="h-5 w-5 mr-2" />
            {getTranslation(language, "consistent_actor.hang_tight")}
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
                {getTranslation(language, "consistent_actor.start_generate")}
              </>
            )}
          </>
        )}
      </button>
      {loading && (
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-slate-700 transition-all duration-1000 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      <div className="flex flex-col  items-start p-1 gap-2 rounded-lg text-gray-700 sm:text-xs text-[10px]">
        <p className="flex flex-row justify-start items-start gap-2">
          <FaCircleInfo className="w-10 h-10 mt-[-12px]" />
          {getTranslation(language, "consistent_actor.info1")}
          <br />
          {getTranslation(language, "consistent_actor.info2")}
        </p>{" "}
      </div>

      {/* {showSettings && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Animation Duration
              </label>
              <select className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:border-purple-500 focus:ring-purple-500">
                <option>3 seconds</option>
                <option>5 seconds</option>
                <option>10 seconds</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Motion Intensity
              </label>
              <select className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:border-purple-500 focus:ring-purple-500">
                <option>Subtle</option>
                <option>Moderate</option>
                <option>Dynamic</option>
              </select>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
}
