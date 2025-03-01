import { useState, useEffect } from "react";
import { HeroSection } from "./sections/HeroSection";
import { ProcessSection } from "./sections/ProcessSection";
import { FeaturesSection } from "./sections/FeaturesSection";
import { NewFeaturesSection } from "./sections/NewFeaturesSection";
import { NewFeatureNotice } from "./components/NewFeatureNotice";
import { AIGallerySection } from "./components/AIGallerySection";
import { motion, useScroll, useSpring } from "framer-motion";

export function LandingPage() {
  const [showFeatureNotice, setShowFeatureNotice] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFeatureNotice(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleCloseNotice = () => {
    setShowFeatureNotice(false);
  };

  const handleTryIt = () => {
    window.history.pushState({}, "", "/template-editor");
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  const handleLearnMore = () => {
    const characterSection = document.getElementById("new-features");
    if (characterSection) {
      characterSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    setShowFeatureNotice(false);
  };

  const handleGetStarted = () => {
    window.history.pushState({}, "", "/ugc-actor");
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  return (
    <div className="min-h-screen bg-white relative">
      {/* Progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-black/10 z-50 origin-left"
        style={{ scaleX }}
      />

      {/* Background gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-black/5 opacity-90" />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 1.5 }}
          className="absolute top-0 left-1/4 w-[45rem] h-[45rem] bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-pink-500/10 rounded-full blur-[128px] animate-blur-float"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 1.5, delay: 0.2 }}
          className="absolute bottom-0 right-1/4 w-[40rem] h-[40rem] bg-gradient-to-br from-blue-500/10 via-green-500/10 to-yellow-500/10 rounded-full blur-[128px] animate-blur-float"
        />
      </div>

      {/* Content */}
      <div className="relative">
        {showFeatureNotice && (
          <NewFeatureNotice
            onClose={handleCloseNotice}
            onTryIt={handleTryIt}
            onLearnMore={handleLearnMore}
          />
        )}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <HeroSection onGetStarted={handleGetStarted} />
        </motion.div>{" "}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <NewFeaturesSection />
        </motion.div>{" "}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <AIGallerySection />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <ProcessSection />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <FeaturesSection />
        </motion.div>
      </div>
    </div>
  );
}
