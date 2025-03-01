import React, { useState, useRef, useEffect } from "react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Loader, Music, Upload, Video, Type, Bold, Italic } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "../auth/context/LanguageContext";
import { getTranslation } from "../../utils/translations";
import { IoIosArrowDown } from "react-icons/io";

// import { Slider } from "../../components/ui/Slider";

interface Template {
  _id: string;
  thumbnailUrl: string;
  title: string;
  videoUrl: string;
}

interface TemplateSelectorProps {
  generatedVideoUrl: string | null;
}

export function TemplateSelector({ generatedVideoUrl }: TemplateSelectorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(true);
  const [templateError, setTemplateError] = useState<string | null>(null);
  const [videoText, setVideoText] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const { language } = useLanguage();
  const [textPosition, setTextPosition] = useState(50);
  const [textPositionX, setTextPositionX] = useState(50);
  const [isUploadingAudio, setIsUploadingAudio] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showGeneratedVideo, setShowGeneratedVideo] = useState(false);

  const [audioDuration, setAudioDuration] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [selectedFont, setSelectedFont] = useState("inter"); // default font
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [fontSize, setFontSize] = useState("60"); // default size in pixels
  const [videoDimensions, setVideoDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [audioObjectUrl, setAudioObjectUrl] = useState<string | null>(null);
  const [captionColor, setCaptionColor] = useState("#ffffff");
  const chunksRef = useRef<BlobPart[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const [loopType, setLoopType] = useState<"loop" | "bounce">("loop");
  const [isReverse, setIsReverse] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [visibleTemplates, setVisibleTemplates] = useState(10);
  const [selectedVideoURL, setSelectedVideoURL] = useState<string | null>(null);
  const stopEditing = useRef(false);
  const animationFrameId = useRef(null);

  // Keypoints for text position
  const positionKeypoints = [
    { value: 0, label: "Bottom" },
    { value: 50, label: "Center" },
    { value: 100, label: "Top" },
  ];

  const positionKeypointsX = [
    { value: 0, label: "Left" },
    { value: 50, label: "Center" },
    { value: 100, label: "Right" },
  ];

  const getSupportedMimeType = () => {
    const types = [
      "video/mp4;codecs=avc1.42E01E,mp4a.40.2",
      "video/webm;codecs=vp8,opus",
      "video/webm;codecs=vp9,opus",
      "video/webm",
    ];
    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }
    return "";
  };
  console.debug("Template:", templates);
  const startRecording = async () => {
    if (videoText === "") {
      setError("Please enter a caption to proceed");
      return;
    }
    console.debug("startRecording");
    const video = videoRef.current;
    const audio = audioRef.current;
    const canvas = canvasRef.current;
    if (!canvas || !video) return;

    console.debug("audioObjectUrl:", audioObjectUrl);
    try {
      video.currentTime = 0;

      // Create a media stream with video
      const videoStream = canvas.captureStream(30);

      // Combine video and processed audio tracks
      const combinedTracks = [...videoStream.getVideoTracks()];

      const combinedStream = new MediaStream(combinedTracks);

      // Try to find the best supported MIME type
      const mimeType = getSupportedMimeType();

      const recorder = new MediaRecorder(combinedStream, {
        mimeType: mimeType,
        videoBitsPerSecond: 2500000, // 2.5 Mbps for better quality
      });

      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = async () => {
        setIsConverting(true);

        try {
          const blob = new Blob(chunksRef.current, { type: mimeType });
          console.debug("Blob created:", blob);
          setDownloadUrl(URL.createObjectURL(blob));
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = "captioned-video-with-audio.mp4";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          // window.open(URL.createObjectURL(blob));
        } catch (error) {
          console.debug("Error creating blob:", error);
        } finally {
          setIsConverting(false);
          setRecording(false);
        }
      };

      // Start playing both video and audio
      await video.play();

      console.debug("video.play() and audio.play()");
      recorder.start(1000); // Capture in 1-second chunks
      setRecording(true);

      let previousTime = 0;

      // Loop video to match audio duration with bounce or loop option
      const updateVideoPlayback = () => {
        if (video.paused || video.ended) {
          recorder.stop();
          video.pause();
          return;
        }

        previousTime = video.currentTime;
        requestAnimationFrame(updateVideoPlayback);
      };

      requestAnimationFrame(updateVideoPlayback);

      // Set timeout to stop recording when audio ends
    } catch (error) {
      console.debug("Error during recording:", error);
      setRecording(false);
    }
  };
  useEffect(() => {
    if (!selectedVideoURL) return;
    stopEditing.current = true;
    // startRecording();
    console.debug("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");

    const video = videoRef.current;
    const canvas = canvasRef.current;
    video?.play();
    if (!video || !canvas) return;
    console.debug("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb");

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    console.debug("eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");

    // Ensure the function doesn't start multiple loops
    let isUpdating = false;

    const updateCanvas = () => {
      if (video.paused || video.ended) {
        isUpdating = false; // Stop updating if video is not playing
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const fontStyle = isItalic ? "italic" : "";
      const fontWeight = isBold ? "bold" : "";
      const fontFamily = selectedFont || "Arial"; // Set custom font or fallback to Arial
      ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;
      ctx.fillStyle = captionColor;

      const lines = videoText.split("\n"); // Split text into lines
      const textHeight = parseInt(fontSize, 10);
      const lineSpacing = textHeight * 1.2; // Slightly increase line spacing for readability
      const totalTextHeight = lines.length * lineSpacing;

      // Ensure Y position stays within canvas bounds
      let y = Math.max(
        textHeight, // Prevent text from going above the canvas
        Math.min(
          canvas.height - totalTextHeight, // Prevent text from disappearing below
          canvas.height -
            (canvas.height * textPosition) / 100 -
            totalTextHeight / 2
        )
      );

      lines.forEach((line) => {
        const textWidth = ctx.measureText(line).width;

        // Ensure X position stays within canvas bounds
        let x = Math.max(
          0, // Prevent text from moving out of left boundary
          Math.min(
            canvas.width - textWidth, // Prevent text from moving out of right boundary
            (canvas.width * textPositionX) / 100 - textWidth / 2
          )
        );

        // Draw background for better readability
        ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
        // ctx.fillRect(x - 10, y - textHeight, textWidth + 20, textHeight + 10);

        // Draw text
        ctx.fillStyle = captionColor;
        ctx.fillText(line, x, y);

        y += lineSpacing; // Move Y position for the next line
      });

      animationFrameId.current = requestAnimationFrame(updateCanvas);
    };

    // Set canvas size only once when video is loaded
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    if (!isUpdating) {
      isUpdating = true;
      updateCanvas();
    }

    const handleVideoPlay = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      updateCanvas();
    };

    video.addEventListener("play", handleVideoPlay);
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current); // Cleanup previous animation frame
      }
    };
  }, [
    videoText,
    captionColor,
    fontSize,
    textPosition,
    textPositionX,
    selectedFont,
    isItalic,
    isBold,
  ]);

  useEffect(() => {
    setVideoText("");
  }, [selectedVideoURL]);

  useEffect(() => {
    if (generatedVideoUrl) {
      setSelectedVideoURL(generatedVideoUrl);
    }
  }, [generatedVideoUrl]);

  // // Handle audio loading and duration
  // useEffect(() => {
  //   if (!audioObjectUrl) return;

  //   const audio = audioRef.current;
  //   if (!audio) return;

  //   audio.src = audioObjectUrl;

  //   const handleMetadata = () => {
  //     setAudioDuration(audio.duration);
  //   };

  //   audio.addEventListener("loadedmetadata", handleMetadata);

  //   return () => {
  //     audio.removeEventListener("loadedmetadata", handleMetadata);
  //     // Clean up the object URL when component unmounts
  //     if (audioObjectUrl) {
  //       URL.revokeObjectURL(audioObjectUrl);
  //     }
  //   };
  // }, [audioObjectUrl]);

  // Function to map slider value (0-100) to actual position (10-85)
  const mapPositionToActual = (value: number) => {
    if (value === 50) return 50; // Keep center exactly at 50%
    if (value < 50) {
      // Map 0-50 to 10-50
      return (value * (50 - 10)) / 50;
    } else {
      // Map 50-100 to 50-85
      return 50 + ((value - 50) * (85 - 50)) / 50;
    }
  };

  // Function to get position label
  const getPositionLabel = (value: number) => {
    const keypoint = positionKeypoints.find((kp) => kp.value === value);
    if (keypoint) return keypoint.label;
    return `${Math.round(mapPositionToActual(value))}% from bottom`;
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // const files = event.target.files?.[0];
    // if (!files) return;
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setAudioFile(file);

    // Clean up previous object URL
    if (audioObjectUrl) {
      URL.revokeObjectURL(audioObjectUrl);
    }

    // Create new object URL for the audio file
    const objectUrl = URL.createObjectURL(file);
    setAudioObjectUrl(objectUrl);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    if (videoRef.current) {
      videoRef.current.pause();
    }
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  useEffect(() => {
    const fetchTemplates = async () => {
      setIsLoadingTemplates(true);
      setTemplateError(null);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_END_POINT_URL}/api/template-video`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch templates");
        }
        const data = await response.json();
        // Ensure we're accessing the correct data structure
        setTemplates(Array.isArray(data.data) ? data.data : []);
      } catch (error) {
        console.error("Error fetching templates:", error);
        setTemplateError(
          getTranslation(language, "templateEditor.failedToLoadTemplates")
        );
      } finally {
        setIsLoadingTemplates(false);
      }
    };

    fetchTemplates();
  }, [language]);

  // Add a useEffect to log templates when they change

  // Add a useEffect to log selected template when it changes

  // Add this constant for available fonts
  const availableFonts = [
    { value: "inter", label: "Inter" },
    { value: "roboto", label: "Roboto" },
    { value: "poppins", label: "Poppins" },
    { value: "playfair", label: "Playfair Display" },
    { value: "montserrat", label: "Montserrat" },
  ];

  // Update font sizes to use pixel values
  const fontSizes = [
    { value: "60", label: "Small" },
    { value: "80", label: "Medium" },
    { value: "100", label: "Large" },
    { value: "165", label: "Extra Large" },
  ];

  // Calculate aspect ratio style
  const getAspectRatioStyle = () => {
    if (videoDimensions.width && videoDimensions.height) {
      const aspectRatio = `${videoDimensions.width} / ${videoDimensions.height}`;
      return { aspectRatio };
    }
    return { aspectRatio: "9/16" }; // Default aspect ratio
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-white to-black/5 py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,600px] gap-12">
          {/* Main Content */}
          <div className="space-y-8">
            {/* Template Selection */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">
                {getTranslation(language, "templateEditor.selectTemplate")}
              </h2>
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                {isLoadingTemplates ? (
                  <div className="col-span-full flex justify-center items-center py-8">
                    <Loader className="w-8 h-8 animate-spin text-black/50" />
                  </div>
                ) : templateError ? (
                  <div className="col-span-full text-center py-8">
                    <p className="text-red-500 text-sm">{templateError}</p>
                    <Button
                      variant="ghost"
                      onClick={() => window.location.reload()}
                      className="mt-2"
                    >
                      {getTranslation(language, "templateEditor.retry")}
                    </Button>
                  </div>
                ) : templates.length === 0 ? (
                  <div className="col-span-full text-center py-8">
                    <p className="text-black/50 text-sm">
                      {getTranslation(
                        language,
                        "templateEditor.noTemplatesAvailable"
                      )}
                    </p>
                  </div>
                ) : (
                  <>
                    {templates.slice(0, visibleTemplates).map((template) => (
                      <motion.div
                        key={template._id}
                        whileHover={{ scale: 1.05 }}
                        className={`relative cursor-pointer rounded-md overflow-hidden group ${
                          selectedTemplate === template._id
                            ? "ring-2 ring-black"
                            : "ring-1 ring-black/10"
                        }`}
                        onClick={() => {
                          setSelectedTemplate(template);
                          setSelectedVideoURL(template.videoUrl);
                        }}
                      >
                        <img
                          src={template.thumbnailUrl}
                          alt={template.title}
                          className="w-full aspect-[2/3] object-cover"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute bottom-0 left-0 right-0 p-1 text-white transform translate-y-full group-hover:translate-y-0 transition-transform">
                          <p className="text-[8px] font-medium truncate text-center">
                            {template.title}
                          </p>
                        </div>
                        {selectedTemplate === template._id && (
                          <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                            <div className="bg-white rounded-full p-1">
                              <Video className="w-3 h-3 text-black" />
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}
                    {visibleTemplates < templates.length && (
                      <div className="col-span-full flex justify-end py-4">
                        <button
                          variant="ghost"
                          onClick={() => setVisibleTemplates(templates.length)}
                          className="items-center justify-center flex gap-4 text-xs"
                        >
                          view more{"   "}
                          {">"}
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </Card>

            {/* Video Text Input */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">
                {getTranslation(language, "templateEditor.addText")}
              </h2>
              <div className="space-y-6">
                {/* Font and Style Controls */}
                <div className="flex gap-4 items-center flex-wrap">
                  {/* Font Family Select */}
                  <div className="flex-1 min-w-[200px] flex items-center gap-2 px-3 py-2 rounded-md border border-black/10">
                    <Type className="w-4 h-4 text-black/60" />
                    <select
                      value={selectedFont}
                      onChange={(e) => setSelectedFont(e.target.value)}
                      className="flex-1 bg-transparent text-sm focus:outline-none"
                    >
                      {availableFonts.map((font) => (
                        <option key={font.value} value={font.value}>
                          {font.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Font Size Select */}
                  <div className="flex items-center gap-2 px-3 py-2 rounded-md border border-black/10">
                    <select
                      value={fontSize}
                      onChange={(e) => setFontSize(e.target.value)}
                      className="bg-transparent text-sm focus:outline-none"
                    >
                      {fontSizes.map((size) => (
                        <option key={size.value} value={size.value}>
                          {size.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Style Controls */}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setIsBold(!isBold)}
                      className={`p-2 rounded-md transition-colors ${
                        isBold
                          ? "bg-black text-white"
                          : "bg-black/5 hover:bg-black/10 text-black"
                      }`}
                      title={getTranslation(
                        language,
                        "templateEditor.boldText"
                      )}
                    >
                      <Bold className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsItalic(!isItalic)}
                      className={`p-2 rounded-md transition-colors ${
                        isItalic
                          ? "bg-black text-white"
                          : "bg-black/5 hover:bg-black/10 text-black"
                      }`}
                      title={getTranslation(
                        language,
                        "templateEditor.italicText"
                      )}
                    >
                      <Italic className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Text Input */}
                <div>
                  <Input
                    value={videoText}
                    multiline
                    onChange={(e) => setVideoText(e.target.value)}
                    placeholder={getTranslation(
                      language,
                      "templateEditor.textPlaceholder"
                    )}
                    className="w-full"
                  />
                </div>

                {/* Text Position Control */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-black/60">
                      {getTranslation(language, "templateEditor.textPosition")}
                    </label>
                    {/* <span className="text-sm text-black/60">
                      {getPositionLabel(textPosition)}
                    </span> */}
                  </div>
                  <div className="px-2">
                    <div className="relative pt-5 pb-8">
                      {/* Vertical line markers */}
                      <div className="absolute inset-y-0 left-0 right-0 flex justify-between pointer-events-none">
                        {positionKeypoints.map((keypoint) => (
                          <div
                            key={keypoint.value}
                            className="h-full flex flex-col items-center"
                            style={{ width: "2px" }}
                          >
                            <div
                              className={`w-0.5 h-2 ${
                                textPosition === keypoint.value
                                  ? "bg-black"
                                  : "bg-black/20"
                              }`}
                            />
                          </div>
                        ))}
                      </div>

                      {/* Slider */}
                      <input
                        type="range"
                        min={positionKeypoints[0].value}
                        max={
                          positionKeypoints[positionKeypoints.length - 1].value
                        }
                        value={textPosition}
                        onChange={(e) =>
                          setTextPosition(Number(e.target.value))
                        }
                        className="w-full h-2 bg-black/10 rounded-lg appearance-none cursor-pointer"
                        step="1"
                      />

                      {/* Keypoint labels */}
                      <div className="absolute w-full flex justify-between mt-2">
                        {positionKeypoints.map((keypoint) => (
                          <button
                            key={keypoint.value}
                            onClick={() => setTextPosition(keypoint.value)}
                            className={`text-[10px] transform -translate-x-1/2 hover:text-black transition-colors ${
                              textPosition === keypoint.value
                                ? "text-black"
                                : "text-black/40"
                            }`}
                            style={{
                              left: `${
                                ((keypoint.value - positionKeypoints[0].value) /
                                  (positionKeypoints[
                                    positionKeypoints.length - 1
                                  ].value -
                                    positionKeypoints[0].value)) *
                                100
                              }%`,
                            }}
                          >
                            {keypoint.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="px-2">
                    <div className="relative pt-5 pb-8">
                      {/* Vertical line markers */}
                      <div className="absolute inset-y-0 left-0 right-0 flex justify-between pointer-events-none">
                        {positionKeypointsX.map((keypoint) => (
                          <div
                            key={keypoint.value}
                            className="h-full flex flex-col items-center"
                            style={{ width: "2px" }}
                          >
                            <div
                              className={`w-0.5 h-2 ${
                                textPositionX === keypoint.value
                                  ? "bg-black"
                                  : "bg-black/20"
                              }`}
                            />
                          </div>
                        ))}
                      </div>

                      {/* Slider */}
                      <input
                        type="range"
                        min={positionKeypointsX[0].value}
                        max={
                          positionKeypointsX[positionKeypointsX.length - 1]
                            .value
                        }
                        value={textPositionX}
                        onChange={(e) =>
                          setTextPositionX(Number(e.target.value))
                        }
                        className="w-full h-2 bg-black/10 rounded-lg appearance-none cursor-pointer"
                        step="1"
                      />

                      {/* Keypoint labels */}
                      <div className="absolute w-full flex justify-between mt-2">
                        {positionKeypointsX.map((keypoint) => (
                          <button
                            key={keypoint.value}
                            onClick={() => setTextPositionX(keypoint.value)}
                            className={`text-[10px] transform -translate-x-1/2 hover:text-black transition-colors ${
                              textPositionX === keypoint.value
                                ? "text-black"
                                : "text-black/40"
                            }`}
                            style={{
                              left: `${
                                ((keypoint.value -
                                  positionKeypointsX[0].value) /
                                  (positionKeypointsX[
                                    positionKeypointsX.length - 1
                                  ].value -
                                    positionKeypointsX[0].value)) *
                                100
                              }%`,
                            }}
                          >
                            {keypoint.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Audio Upload */}
            {/* <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">
                {getTranslation(language, "templateEditor.addAudio")}
              </h2>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center ${
                  audioFile ? "border-green-500" : "border-black/10"
                }`}
              >
                <input
                  type="file"
                  ref={audioInputRef}
                  onChange={handleAudioUpload}
                  accept="audio/*"
                  className="hidden"
                />
                {isUploadingAudio ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader className="w-5 h-5 animate-spin text-black/50" />
                    <span className="text-sm text-black/50">
                      {getTranslation(
                        language,
                        "templateEditor.uploadingAudio"
                      )}
                    </span>
                  </div>
                ) : audioFile ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <Music className="w-5 h-5 text-green-500" />
                      <span className="text-sm text-green-500">
                        {audioFile.name}
                      </span>
                    </div>
                    {uploadError && (
                      <p className="text-sm text-red-500">{uploadError}</p>
                    )}
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    onClick={() => audioInputRef.current?.click()}
                    className="mx-auto"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {getTranslation(language, "templateEditor.uploadAudio")}
                  </Button>
                )}
              </div>
            </Card> */}
          </div>

          {/* Preview Card */}
          <div className="lg:sticky lg:top-24 lg:h-fit">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">
                {getTranslation(language, "templateEditor.preview")}
              </h2>
              <div className="relative w-full mb-6">
                <div
                  className="relative w-full max-h-[70vh] overflow-hidden cursor-pointer rounded-lg bg-black/5"
                  style={{
                    ...getAspectRatioStyle(),
                    maxWidth: "600px",
                    margin: "0 auto",
                  }}
                  // onClick={togglePlayPause}
                >
                  {selectedVideoURL ? (
                    <>
                      {/* <video
                        ref={videoRef}
                        src={selectedTemplate?.videoUrl}
                        className="w-full h-full object-contain"
                        loop
                        muted
                        autoPlay
                      /> */}

                      <video
                        ref={videoRef}
                        src={selectedVideoURL}
                        controls
                        crossOrigin="anonymous"
                        className={`object-contain h-full  w-full rounded-lg ${
                          videoText != "" && "hidden"
                        } `}
                        muted
                        autoPlay
                      />
                      <audio
                        ref={audioRef}
                        className="hidden"
                        crossOrigin="anonymous"
                      />
                      <canvas
                        ref={canvasRef}
                        className={`object-contain h-full  w-full rounded-lg ${
                          videoText == "" && "hidden"
                        } `}
                      />
                      {/* Loading Spinner */}
                      {isVideoLoading && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Loader className="w-8 h-8 text-black animate-spin" />
                        </div>
                      )}
                      {/* Text Overlay */}
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                      <Video className="w-12 h-12 text-black/30 mb-4" />
                      <p className="text-black/50 text-sm font-medium">
                        Select a template from above to preview your video
                      </p>
                      <p className="text-black/40 text-xs mt-2">
                        Choose from our collection of professional templates
                      </p>
                    </div>
                  )}
                </div>
              </div>
              {/* <div className="relative">
                <video
                  ref={videoRef}
                  src={selectedTemplate?.videoUrl}
                  controls
                  crossOrigin="anonymous"
                  className="w-full rounded-lg hidden"
                />
                <audio
                  ref={audioRef}
                  className="hidden"
                  crossOrigin="anonymous"
                />
                <canvas ref={canvasRef} className="w-full rounded-lg " />
              </div> */}
              {/* <button
                onClick={() => {
                  startRecording();
                }}
              >
                aaaaaa
              </button>{" "} */}
              {error && <p className="text-red-500 text-sm my-5">{error}</p>}
              <Button
                className="w-full"
                disabled={!selectedTemplate || isGenerating}
                onClick={startRecording}
              >
                {isGenerating ? (
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Video className="w-4 h-4 mr-2" />
                )}
                {recording || isConverting ? "Downloading" : "Download Video"}
              </Button>
            </Card>
          </div>
        </div>
      </div>

      {/* Generated Video Popup */}
    </div>
  );
}
