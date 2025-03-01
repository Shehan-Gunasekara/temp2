import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "../../../utils/classNames";

interface Props {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: number;
}

export function FeatureCard({ icon: Icon, title, description, delay = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ 
        duration: 0.5,
        delay,
        ease: "easeOut"
      }}
    >
      <motion.div
        className={cn(
          "h-full p-8 rounded-2xl",
          "bg-gradient-to-br from-white to-black/[0.02]",
          "border border-black/5",
          "transition-all duration-500",
          "hover:shadow-xl hover:border-black/10",
          "relative overflow-hidden group"
        )}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        {/* Animated gradient background */}
        <div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent 
                     opacity-0 group-hover:opacity-100 transition-opacity duration-700
                     -translate-x-full group-hover:translate-x-full transform
                     pointer-events-none"
          style={{ 
            backgroundSize: '200% 100%',
            transition: 'transform 1s ease-in-out, opacity 0.3s ease-in-out'
          }}
        />

        <div className="relative space-y-4">
          <motion.div
            className="w-14 h-14 rounded-xl bg-black/5 flex items-center justify-center
                       group-hover:bg-black/10 transition-colors duration-300"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            <Icon className="w-7 h-7 text-black/60 group-hover:text-black/80 transition-colors duration-300" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay + 0.2 }}
          >
            <h3 className="text-lg lg:text-xl font-medium mb-2">{title}</h3>
            <p className="text-black/60 text-sm lg:text-base leading-relaxed">
              {description}
            </p>
          </motion.div>

          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-black/[0.01] to-transparent rounded-full -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tl from-black/[0.01] to-transparent rounded-full translate-y-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
      </motion.div>
    </motion.div>
  );
}
