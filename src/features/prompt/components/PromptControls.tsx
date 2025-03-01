import { useEffect, useState, useRef } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { useAuth } from "../../auth/context/useAuth";
import { useLanguage } from "../../auth/context/LanguageContext";
import { getTranslation } from "../../../utils/translations";

interface PromptControlsProps {
  onClick: () => void;
  loading?: boolean;
  currentprogress?: number;
  totalprogress?: number;
}

export function PromptControls({
  onClick,
  loading = false,
  currentprogress,
  totalprogress,
}: PromptControlsProps) {
  const [progress, setProgress] = useState(0);
  const timer = useRef<NodeJS.Timeout | null>(null);
  const { language } = useLanguage();

  const { userData, isEnableEnhanceUGCActor, ugcModel } = useAuth();
  // useEffect(() => {
  //   if (!loading) {
  //     setProgress(0);
  //     if (timer.current) {
  //       clearInterval(timer.current);
  //     }
  //     return;
  //   }

  //   timer.current = setInterval(() => {
  //     setProgress((prev) => {
  //       if (prev >= 100) {
  //         if (timer.current) {
  //           clearInterval(timer.current);
  //         }
  //         return 100;
  //       }
  //       // Ease out the progress
  //       const remaining = 100 - prev;
  //       return prev + remaining * 0.015; // Adjust this value to change the easing speed
  //     });
  //   }, 1000);

  //   return () => {
  //     if (timer.current) {
  //       clearInterval(timer.current);
  //     }
  //   };
  // }, [loading]);

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
        timer.current = setInterval(
          () => {
            setProgress((prev) => {
              if (prev < currentProgressPrecentage) {
                return prev + 1;
              } else {
                clearInterval(timer.current!);
              }
              return prev;
            });
          },
          ugcModel == "V 01.2" ? 4000 : isEnableEnhanceUGCActor ? 4000 : 3000
        );
      }
    }
    return () => {
      if (timer.current) {
        clearInterval(timer.current);
      }
    };
  }, [currentprogress, totalprogress, loading]);

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={() => {
          if (loading) return;
          setProgress(0);
          onClick();
        }}
        disabled={loading}
        className={`px-8 min-w-[180px] inline-flex items-center justify-center rounded-full font-medium transition-all duration-200 focus:outline-none bg-black text-white ${
          !loading && "hover:bg-black/90 "
        } ${
          loading && "cursor-not-allowed"
        } text-xs sm:text-sm md:text-lg px-5 sm:px-6 py-3 sm:py-4`}
      >
        {" "}

        {totalprogress === 0 && loading ? (
          <>
            <Sparkles className="h-5 w-5 mr-2" />
            {getTranslation(language, "ugc_actor.ugc_video.hang_tight")}
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
                <Sparkles className="h-5 w-5 mr-2" />
                {getTranslation(language, "ugc_actor.ugc_video.generate_actor")}
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
  );
}
