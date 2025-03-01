import { motion } from "framer-motion";
import { Users, ArrowRight, Mic } from "lucide-react";
import { useLanguage } from "../../../features/auth/context/LanguageContext";
import { getTranslation } from "../../../utils/translations";

interface FeaturedActor {
  id: number;
  name: string;
  title: string;
  thumbnail: string;
  videoUrl: string;
  rating: number;
  verified: boolean;
}

export function AIGallerySection() {
  const { language } = useLanguage();
  const featuredActors = getTranslation(language, "landingPage.section.featuredActors") as unknown as FeaturedActor[];
  return (
    <section className="py-10 relative overflow-hidden" id="ai-gallery">
      <div className="max-w-7xl mx-auto px-6 relative">
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-4"
          >
            <div className="inline-flex items-center px-6 py-2.5 rounded-full border border-black/10 backdrop-blur-sm bg-white/50 text-sm mb-8">
              <span className="text-xl mr-2">✨</span>{" "}
              <span className="font-mono tracking-wider"> {getTranslation(language, "landingPage.section.subtitle")}</span>
            </div>

            <h2 className="text-4xl sm:text-5xl font-light mb-4">
            {getTranslation(language, "landingPage.section.title")}
            </h2>
            <p className="text-xl text-black/60 max-w-2xl mx-auto font-light">
             {getTranslation(language, "landingPage.section.description")}
            </p>
          </motion.div>
        </div>

        {/* Featured Actors Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
          {featuredActors.map((actor, index) => (
            <motion.div
              key={actor.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="relative group rounded-xl overflow-hidden bg-white/40 backdrop-blur-xl border border-white/20 shadow-lg h-full">
                <div className="aspect-[2/3] relative overflow-hidden">
                  <img
                    src={actor.thumbnail}
                    alt={actor.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Info Overlay */}

                  <div className="absolute inset-x-0 bottom-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-xs font-mono">VERIFIED</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full sm:text-sm text-xs font-light hover:bg-white/30 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        const encodedVideoUrl = encodeURIComponent(
                          actor.videoUrl
                        );
                        window.history.pushState(
                          {},
                          "",
                          `/ugc-actor?step=2&video=${encodedVideoUrl}`
                        );
                        window.dispatchEvent(new PopStateEvent("popstate"));
                      }}
                    >
                      <Mic className="sm:w-4 w-3 sm:h-4 h-3 mr-2 inline-block" />
                      Lip Sync
                    </motion.button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-sm mb-1 truncate">
                    {actor.name}
                  </h3>
                  <p className="text-xs text-black/60 truncate">
                    {actor.title}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              window.history.pushState({}, "", "/ai-gallery");
              window.dispatchEvent(new PopStateEvent("popstate"));
            }}
            className="group relative px-8 py-3 bg-black text-white rounded-full font-light text-lg inline-flex items-center justify-center gap-2"
          >
            <Users className="w-5 h-5" />
            <span>{getTranslation(language,"landingPage.section.cta.label")}</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
