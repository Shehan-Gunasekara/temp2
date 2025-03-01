import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Video, Mic, Wand2, Play } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface Slide {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  image: string;
}

const slides: Slide[] = [
  {
    title: "Upload Your Video",
    description: "Start by uploading your AI-generated video or any video you want to add speech to.",
    icon: <Video className="w-8 h-8" />,
    color: "from-purple-500/20 to-blue-500/20",
    image: "/images/features/upload-video.png"
  },
  {
    title: "Add Voice",
    description: "Upload an audio file, record your voice directly, or paste an audio URL.",
    icon: <Mic className="w-8 h-8" />,
    color: "from-blue-500/20 to-green-500/20",
    image: "/images/features/voice-record.png"
  },
  {
    title: "Generate Lip Sync",
    description: "Our AI will automatically sync the lip movements with your audio.",
    icon: <Wand2 className="w-8 h-8" />,
    color: "from-green-500/20 to-yellow-500/20",
    image: "/images/features/lip-sync.png"
  },
  {
    title: "Ready to Share",
    description: "Download your video with perfectly synced lip movements and natural speech.",
    icon: <Play className="w-8 h-8" />,
    color: "from-yellow-500/20 to-red-500/20",
    image: "/images/features/share-video.png"
  }
];

interface Props {
  onClose: () => void;
  onGetStarted: () => void;
}

export function LipSyncFeatureNotice({ onClose, onGetStarted }: Props) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? prev : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? prev : prev - 1));
  };

  // Handle keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full relative overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 transition-colors z-10"
          >
            <X className="w-5 h-5 text-black/60" />
          </button>

          {/* New Feature Badge */}
          <div className="absolute top-6 left-6 z-10">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-black/5 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
              Announcement! New Feature
            </div>
          </div>

          <div className="p-8 pt-16">
            {/* Content */}
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
                >
                  {/* Text Content */}
                  <div className="text-center md:text-left">
                    <div className="flex justify-center md:justify-start mb-6">
                      <div className="w-16 h-16 rounded-2xl bg-black/5 flex items-center justify-center">
                        {slides[currentSlide].icon}
                      </div>
                    </div>

                    <h3 className="text-2xl font-semibold mb-4">
                      {slides[currentSlide].title}
                    </h3>
                    <p className="text-black/60 mb-8 max-w-md">
                      {slides[currentSlide].description}
                    </p>

                    {/* Progress dots */}
                    <div className="flex justify-center md:justify-start gap-2 mb-8">
                      {slides.map((_, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                            index === currentSlide ? 'bg-black' : 'bg-black/20'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Image */}
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-black/5">
                    <motion.img
                      key={slides[currentSlide].image}
                      src={slides[currentSlide].image}
                      alt={slides[currentSlide].title}
                      className="w-full h-full object-cover border-2 border-white/10 rounded-xl"
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                    />
                    {/* Gradient overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${slides[currentSlide].color} opacity-10`} />
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex justify-between items-center mt-8">
                <Button
                  variant="ghost"
                  onClick={prevSlide}
                  disabled={currentSlide === 0}
                  className={currentSlide === 0 ? 'opacity-50 cursor-not-allowed' : ''}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>

                {currentSlide === slides.length - 1 ? (
                  <Button onClick={onGetStarted}>
                    Get Started
                  </Button>
                ) : (
                  <Button onClick={nextSlide}>
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
} 