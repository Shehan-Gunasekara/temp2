import { Brain, Mic, Wand2, Shield, Cuboid as Cube, Code } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "../../../features/auth/context/LanguageContext";
import { getTranslation } from "../../../utils/translations";
export function FeaturesSection() {
  const { language } = useLanguage();
  const features = [
    {
      icon: Brain,
      title: getTranslation(language, "landingPage.key_feature_one.title"),
      description: getTranslation(
        language,
        "landingPage.key_feature_one.description"
      ),
    },
    {
      icon: Wand2,
      title: getTranslation(language, "landingPage.key_feature_two.title"),
      description: getTranslation(
        language,
        "landingPage.key_feature_two.description"
      ),
    },
    {
      icon: Mic,
      title: getTranslation(language, "landingPage.key_feature_three.title"),
      description: getTranslation(
        language,
        "landingPage.key_feature_three.description"
      ),
    },
  ];

  return (
    <section className="py-16 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center px-6 py-2.5 rounded-full border border-black/10 backdrop-blur-sm bg-white/50 text-sm mb-8">
            <span className="text-xl mr-2">✨</span>{" "}
            <span className="font-mono tracking-wider">
              {" "}
              {getTranslation(language, "landingPage.key_features")}
            </span>
          </div>

          <h2 className="text-5xl sm:text-6xl font-light mb-6">
            {getTranslation(language, "landingPage.key_feature_titile")}
          </h2>

          <p className="text-xl text-black/60 max-w-2xl mx-auto font-light">
            {getTranslation(language, "landingPage.key_feature_title_desc")}
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.3 }}
                className="h-full p-8 rounded-2xl border border-black/10 bg-white/50 backdrop-blur-sm hover:bg-white/80 transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-black/5 flex items-center justify-center group-hover:bg-black/10 transition-colors duration-300">
                    <feature.icon className="w-6 h-6 text-black/60 group-hover:text-black/80 transition-colors duration-300" />
                  </div>

                  <h3 className="text-xl font-light">{feature.title}</h3>
                  <p className="text-black/60 font-light leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>{" "}
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <div className="inline-block px-8 py-6 rounded-3xl bg-white/40 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
            <p className="text-lg text-black/80 max-w-2xl">
              {getTranslation(language, "landingPage.key_feature_desc")}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
