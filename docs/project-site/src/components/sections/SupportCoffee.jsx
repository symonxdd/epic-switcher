import React from 'react';
import { motion } from 'framer-motion';
import { Coffee } from 'lucide-react';

export const SupportCoffee = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1, duration: 0.5 }}
      className="fixed bottom-8 right-8 z-[100]"
    >
      <a
        href="https://paypal.me/symonxd"
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center gap-3 p-3 px-4 rounded-3xl bg-background/20 backdrop-blur-xl border border-border/50 hover:border-primary/50 transition-all duration-300 shadow-lg hover:shadow-primary/10"
      >
        {/* Animated Steam */}
        <div className="absolute -top-8 left-6 pointer-events-none">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            {[0, 1, 2].map((i) => (
              <motion.path
                key={i}
                d={`M${10 + i * 10} 35 Q${5 + i * 10} 25 ${15 + i * 10} 15 T${10 + i * 10} 5`}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0, y: 5 }}
                animate={{
                  pathLength: [0, 1, 0.5],
                  opacity: [0, 0.3, 0],
                  y: [-5, -20],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  delay: i * 0.6,
                  ease: "easeInOut",
                }}
                className="text-foreground/40"
              />
            ))}
          </svg>
        </div>

        {/* Coffee Cup (Glassmorphism) */}
        <div className="relative w-12 h-12 flex items-center justify-center rounded-2xl bg-gradient-to-br from-white/10 to-white/5 group-hover:from-white/20 group-hover:to-white/10 group-hover:scale-110 transition-all duration-500 overflow-hidden border border-white/20 shadow-inner">
          {/* Latte Liquid Layer */}
          <motion.div
            className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-orange-900/40 to-orange-400/30"
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
            className="absolute inset-x-0 bg-white/10 backdrop-blur-sm"
            style={{ height: '15%', top: '30%' }}
            animate={{
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <Coffee className="w-6 h-6 text-orange-200/80 group-hover:text-orange-100 transition-colors relative z-10 drop-shadow-sm" />

          {/* Glossy reflection */}
          <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
        </div>

        <div className="flex flex-col">
          <span className="text-xs font-bold text-foreground/80 group-hover:text-primary transition-colors uppercase tracking-wider">
            Support Project
          </span>
          <span className="text-[11px] text-muted-foreground whitespace-nowrap">
            Buy me a coffee
          </span>
        </div>

        {/* Shine effect */}
        <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full"
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
