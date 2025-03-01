import React, { useState, useEffect, useRef } from "react";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import {
  Upload,
  Music2,
  Link as LinkIcon,
  Video,
  AlertCircle,
} from "lucide-react";
import { VoiceRecorder } from "./VoiceRecorder";
import { Input } from "../../../components/ui/Input";
import { AudioPlayer } from "./AudioPlayer";
import { PreviewCard } from "../../../components/preview/PreviewCard";
import { Sparkles, Loader2 } from "lucide-react";
// import { useAuth } from "../../auth/hooks/useAuth";

import { auth } from "../../../lib/firebase";
import { getIdToken } from "firebase/auth";
import { useAuth } from "../../auth/context/useAuth";
// import { Select } from "../../../components/ui/Select";
import { Info } from "lucide-react";
import { GetUser } from "../../../lib/api/user";
import { getTranslation } from "../../../utils/translations";
import { useLanguage } from "../../auth/context/LanguageContext";

interface LipSyncInputProps {
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
}

type InputMethod = "upload" | "record" | "url";

export function LipSyncInput({
  videoUrl,
  setGeneratedVideo,

  setLipSyncedVideoUrl,
  setIsNoCredits,
  audioUrl,
  setAudioUrl,
  setAudioObjectUrl,
  audioObjectUrl,
  setAudioFile,
  audioFile,
}: LipSyncInputProps) {
  // const [audioFile, setAudioFile] = useState<File | null>(null);

  const [inputMethod, setInputMethod] = useState<InputMethod>("upload");

  // const [videoUrla, setVideoUrl] = React.useState<string | null>(null);

  const [currentStep, setCurrentStep] = useState(1);
  const [isUploadingAudio, setIsUploadingAudio] = useState(false);
  const [audioDuration, setAudioDuration] = useState<number | null>(null);
  const intervalTimer = useRef(1500);

  useEffect(() => {
    if (audioDuration) {
      if (audioDuration < 8) {
        intervalTimer.current = 1500;
      } else if (audioDuration < 16) {
        intervalTimer.current = 2000;
      } else if (audioDuration < 40) {
        intervalTimer.current = 2500;
      } else {
        intervalTimer.current = 6000;
      }
    }
  }, [audioDuration]);
  const handleAudioUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAudioUploadError(null);
    const file = event.target.files?.[0];
    const allowedFileTypes = [
      "audio/mp3",
      "audio/ogg",
      "audio/wav",
      // "audio/m4a",
      "audio/aac",
      // "audio/x-m4a",
      "audio/mpeg",
      "audio/vnd.dlna.adts",
    ];

    if (file) {
      const audio = new Audio(URL.createObjectURL(file));
      audio.addEventListener("loadedmetadata", () => {
        setAudioDuration(audio.duration);
        // You can use audio.duration here or update a state
      });
      if (!allowedFileTypes.includes(file.type)) {
        setAudioUploadError(
          `Invalid file type. Please upload a file with one of the following formats.`
        );
        return;
      }

      const maxFileSize = 10 * 1024 * 1024;
      if (file.size > maxFileSize) {
        setAudioUploadError(
          `File is too large. Please upload a file smaller than 10MB.`
        );
        return;
      }

      setIsUploadingAudio(true);

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
          setAudioUrl(data.secure_url);
          setAudioFile(file);
          setInputMethod("upload");
          // // Create object URL for audio preview
          const url = URL.createObjectURL(file);
          setAudioObjectUrl(url);
          setIsUploadingAudio(false);
          return data.secure_url; // Return the URL of the uploaded file
        } else {
          setIsUploadingAudio(false);
          throw new Error(`Failed to get the secure URL for the  upload.`);
        }
      } catch (error) {
        setIsUploadingAudio(false);
        console.error(`Error uploading to Cloudinary:`, error);
        throw error;
      }
    }
  };

  const handleVideoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setVideoUploadError(null);
    const file = event.target.files?.[0];
    const allowedVideoTypes = [
      "video/mp4",
      "video/quicktime", // for .mov files
      "video/webm",
      "video/x-m4v", // for .m4v files
      // "image/gif", // for .gif files
    ];
    if (file) {
      if (!allowedVideoTypes.includes(file.type)) {
        console.error(`Unsupported file type: ${file.type}`);
        setVideoUploadError(
          `Invalid file type. Please upload a video file in one of the following formats: mp4, mov, webm, m4v`
        );
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
          }/video/upload`, // Replace with your cloud name
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await response.json();

        if (data.secure_url) {
          setGeneratedVideo(data.secure_url);
          return data.secure_url; // Return the URL of the uploaded file
        } else {
          setVideoUploadError(
            `Failed to Upload the video. Please try again later.`
          );
          throw new Error(`Failed to get the secure URL for the  upload.`);
        }
      } catch (error) {
        setVideoUploadError(
          `Failed to Upload the video. Please try again later.`
        );
        console.error(`Error uploading to Cloudinary:`, error);
        throw error;
      }

      // // setVideoUrl(file);
      // // Create object URL for audio preview
      // const url = URL.createObjectURL(file);
      // setVideoUrl(url);
    }
  };

  const handleRecordingComplete = async (audioBlob: Blob) => {
    setAudioUploadError(null);
    // Convert the audioBlob to WAV format
    const convertToWav = async (audioBlob: Blob): Promise<Blob> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async () => {
          try {
            const audioContext = new window.AudioContext();
            const arrayBuffer = reader.result as ArrayBuffer;
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

            // Create a WAV file from the audioBuffer
            const wavBlob = audioBufferToWavBlob(audioBuffer);
            resolve(wavBlob);
          } catch (error) {
            reject(`Error converting to WAV: ${error}`);
          }
        };
        reader.onerror = (error) => reject(`FileReader error: ${error}`);
        reader.readAsArrayBuffer(audioBlob);
      });
    };

    const audioBufferToWavBlob = (audioBuffer: AudioBuffer): Blob => {
      // Helper to write WAV headers and convert audioBuffer to WAV Blob
      const numOfChannels = audioBuffer.numberOfChannels;
      const length = audioBuffer.length * numOfChannels * 2 + 44; // 44 bytes for the WAV header
      const buffer = new ArrayBuffer(length);
      const view = new DataView(buffer);

      // Write WAV header
      const writeString = (view: DataView, offset: number, string: string) => {
        for (let i = 0; i < string.length; i++) {
          view.setUint8(offset + i, string.charCodeAt(i));
        }
      };

      writeString(view, 0, "RIFF");
      view.setUint32(4, 36 + audioBuffer.length * numOfChannels * 2, true);
      writeString(view, 8, "WAVE");
      writeString(view, 12, "fmt ");
      view.setUint32(16, 16, true);
      view.setUint16(20, 1, true);
      view.setUint16(22, numOfChannels, true);
      view.setUint32(24, audioBuffer.sampleRate, true);
      view.setUint32(28, audioBuffer.sampleRate * numOfChannels * 2, true);
      view.setUint16(32, numOfChannels * 2, true);
      view.setUint16(34, 16, true);
      writeString(view, 36, "data");
      view.setUint32(40, audioBuffer.length * numOfChannels * 2, true);

      // Write audio data
      const interleaved = new Float32Array(audioBuffer.length * numOfChannels);
      for (let channel = 0; channel < numOfChannels; channel++) {
        const channelData = audioBuffer.getChannelData(channel);
        for (let i = 0; i < channelData.length; i++) {
          interleaved[i * numOfChannels + channel] = channelData[i];
        }
      }

      const pcmData = new DataView(buffer, 44);
      for (let i = 0; i < interleaved.length; i++) {
        const value = Math.max(-1, Math.min(1, interleaved[i]));
        pcmData.setInt16(
          i * 2,
          value < 0 ? value * 0x8000 : value * 0x7fff,
          true
        );
      }

      return new Blob([buffer], { type: "audio/wav" });
    };

    try {
      const wavBlob = await convertToWav(audioBlob);

      // Proceed to upload the WAV file
      const file = new File([wavBlob], "recording.wav", {
        type: "audio/wav",
      });

      if (file) {
        setIsUploadingAudio(true);
        const audio = new Audio(URL.createObjectURL(file));
        audio.addEventListener("loadedmetadata", () => {
          setAudioDuration(audio.duration);
          // You can use audio.duration here or update a state
        });
        const formData = new FormData();
        formData.append("file", file);
        formData.append(
          "upload_preset",
          `${import.meta.env.VITE_CLOUDINARY_PRESET}`
        ); // Replace with your preset name

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
          setAudioUrl(data.secure_url);
          setAudioFile(file);
          setInputMethod("record");

          // Create object URL for audio preview
          const url = URL.createObjectURL(file);
          setAudioObjectUrl(url);
        } else {
          throw new Error("Failed to get the secure URL for the upload.");
        }
      }
    } catch (error) {
      console.error("Error during WAV conversion or upload:", error);
      throw error;
    } finally {
      setIsUploadingAudio(false);
    }
  };

  const handleUrlSubmit = async () => {
    if (!audioUrl) return;
    setAudioUploadError(null);
    try {
      setIsUploadingAudio(true);
      const response = await fetch(audioUrl);
      const blob = await response.blob();
      const filename = audioUrl.split("/").pop() || "audio";
      const file = new File([blob], filename, { type: blob.type });

      if (file) {
        setIsUploadingAudio(true);
        const allowedFileTypes = [
          "audio/wav",
          "audio/mp3",
          "audio/mpeg",
          "video/mp4",
          "audio/ogg",
          "audio/m3a",
          "audio/m4a",
          "audio/aac",
          "audio/x-ms-wma",
          "audio/flac",
        ];

        if (!allowedFileTypes.includes(file.type)) {
          setIsUploadingAudio(false);
          setAudioUploadError(
            `Unsupported file type or URL. Please upload a file in one of the supported formats listed below.`
          );
          return;
        }
        const audio = new Audio(URL.createObjectURL(file));
        audio.addEventListener("loadedmetadata", () => {
          setAudioDuration(audio.duration);
          // You can use audio.duration here or update a state
        });
        const formData = new FormData();
        formData.append("file", file);
        formData.append(
          "upload_preset",
          `${import.meta.env.VITE_CLOUDINARY_PRESET}`
        );
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
          setAudioUrl(data.secure_url);
          setAudioFile(file);
          setInputMethod("record");

          // Create object URL for audio preview
          const url = URL.createObjectURL(file);
          setAudioObjectUrl(url);
          setIsUploadingAudio(false);
        } else {
          setIsUploadingAudio(false);
          setIsUploadingAudio(false);
          console.error("Error fetching audio URL");
          throw new Error("Failed to get the secure URL for the upload.");
        }
      }
    } catch (error) {
      setIsUploadingAudio(false);
      console.error("Error fetching audio URL:", error);
    }
  };

  const clearAudio = () => {
    setAudioFile(null);
    setAudioObjectUrl(null);
    setAudioUrl("");
    if (audioObjectUrl) {
      URL.revokeObjectURL(audioObjectUrl);
      setAudioObjectUrl(null);
    }
  };

  React.useEffect(() => {
    return () => {
      // Cleanup object URL on component unmount
      if (audioObjectUrl) {
        URL.revokeObjectURL(audioObjectUrl);
      }
    };
  }, []);

  // if (!videoUrl) return null;

  const renderInputMethod = () => {
    switch (inputMethod) {
      case "upload":
        return (
          <div className="space-y-4">
            <label
              htmlFor="audio-upload"
              className="flex flex-col items-center justify-center gap-4 p-8 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
            >
              {isUploadingAudio ? (
                <>
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-600">
                      {getTranslation(
                        language,
                        "ugc_actor.lipsync_video.upload_audio_file"
                      )}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {" "}
                      {getTranslation(
                        language,
                        "ugc_actor.lipsync_video.please_wait"
                      )}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <Music2 className="sm:w-8 w-6 sm:h-8 h-6 text-gray-400" />
                  <div className="text-center">
                    <p className="text-xs sm:text-sm  font-medium text-gray-600">
                      {getTranslation(
                        language,
                        "ugc_actor.lipsync_video.upload_audio"
                      )}
                    </p>
                    <p className="text-[10px] sm:text-xs  text-gray-500 mt-1">
                      {getTranslation(
                        language,
                        "ugc_actor.lipsync_video.click_browse"
                      )}
                    </p>
                  </div>
                </>
              )}
            </label>
            <input
              id="audio-upload"
              type="file"
              accept="audio/*,.aac"
              onChange={handleAudioUpload}
              className="hidden"
            />
          </div>
        );

      case "record":
        return (
          <div className="space-y-4">
            <VoiceRecorder
              onRecordingComplete={handleRecordingComplete}
              isUploadingAudio={isUploadingAudio}
            />
          </div>
        );

      case "url":
        return (
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder={getTranslation(
                  language,
                  "ugc_actor.lipsync_video.past_audio_placeholder"
                )}
                value={audioUrl}
                onChange={(e) => setAudioUrl(e.target.value)}
                className="flex-1 text-[10px] sm:text-sm"
              />
              <Button
                variant="secondary"
                onClick={handleUrlSubmit}
                disabled={isUploadingAudio}
              >
                {isUploadingAudio ? (
                  <>
                    {" "}
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {getTranslation(
                      language,
                      "ugc_actor.lipsync_video.loading"
                    )}
                  </>
                ) : (
                  <p className="text-[10px] sm:text-sm flex flex-row items-center">
                    {" "}
                    <LinkIcon className="sm:w-4 w-3 sm:h-4 h-3 mr-2" />
                    {getTranslation(language, "ugc_actor.lipsync_video.load")}
                  </p>
                )}
              </Button>
            </div>
          </div>
        );
    }
  };

  const [loading, setLoading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [error, setError] = useState<string | null>(null);
  const [audioUploadError, setAudioUploadError] = useState<string | null>(null);
  const [videoUploadError, setVideoUploadError] = useState<string | null>(null);
  const [currentprogress, setCurrentProgress] = useState(0);
  const [totalprogress, setTotalProgress] = useState(0);

  const requestInterval = useRef<NodeJS.Timeout | null>(null);
  // const [isEnableEnhanceLipSync, setIsEnableEnhanceLipSync] = useState(false);
  const countDown = useRef(0);
  const timer = useRef<NodeJS.Timeout | null>(null);
  const {
    user,
    userData,
    userCredits,
    setUserCredits,
    isEnableEnhanceLipSync,
    setIsEnableEnhanceLipSync,
  } = useAuth();

  const generateLipSync = async () => {
    if (loading) return;
    setError(null);
    setProgress(0);
    setTotalProgress(0);

    try {
      if (!user) {
        setError(getTranslation(language, "lipsync_error.signin_error"));
        return;
      }

      if (audioUrl === "" || audioFile === null) {
        setError(getTranslation(language, "lipsync_error.audio_error"));
        return;
      }
      if (videoUrl === null) {
        setError(getTranslation(language, "lipsync_error.upload_video"));
        return;
      }

      if (!user) {
        setError(getTranslation(language, "lipsync_error.user_credential"));
        return;
      }
      if (!audioDuration) {
        setError(getTranslation(language, "lipsync_error.invalid_audio"));
        return;
      }
      if (audioDuration <= 0) {
        setError(getTranslation(language, "lipsync_error.invalid_audio"));
        return;
      }
      let cost = 0;
      let lipSyncModel = "lipsync-1.8.0";
      if (import.meta.env.VITE_SITE_NAMAE == "Synthetic UGC") {
        cost = 11.75;

        if (isEnableEnhanceLipSync) {
          cost = 15;
          lipSyncModel = "lipsync-1.9.0-beta";
        }
      } else {
        cost = 2.35;
        if (isEnableEnhanceLipSync) {
          cost = 3;
          lipSyncModel = "lipsync-1.9.0-beta";
        }
      }

      const deductToken = Math.ceil(audioDuration / 60) * cost;

      // if (userCredits < deductToken) {
      //   setError("You don't have enough credits to generate the video.");
      //   setIsNoCredits(true);
      //   return;
      // }

      const token = auth.currentUser
        ? await getIdToken(auth.currentUser)
        : null;

      if (!token) {
        setError(getTranslation(language, "lipsync_error.user_credential"));
        return;
      }
      setLoading(true);

      const userdata = await GetUser(userData.email);
      if (!user) {
        setError(getTranslation(language, "lipsync_error.user_not"));
        setLoading(false);

        return;
      } else {
        if (userdata.isCurrentlyGenerating) {
          setError(getTranslation(language, "lipsync_error.one_time_generate"));
          setLoading(false);

          return;
        }

        if (userdata.credits < deductToken) {
          setError(getTranslation(language, "lipsync_error.not_enough_token"));
          setIsNoCredits(true);
          setLoading(false);

          return;
        }
      }

      ///////////////////////demo////////////////////////
      if (userData.email === import.meta.env.VITE_DEMO_USER) {
        const res = await fetch(
          `${
            import.meta.env.VITE_END_POINT_URL
          }/api/fal/v1/demoLypSyncGenerate`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(token && { Authorization: token }),
            },
            body: JSON.stringify({
              video_url: videoUrl,
              audio_url: audioUrl,
              user_id: userData._id,
              audio_duraraion: audioDuration,
              lipSyncModel: lipSyncModel,
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
                }/api/fal/v1/lipsyncGeneratedVideo`,
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

                  if (requestInterval.current) {
                    if (import.meta.env.VITE_SITE_NAMAE == "Synthetic UGC") {
                      if (isEnableEnhanceLipSync) {
                        setUserCredits(userCredits - 15);
                      } else {
                        setUserCredits(userCredits - 11.75);
                      }
                    } else {
                      if (isEnableEnhanceLipSync) {
                        setUserCredits(userCredits - 3);
                      } else {
                        setUserCredits(userCredits - 2.35);
                      }
                    }

                    setLoading(false);
                    setLipSyncedVideoUrl(statusData.outputUrl);
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

      const res = await fetch(
        `${import.meta.env.VITE_END_POINT_URL}/api/fal/v1/lipsyncGenerate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: token }),
          },
          body: JSON.stringify({
            video_url: videoUrl,
            audio_url: audioUrl,
            user_id: userData._id,
            audio_duraraion: audioDuration,
            lipSyncModel: lipSyncModel,
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
            }/api/fal/v1/lipsyncGeneratedVideo`,
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
              if (requestInterval.current) {
                setUserCredits(userCredits - deductToken);
                setLoading(false);
                setLipSyncedVideoUrl(statusData.outputUrl);
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
              getTranslation(language, "lipsync_error.failed_to_generate")
            );
            setLoading(false);
          }
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
                }/api/fal/v1/lipsyncGeneratedVideo`,
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
                  if (requestInterval.current) {
                    setUserCredits(userCredits - deductToken);
                    setLoading(false);
                    if (timer.current) {
                      clearInterval(timer.current);
                    }

                    setLipSyncedVideoUrl(statusData.outputUrl);
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
                  getTranslation(language, "lipsync_error.failed_to_generate")
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
          getTranslation(language, "lipsync_error.failed_to_generate")
      );
      setLoading(false);
    } finally {
      // setLoading(false);
    }
  };
  const [showInfo, setShowInfo] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const infoButtonRef = useRef<HTMLButtonElement>(null);
  const { language } = useLanguage();
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current?.contains(event.target as Node) &&
        infoButtonRef.current?.contains(event.target as Node) === false
      ) {
        setShowInfo(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInfoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowInfo(!showInfo);
  };

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

  return (
    <Card className="py-6 px-2 sm:p-6 space-y-6 mx-0 sm:mx-14 w-11/12">
      <div className="flex items-center justify-between">
        <h2 className="text-base lg:text-xl font-medium">
          {getTranslation(language, "ugc_actor.lipsync_video.lip_sync")}
        </h2>
        <p className="sm:text-sm text-xs text-black/60">
          {getTranslation(language, "ugc_actor.lipsync_video.lip_sync_desc")}
        </p>
      </div>

      <div className="flex gap-2">
        <button
          type="button" // Ensures button does not submit a form
          className={`inline-flex items-center justify-center rounded-full font-medium transition-all duration-200 focus:outline-none text-[10px] sm:text-sm md:text-sm px-3 sm:px-4 py-2 sm:py-2 ${
            inputMethod === "upload"
              ? "bg-black text-white hover:bg-black/90"
              : "text-black/60 hover:text-black hover:bg-black/5"
          }`}
          onClick={() => setInputMethod("upload")}
          // aria-pressed={selectedCategory === category.value} // Accessibility improvement
        >
          {" "}
          {/* <Music2 className="w-4 h-4 mr-2" /> */}
          {getTranslation(language, "ugc_actor.lipsync_video.upload_file")}
        </button>

        <button
          type="button" // Ensures button does not submit a form
          className={`inline-flex items-center justify-center rounded-full font-medium transition-all duration-200 focus:outline-none text-[10px] sm:text-sm md:text-sm px-3 sm:px-4 py-2 sm:py-2 ${
            inputMethod === "record"
              ? "bg-black text-white hover:bg-black/90"
              : "text-black/60 hover:text-black hover:bg-black/5"
          }`}
          onClick={() => setInputMethod("record")}
          // aria-pressed={selectedCategory === category.value} // Accessibility improvement
        >
          {" "}
          {/* <Music2 className="w-4 h-4 mr-2" /> */}
          {getTranslation(language, "ugc_actor.lipsync_video.record_audio")}
        </button>
        <button
          type="button" // Ensures button does not submit a form
          className={`inline-flex items-center justify-center rounded-full font-medium transition-all duration-200 focus:outline-none text-[10px] sm:text-sm md:text-sm px-3 sm:px-4 py-2 sm:py-2 ${
            inputMethod === "url"
              ? "bg-black text-white hover:bg-black/90"
              : "text-black/60 hover:text-black hover:bg-black/5"
          }`}
          onClick={() => setInputMethod("url")}
          // aria-pressed={selectedCategory === category.value} // Accessibility improvement
        >
          {" "}
          {/* <Music2 className="w-4 h-4 mr-2" /> */}
          {getTranslation(language, "ugc_actor.lipsync_video.audio_url")}
        </button>
      </div>
      {(!audioFile || !audioObjectUrl) && (
        <div className="min-h-[200px] flex items-center justify-center">
          {renderInputMethod()}
        </div>
      )}
      {audioFile && audioObjectUrl && (
        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-4">
            <AudioPlayer audioUrl={audioObjectUrl} />
            <div>
              <p className="text-[10px] sm:text-sm font-medium text-gray-900">
                {audioFile.name}
                {/* {inputMethod === "record" ? "Voice Recording" : audioFile.name} */}
              </p>
              <p className="text-[10px] sm:text-sm text-gray-500">
                {(audioFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="lg"
              onClick={clearAudio}
              className="h-8 w-8 p-0 text-black text-[9px] sm:text-sm"
            >
              {getTranslation(language, "ugc_actor.lipsync_video.remove")}
            </Button>
          </div>
        </div>
      )}
      {audioUploadError && (
        <div className="flex items-center p-1 gap-2 rounded-lg text-red-700 text-[10px] sm:text-xs">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <p>{audioUploadError}</p>
        </div>
      )}
      <div className="text-[10px] sm:text-xs  text-gray-500">
        {getTranslation(language, "ugc_actor.lipsync_video.supported_audio")}
      </div>
      {videoUrl ? (
        <>
          {" "}
          <div className="flex items-center justify-between">
            <h2 className="text-base lg:text-xl font-medium">
              {" "}
              {getTranslation(language, "ugc_actor.lipsync_video.input_video")}
            </h2>
          </div>
          <PreviewCard
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
          {" "}
          <div className="flex items-center justify-between">
            <h2 className="text-base lg:text-xl font-medium">
              {getTranslation(language, "ugc_actor.lipsync_video.input_video")}
            </h2>
          </div>
          <div className="space-y-4">
            <label
              htmlFor="video-upload"
              className="flex flex-col items-center justify-center gap-4 p-8 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <Video className="sm:w-8 w-6 sm:h-8 h-6 text-gray-400" />
              <div className="text-center">
                <p className="sm:text-sm text-xs font-medium text-gray-600">
                  {getTranslation(
                    language,
                    "ugc_actor.lipsync_video.upload_video"
                  )}
                </p>
                <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
                  {getTranslation(
                    language,
                    "ugc_actor.lipsync_video.click_to_brows"
                  )}
                </p>
              </div>
            </label>
            <input
              id="video-upload"
              type="file"
              accept="video/*"
              onChange={handleVideoUpload}
              className="hidden"
            />
            {videoUploadError && (
              <div className="flex items-center p-1 gap-2 rounded-lg text-red-700  text-[10px] sm:text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <p>{videoUploadError}</p>
              </div>
            )}
          </div>
        </>
      )}

      <div className="flex flex-col gap-2">
        <div className="flex flex-row  gap-6 mb-10">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                {getTranslation(
                  language,
                  "ugc_actor.lipsync_video.enhance_lipsync"
                )}
              </span>
              <div
                className="inline-block"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  ref={infoButtonRef}
                  onClick={handleInfoClick}
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
                {getTranslation(
                  language,
                  "ugc_actor.lipsync_video.enhance_lipsync_desc"
                )}
                <div className="absolute -top-2 left-4 w-0 h-0 border-8 border-transparent border-b-gray-800" />
              </div>
            )}

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                value=""
                className="sr-only peer"
                // checked={true}
                onChange={() => {
                  setIsEnableEnhanceLipSync(!isEnableEnhanceLipSync);
                }}
              />
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
          disabled={false}
          className={`px-8 min-w-[180px] inline-flex items-center justify-center rounded-full font-medium transition-all duration-200 focus:outline-none bg-black text-white ${
            !loading && "hover:bg-black/90 "
          } ${
            loading && "cursor-not-allowed"
          } text-xs sm:text-sm md:text-lg px-5 sm:px-6 py-3 sm:py-4`}
        >
          {totalprogress === 0 && loading ? (
            <>
              <Sparkles className="h-5 w-5 mr-2" />
              {getTranslation(language, "ugc_actor.lipsync_video.hand_tight")}
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
                  {getTranslation(
                    language,
                    "ugc_actor.lipsync_video.start_btn"
                  )}
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
      </div>
    </Card>
  );
}
