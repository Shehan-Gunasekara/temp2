import { ArrowRight, Sparkles } from "lucide-react";
import { DemoVideo } from "../components/DemoVideo";
import { motion } from "framer-motion";
import { useLanguage } from "../../../features/auth/context/LanguageContext";
import { getTranslation } from "../../../utils/translations";

interface Props {
  onGetStarted: () => void;
}

export function HeroSection({ onGetStarted }: Props) {
  const { language } = useLanguage();
  return (
    <section className="relative min-h-screen overflow-hidden pb-16">
      {/* Grid background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,_transparent_98%,_rgba(0,0,0,0.05)_98%,_rgba(0,0,0,0.05)_100%)] bg-[length:10px_10px]" />
      </div>

      {/* Floating Bubble */}
      <div className="absolute -top-40 -right-40 -z-10">
        {/* <FloatingBubble /> */}
      </div>

      <div className="relative max-w-7xl mx-auto px-6  pt-10 sm:pt-32">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center px-6  rounded-full border border-black/10 backdrop-blur-sm bg-white/50 text-sm mb-8">
              <Sparkles className="w-6 h-6 m-2 text-yellow-500 stroke-[1.5]" />
              <span className="font-mono tracking-wider">
                {getTranslation(language, "landingPage.ai_actor_gen")}
              </span>
            </div>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-light leading-tight mb-6 max-w-4xl tracking-tight"
          >
            {getTranslation(language, "landingPage.hero_title")}
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-xl text-black/60 mb-12 max-w-2xl font-light"
          >
            {getTranslation(language, "landingPage.hero_titile_descriptin")}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-4 mb-16"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group relative px-8 py-4 bg-black text-white rounded-full font-light text-lg inline-flex items-center justify-center gap-3 overflow-hidden"
              onClick={onGetStarted}
            >
              <span className="relative z-10">
                {" "}
                {getTranslation(language, "landingPage.start_create_btn")}
              </span>
              <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                window.history.pushState({}, "", "/demo");
                window.dispatchEvent(new PopStateEvent("popstate"));
              }}
              className="px-8 py-4 bg-white text-black rounded-full font-light text-lg border border-black/10 hover:bg-black/5 transition-colors"
            >
              {getTranslation(language, "landingPage.try_demo_btn")}
            </motion.button>
          </motion.div>

          {/* Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="w-full max-w-6xl mx-auto"
          >
            <div className="relative rounded-3xl overflow-hidden border border-black/10 backdrop-blur-sm bg-white/50 p-8">
              <div className="relative flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-black/20" />
                    <div className="w-3 h-3 rounded-full bg-black/20" />
                    <div className="w-3 h-3 rounded-full bg-black/20" />
                  </div>
                  <h3 className="text-sm font-light text-black/60">
                    {getTranslation(language, "landingPage.preview_title")}
                  </h3>
                </div>
                <div className="flex items-center gap-4 text-sm text-black/40">
                  <span className="font-mono">
                    {" "}
                    {getTranslation(language, "landingPage.preview_desc")}
                  </span>
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                </div>
              </div>

              {/* Video grid */}
              <div className="relative">
                <DemoVideo />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
