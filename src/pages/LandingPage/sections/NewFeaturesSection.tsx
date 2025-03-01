import React from "react";
import { motion } from "framer-motion";
import {
  ImagePlus,
  FileText,
  Wand2,
  Download,
  Mic,
  Video,
  Play,
  Repeat,
} from "lucide-react";
import { useLanguage } from "../../../features/auth/context/LanguageContext";
import { getTranslation } from "../../../utils/translations";

export function NewFeaturesSection() {
  const { language } = useLanguage();
  const features = [
    {
      title: getTranslation(language, "landingPage.featutes.featureOne.title"),
      description: getTranslation(
        language,
        "landingPage.featutes.featureOne.description"
      ),
      steps: [
        {
          icon: <FileText className="w-6 h-6" />,
          title: getTranslation(
            language,
            "landingPage.featutes.featureOne.steps_one.title"
          ),
          description: getTranslation(
            language,
            "landingPage.featutes.featureOne.steps_one.description"
          ),
        },
        {
          icon: <Wand2 className="w-6 h-6" />,
          title: getTranslation(
            language,
            "landingPage.featutes.featureOne.steps_two.title"
          ),
          description: getTranslation(
            language,
            "landingPage.featutes.featureOne.steps_two.description"
          ),
        },
        {
          icon: <Download className="w-6 h-6" />,
          title: getTranslation(
            language,
            "landingPage.featutes.featureOne.steps_three.title"
          ),
          description: getTranslation(
            language,
            "landingPage.featutes.featureOne.steps_three.description"
          ),
        },
      ],
      image: "/images/features/upload-video.png",
      link: "/ugc-actor",
      gradient: "from-green-500/10 via-emerald-500/10 to-teal-500/10",
    },
    {
      title: getTranslation(language, "landingPage.featutes.featureTwo.title"),
      description: getTranslation(
        language,
        "landingPage.featutes.featureTwo.description"
      ),
      steps: [
        {
          icon: <Video className="w-6 h-6" />,
          title: getTranslation(
            language,
            "landingPage.featutes.featureTwo.steps_one.title"
          ),
          description: getTranslation(
            language,
            "landingPage.featutes.featureTwo.steps_one.description"
          ),
        },
        {
          icon: <Mic className="w-6 h-6" />,
          title: getTranslation(
            language,
            "landingPage.featutes.featureTwo.steps_two.title"
          ),
          description: getTranslation(
            language,
            "landingPage.featutes.featureTwo.steps_two.description"
          ),
        },
        {
          icon: <Play className="w-6 h-6" />,
          title: getTranslation(
            language,
            "landingPage.featutes.featureTwo.steps_three.title"
          ),
          description: getTranslation(
            language,
            "landingPage.featutes.featureTwo.steps_three.description"
          ),
        },
      ],
      image: "/images/features/lip-sync.png",
      link: "/ugc-actor",
      gradient: "from-blue-500/10 via-indigo-500/10 to-violet-500/10",
    },
    {
      title: getTranslation(
        language,
        "landingPage.featutes.featureThree.title"
      ),
      description: getTranslation(
        language,
        "landingPage.featutes.featureThree.description"
      ),

      isNew: true,

      steps: [
        {
          icon: <ImagePlus className="w-6 h-6" />,
          title: getTranslation(
            language,
            "landingPage.featutes.featureThree.steps_one.title"
          ),
          description: getTranslation(
            language,
            "landingPage.featutes.featureThree.steps_one.description"
          ),
        },
        {
          icon: <FileText className="w-6 h-6" />,
          title: getTranslation(
            language,
            "landingPage.featutes.featureThree.steps_two.title"
          ),
          description: getTranslation(
            language,
            "landingPage.featutes.featureThree.steps_two.description"
          ),
        },
        {
          icon: <Repeat className="w-6 h-6" />,
          title: getTranslation(
            language,
            "landingPage.featutes.featureThree.steps_three.title"
          ),
          description: getTranslation(
            language,
            "landingPage.featutes.featureThree.steps_three.description"
          ),
        },
      ],
      image: "/images/features/outF.jpg",
      link: "/consistent-actor",
      gradient: "from-purple-500/10 via-pink-500/10 to-rose-500/10",
    },
    {
      title: "Create templates",
      description:
        "Create a template or pick one from our collection then add your caption!",
      steps: [
        {
          icon: <Wand2 className="w-6 h-6" />,
          title: "Select",
          description: "Choose or create a template.",
        },
        {
          icon: <FileText className="w-6 h-6" />,
          title: "Add Caption",
          description: "Add your caption to the template.",
        },
        {
          icon: <Download className="w-6 h-6" />,
          title: getTranslation(
            language,
            "landingPage.featutes.featureOne.steps_three.title"
          ),
          description: getTranslation(
            language,
            "landingPage.featutes.featureOne.steps_three.description"
          ),
        },
      ],
      image: "/images/features/generateTemplate.png",
      link: "/template-editor",
      gradient: "from-green-500/10 via-emerald-500/10 to-teal-500/10",
    },
  ];

  return (
    <section className="py-16 relative overflow-hidden" id="new-features">
      <div className="max-w-7xl mx-auto px-6 relative">
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center px-6 py-2.5 rounded-full border border-black/10 backdrop-blur-sm bg-white/50 text-sm mb-8">
              <span className="text-xl mr-2">✨</span>{" "}
              <span className="font-mono tracking-wider">
                {getTranslation(language, "landingPage.second_feature_section")}
              </span>
            </div>

            <h2 className="text-5xl sm:text-6xl font-light mb-6">
              {getTranslation(language, "landingPage.second_feature_title")}
            </h2>

            <p className="text-xl text-black/60 max-w-2xl mx-auto font-light">
              {getTranslation(language, "landingPage.second_feature_desc")}
            </p>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: index * 0.2 }}
              className={feature.isNew ? "lg:scale-105" : ""}
            >
              <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.3 }}
                className="relative h-full p-8 rounded-2xl border border-black/10 bg-white/50 backdrop-blur-sm hover:bg-white/80 transition-all duration-300"
              >
                {/* New Label */}
                {feature.isNew && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute top-4 right-4"
                  >
                    <div className="px-3 py-1 rounded-full border border-black/10 backdrop-blur-sm bg-white/50">
                      <p className="text-xs font-mono">NEW</p>
                    </div>
                  </motion.div>
                )}

                {/* Feature Content */}
                <div className="space-y-6 ">
                  <div>
                    <h3 className="text-xl lg:text-lg xl:text-xl font-light mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-black/60 text-sm lg:text-xs xl:text-sm  font-light">
                      {feature.description}
                    </p>
                  </div>

                  {/* Feature Image */}
                  <div className="relative aspect-video rounded-xl overflow-hidden border border-black/10">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>

                  {/* Feature Steps */}
                  <div className="grid grid-cols-3 gap-4 ">
                    {feature.steps.map((step, stepIndex) => (
                      <div key={step.title} className="text-center group/step">
                        <motion.div
                          whileHover={{ scale: 1.1, y: -2 }}
                          className="xl:w-12 lg:w-7 w-12 xl:h-12 lg:h-7 h-12  rounded-xl bg-black/5 flex items-center justify-center mx-auto mb-2 group-hover/step:bg-black/10 transition-all duration-300"
                        >
                          {step.icon}
                        </motion.div>
                        <h4 className="font-light mb-1 lg:text-[10px] xs:text-xs text-xs">
                          {step.title}
                        </h4>
                        <p className="text-black/60 lg:text-[9px] xs:text-xs text-xs font-light">
                          {step.description}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Try Button */}

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      window.history.pushState({}, "", feature.link);
                      window.dispatchEvent(new PopStateEvent("popstate"));
                    }}
                    className="w-full  px-6 py-3 rounded-full border border-black/10 bg-white/50 backdrop-blur-sm hover:bg-white/80 font-light lg:text-[10px] xs:text-sm text-sm transition-all duration-300"
                  >
                    Try {feature.title}
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
