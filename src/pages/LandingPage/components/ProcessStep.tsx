import { LucideIcon } from "lucide-react";
import { cn } from "../../../utils/classNames";
import { motion } from "framer-motion";

interface Props {
  number: number;
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: number;
}

export function ProcessStep({ number, icon: Icon, title, description, delay = 0 }: Props) {
  return (
    <motion.div 
      className="relative group"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ 
        duration: 0.5,
        delay,
        ease: "easeOut"
      }}
    >
      <div
        className={cn(
          "text-center p-6 rounded-2xl",
          "transition-all duration-500",
          "bg-gradient-to-br from-white to-black/[0.02]",
          "border border-black/5 shadow-sm",
          "hover:shadow-xl hover:border-black/10",
          "relative overflow-hidden group"
        )}
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

        <div className="relative">
          <motion.div 
            className="relative inline-block"
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            <div className="w-16 h-16 rounded-2xl bg-black/5 flex items-center justify-center mx-auto mb-6 
                          group-hover:bg-black/10 transition-colors duration-300">
              <Icon className="h-8 w-8 text-black/60 group-hover:text-black/80 transition-colors duration-300" />
            </div>
            <motion.div 
              className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-black flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring",
                stiffness: 300,
                damping: 20,
                delay: delay + 0.2
              }}
            >
              <span className="text-white text-sm font-medium">{number}</span>
            </motion.div>
          </motion.div>

          <motion.h3 
            className="text-base lg:text-xl font-medium mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.3 }}
          >
            {title}
          </motion.h3>
          <motion.p 
            className="text-black/60 text-xs sm:text-sm leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.4 }}
          >
            {description}
          </motion.p>
        </div>
      </div>

      {number < 4 && (
        <motion.div 
          className="hidden md:block absolute top-1/2 -right-4 h-[2px] bg-black/10"
          initial={{ width: 0 }}
          whileInView={{ width: "2rem" }}
          viewport={{ once: true }}
          transition={{ 
            duration: 0.5,
            delay: delay + 0.5,
            ease: "easeOut"
          }}
        />
      )}
    </motion.div>
  );
}
