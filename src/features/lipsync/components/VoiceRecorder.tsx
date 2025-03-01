import { useState, useRef } from "react";
import { Mic, Square, Loader2 } from "lucide-react";
import { Button } from "../../../components/ui/Button";

interface VoiceRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  isUploadingAudio: boolean;
}

export function VoiceRecorder({
  onRecordingComplete,
  isUploadingAudio,
}: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        onRecordingComplete(audioBlob);
        chunksRef.current = [];

        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <Button
      variant="secondary"
      onClick={isRecording ? stopRecording : startRecording}
      disabled={isUploadingAudio}
      className="w-full"
    >
      {isUploadingAudio ? (
        <p className="text-[10px] sm:text-sm flex flex-row items-center">
          <Loader2 className=" w-3 h-3 sm:w-4 sm:h-4 mr-2 animate-spin" />
          Preparing...
        </p>
      ) : isRecording ? (
        <p className="text-[10px] sm:text-sm flex flex-row items-center">
          <Square className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-red-500" />
          Stop Recording
        </p>
      ) : (
        <p className="text-[10px] sm:text-sm flex flex-row items-center">
          <Mic className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
          Record Voice
        </p>
      )}
    </Button>
  );
}
