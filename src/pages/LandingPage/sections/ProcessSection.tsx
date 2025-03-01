import { FileText, Wand2, Download, Mic, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "../../../features/auth/context/LanguageContext";
import { getTranslation } from "../../../utils/translations";
export function ProcessSection() {
  const { language } = useLanguage();
  const steps = [
    {
      number: "01",
      icon: Sparkles,
      title: getTranslation(language, "landingPage.how_work_step_one.title"),
      description: getTranslation(
        language,
        "landingPage.how_work_step_one.description"
      ),
    },
    {
      number: "02",
      icon: Mic,
      title: getTranslation(language, "landingPage.how_work_step_two.title"),
      description: getTranslation(
        language,
        "landingPage.how_work_step_two.description"
      ),
    },
    {
      number: "03",
      icon: Wand2,
      title: getTranslation(language, "landingPage.how_work_step_three.title"),
      description: getTranslation(
        language,
        "landingPage.how_work_step_three.description"
      ),
    },
    {
      number: "04",
      icon: Download,
      title: getTranslation(language, "landingPage.how_work_step_four.title"),
      description: getTranslation(
        language,
        "landingPage.how_work_step_four.description"
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
            {" "}
            <span className="text-xl mr-2">✨</span>
            <span className="font-mono tracking-wider">
              {" "}
              {getTranslation(language, "landingPage.how_it_works")}
            </span>
          </div>

          <h2 className="text-5xl sm:text-6xl font-light mb-6">
            {getTranslation(language, "landingPage.how_it_work_title")}
          </h2>

          <p className="text-xl text-black/60 max-w-2xl mx-auto font-light">
            {getTranslation(language, "landingPage.how_it_work_title_desc")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
              }}
              className="relative group"
            >
              <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.3 }}
                className="h-full p-8 rounded-2xl border border-black/10 bg-white/50 backdrop-blur-sm hover:bg-white/80 transition-all duration-300"
              >
                <div className="relative space-y-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="w-12 h-12 rounded-xl bg-black/5 flex items-center justify-center group-hover:bg-black/10 transition-colors duration-300">
                      <step.icon className="w-6 h-6 text-black/60 group-hover:text-black/80 transition-colors duration-300" />
                    </div>
                    <span className="font-mono text-sm text-black/40">
                      {step.number}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-light mb-2">{step.title}</h3>
                    <p className="text-black/60 text-sm font-light leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>

              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 h-[2px] w-8 bg-black/10 z-10" />
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <div className="inline-block px-8 py-6 rounded-2xl border border-black/10 backdrop-blur-sm bg-white/50">
            <p className="text-lg text-black/80 max-w-2xl font-light">
              {getTranslation(language, "landingPage.how_it_works_desc")}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
