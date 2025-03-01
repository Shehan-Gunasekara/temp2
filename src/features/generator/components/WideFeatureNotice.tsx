import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useLanguage } from "../../auth/context/LanguageContext";
import { getTranslation } from "../../../utils/translations";

interface Props {
  onClose: () => void;
  onTryIt: () => void;
}

export function WideFeatureNotice({ onClose, onTryIt }: Props) {
  const { language } = useLanguage();
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="relative w-full mb-8"
      >
        <div className="relative backdrop-blur-xl bg-white/70 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-white/20 overflow-hidden">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 pointer-events-none" />

          {/* Content */}
          <div className="relative px-6 py-4 flex sm:flex-row flex-col items-center justify-between gap-2 sm:gap-11">
            <button
              onClick={onClose}
              className="p-1 sm:hidden flex justify-end items-end w-full rounded-full text-black/40 hover:text-black/60 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-6 ">
              {/* New dot */}
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse hidden sm:flex" />

              {/* Text content */}
              <div className="flex items-center gap-1 sm:gap-6  sm:flex-row flex-col">
                <span className="flex flex-row gap-2 ml-[-2px]">
                  <div className="w-2 h-2 rounded-full sm:hidden bg-red-500 animate-pulse" />
                  <p className="text-[10px] sm:text-sm font-medium text-black/80">
                    {getTranslation(
                      language,
                      "ugc_actor.new_feature_banner.title"
                    )}
                  </p>
                </span>
                <p className="text-sm text-black/60">
                 {getTranslation(
                  language,
                  "ugc_actor.new_feature_banner.description")}
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-4">
              <button
                onClick={onTryIt}
                className="text-sm min-w-[4.5rem]  font-medium text-black hover:text-black/70 transition-colors"
              >
                {getTranslation(
                  language,
                  "ugc_actor.new_feature_banner.try_now"
                )}{" "}
                →
              </button>

              <button
                onClick={onClose}
                className="p-1 sm:flex hidden rounded-full text-black/40 hover:text-black/60 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
