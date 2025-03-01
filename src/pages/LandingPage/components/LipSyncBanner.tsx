import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, Mic, Wand2, Play, ChevronLeft, ChevronRight } from 'lucide-react';
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

export function LipSyncBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-br from-white via-white to-black/5">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-purple-500/5 to-blue-500/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-yellow-500/5 to-red-500/5 rounded-full blur-3xl animate-float-delayed" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-black/5 text-xs sm:text-sm mb-8 relative overflow-hidden group animate-multicolor-shadow">
            <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
            New Feature
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-4 bg-gradient-to-br from-black to-black/60 bg-clip-text text-transparent">
            Introducing Lip Sync
          </h2>
          <p className="text-base lg:text-xl text-black/60 max-w-2xl mx-auto">
            Add voice to your AI-generated videos with perfect lip synchronization
          </p>
        </div>

        <div className="relative p-10 border border-black/5 rounded-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
            >
              {/* Text Content */}
              <div className="text-center md:text-left space-y-6">
                {/* Progress dots */}
                <div className="flex justify-center md:justify-start gap-2">
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setCurrentSlide(index);
                        setIsAutoPlaying(false);
                      }}
                      className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                        index === currentSlide ? 'bg-black' : 'bg-black/20'
                      }`}
                    />
                  ))}
                </div>
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-black/5">
                  {slides[currentSlide].icon}
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-semibold mb-4">
                    {slides[currentSlide].title}
                  </h3>
                  <p className="text-black/60 text-base sm:text-lg max-w-md">
                    {slides[currentSlide].description}
                  </p>
                </div>

              </div>

              {/* Image */}
              <div className="relative aspect-video rounded-xl overflow-hidden bg-black/5">
                <motion.img
                  key={slides[currentSlide].image}
                  src={slides[currentSlide].image}
                  alt={slides[currentSlide].title}
                  className="w-full h-full object-cover border border-black/5 rounded-xl"
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

          {/* Navigation buttons */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between pointer-events-none">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                prevSlide();
                setIsAutoPlaying(false);
              }}
              className="pointer-events-auto h-11 w-11 rounded-full bg-white/80 backdrop-blur-sm shadow-lg -translate-x-1/2"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                nextSlide();
                setIsAutoPlaying(false);
              }}
              className="pointer-events-auto h-11 w-11 rounded-full bg-white/80 backdrop-blur-sm shadow-lg translate-x-1/2"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
} 