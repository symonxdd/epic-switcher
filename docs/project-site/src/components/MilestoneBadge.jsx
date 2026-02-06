import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export const MilestoneBadge = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
        delay: 1.2
      }}
      className="absolute -top-12 -right-12 md:-right-20 pointer-events-none select-none z-30 hidden sm:block"
    >
      <motion.div
        animate={{
          y: [0, -8, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="relative w-32 h-32 md:w-40 md:h-40 flex items-center justify-center"
      >
        {/* Rotating Text Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute inset-0"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <path
                id="textPath"
                d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
              />
            </defs>
            <text className="text-[7.5px] font-bold tracking-[0.2em] fill-foreground/30 uppercase">
              <textPath href="#textPath">
                Built with precision • Epic Switcher • V1.0 •
              </textPath>
            </text>
          </svg>
        </motion.div>

        {/* Inner Glass Core */}
        <div className="relative group">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-white/10 flex items-center justify-center shadow-lg overflow-hidden">
            <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-foreground/40" />

            {/* Shimmer/Glint effect */}
            <motion.div
              animate={{
                left: ['-150%', '150%']
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatDelay: 4,
                ease: "easeInOut"
              }}
              className="absolute top-0 w-20 h-full bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent skew-x-12"
            />
          </div>

          {/* Subtle Outer Glow */}
          <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl -z-10 opacity-50 transition-opacity group-hover:opacity-80" />
        </div>
      </motion.div>
    </motion.div>
  );
};
