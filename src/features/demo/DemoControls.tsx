import { useEffect, useState, useRef } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { useLanguage } from "../auth/context/LanguageContext";
import { getTranslation } from "../../utils/translations";

interface DemoControlsProps {
  onClick: () => void;
  loading?: boolean;
  currentprogress?: number;
  totalprogress?: number;
}

export function DemoControls({
  onClick,
  loading = false,
  currentprogress = 0,
  totalprogress = 0,
}: DemoControlsProps) {
  const { language } = useLanguage();
  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={() => {
          if (loading) return;
          onClick();
        }}
        disabled={loading}
        className="relative px-8 min-w-[180px] inline-flex items-center justify-center rounded-full font-medium transition-all duration-200 focus:outline-none bg-black text-white hover:bg-black/90 disabled:cursor-not-allowed text-xs sm:text-sm md:text-lg px-5 sm:px-6 py-3 sm:py-4 overflow-hidden"
      >
        {loading && (
          <div
            className="absolute left-0 top-0 h-full bg-white bg-opacity-50 transition-all duration-1000 ease-out"
            style={{ width: `${currentprogress}%` }}
          />
        )}
        <span className="relative z-10 flex items-center justify-center">
          {totalprogress === 0 && loading ? (
            <>
              <Sparkles className="h-5 w-5 mr-2" />
              {getTranslation(language, "demo_page.hang_tight")}
            </>
          ) : (
            <>
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  {Math.round(currentprogress)}%
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-2" />
                  {getTranslation(language, "demo_page.generate_actor")}
                </>
              )}
            </>
          )}
        </span>
      </button>
    </div>
  );
}
