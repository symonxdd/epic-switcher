import React from 'react';
import { motion } from 'framer-motion';
import { Coffee } from 'lucide-react';

export const SupportCoffee = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1, duration: 0.5 }}
      className="fixed bottom-8 right-8 z-40"
    >
      <a
        href="https://buymeacoffee.com/symonxd"
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center gap-3 p-3 px-4 rounded-3xl bg-white/40 dark:bg-background/20 backdrop-blur-xl border border-black/10 dark:border-border/50 hover:border-primary/50 dark:hover:border-primary/50 transition-all duration-300 shadow-xl dark:shadow-lg hover:shadow-primary/10"
      >
        {/* Animated Steam */}
        <div className="absolute -top-10 left-4 pointer-events-none">
          <svg width="60" height="50" viewBox="0 0 60 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            {[0, 1, 2].map((i) => (
              <motion.path
                key={i}
                d={`M${15 + i * 12} 45 Q${10 + i * 12} 35 ${20 + i * 12} 25 T${15 + i * 12} 5`}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0, y: 10, x: 0 }}
                animate={{
                  pathLength: [0, 0.45, 0.45, 0],
                  pathOffset: [0, 0, 0.55, 1],
                  opacity: [0, 0.4, 0.3, 0],
                  y: [12, 5, -5, -12],
                  x: [0, i % 2 === 0 ? 2 : -2, 0]
                }}
                transition={{
                  duration: 4 + i * 0.5,
                  repeat: Infinity,
                  delay: i * 1.5,
                  ease: "linear",
                  times: [0, 0.3, 0.8, 1]
                }}
                className="text-orange-950 dark:text-foreground/40"
              />
            ))}
          </svg>
        </div>

        {/* Coffee Cup (Glassmorphism) */}
        <div className="relative w-12 h-12 flex items-center justify-center rounded-2xl bg-gradient-to-br from-black/5 to-black/10 dark:from-white/10 dark:to-white/5 transition-all duration-500 overflow-hidden border border-black/10 dark:border-white/20 shadow-inner">
          {/* Latte Liquid Layer */}
          <motion.div
            className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#4A2C2A] to-[#A67B5B] dark:from-orange-900/40 dark:to-orange-400/30"
            style={{ height: '70%' }}
            animate={{
              height: ['68%', '72%', '68%'],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          {/* Foam Layer */}
          <motion.div
            className="absolute inset-x-0 bg-white/60 dark:bg-white/10 backdrop-blur-[2px]"
            style={{ height: '18%', top: '28%' }}
            animate={{
              opacity: [0.6, 0.9, 0.6]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <Coffee className="w-6 h-6 text-[#F5F5F5] dark:text-orange-200/80 transition-transform relative z-10 drop-shadow-sm" />

          {/* Glossy reflection */}
          <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/40 dark:from-white/20 to-transparent pointer-events-none" />
        </div>

        <div className="flex flex-col">
          <span className="text-xs font-semibold text-black/70 dark:text-foreground/80 group-hover:text-primary transition-colors tracking-tight">
            Like this project?
          </span>
          <span className="text-[11px] text-black/50 dark:text-muted-foreground whitespace-nowrap">
            Feel free to support.
          </span>
        </div>

        {/* Shine effect */}
        <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-900/[0.08] dark:via-white/10 to-transparent -translate-x-full"
            animate={{
              translateX: ["100%", "-100%"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
              repeatDelay: 2
            }}
          />
        </div>
      </a>
    </motion.div>
  );
};
