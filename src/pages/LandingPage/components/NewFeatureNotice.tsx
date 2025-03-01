import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../../../features/auth/context/LanguageContext";
import { getTranslation } from "../../../utils/translations";

interface Props {
  onClose: () => void;
  onTryIt: () => void;
  onLearnMore: () => void;
}

export function NewFeatureNotice({ onClose, onTryIt, onLearnMore }: Props) {
  const { language } = useLanguage();
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="fixed top-20 right-4 z-50 w-[340px]"
      >
        <div className="relative backdrop-blur-xl bg-white/70 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-white/20 overflow-hidden">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 pointer-events-none" />

          {/* Content */}
          <div className="relative p-6 space-y-4">
            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <h3 className="text-sm font-semibold tracking-tight text-black/90">
                {getTranslation(language, "ugc_actor.new_feature_banner.title")}
              </h3>
            </div>

            {/* Description */}
            <p className="text-sm text-black/60 leading-relaxed">
              {" "}
              {getTranslation(
                language,
                "ugc_actor.new_feature_banner.description"
              )}
            </p>

            {/* Buttons */}
            <div className="flex gap-2 pt-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onTryIt}
                className="flex-1 px-4 py-2.5 bg-black text-white text-sm font-medium rounded-2xl hover:bg-black/90 transition-colors relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                <span className="relative z-10">
                  {" "}
                  {getTranslation(language, "landingPage.try_now")}
                </span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onLearnMore}
                className="flex-1 px-4 py-2.5 bg-black/5 text-black text-sm font-medium rounded-2xl hover:bg-black/10 transition-colors"
              >
                {getTranslation(language, "landingPage.learn_more")}
              </motion.button>
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1 rounded-full text-black/40 hover:text-black/60 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
