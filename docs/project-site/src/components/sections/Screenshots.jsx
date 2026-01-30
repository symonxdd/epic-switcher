import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, animate } from 'framer-motion';
import { Pause, Play } from 'lucide-react';

const screenshots = [
  { id: 1, src: '/screenshots/accounts-page.png', title: 'Main Dashboard' },
  { id: 2, src: '/screenshots/add-account-modal.png', title: 'Add Account' },
  { id: 3, src: '/screenshots/manage-page-with-hint.png', title: 'Manage Sessions' },
  { id: 4, src: '/screenshots/how-it-works-page.png', title: 'How it Works' },
  { id: 5, src: '/screenshots/settings-page-with-update-notice.png', title: 'Settings' },
];

export const Screenshots = () => {
  const [index, setIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const progress = useMotionValue(0);
  const DURATION = 5000;

  const handleIndexChange = useCallback((newIndex) => {
    if (newIndex === index) {
      setIsPaused(!isPaused);
      return;
    }
    setIndex(newIndex);
    setIsPaused(false);
    progress.set(0);
  }, [index, isPaused, progress]);

  useEffect(() => {
    if (isHovering || isPaused) return;

    const remainingDuration = DURATION * (1 - progress.get());

    const controls = animate(progress, 1, {
      duration: remainingDuration / 1000,
      ease: "linear",
      onComplete: () => {
        handleIndexChange((index + 1) % screenshots.length);
      }
    });

    return () => controls.stop();
  }, [index, isHovering, isPaused, progress, handleIndexChange]);

  return (
    <div
      className="relative w-full pb-12 pt-0"
    >
      <div className="relative max-w-[960px] mx-auto z-10">
        {/* Main Image Container */}
        <div
          className="relative aspect-[16/10] w-full overflow-hidden rounded-3xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] border border-white/5"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <AnimatePresence>
            <motion.img
              key={index}
              src={screenshots[index].src}
              alt={screenshots[index].title}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
            />
          </AnimatePresence>

        </div>

        {/* Thumbnails Container */}
        <div className="flex justify-center gap-4 mt-8 px-4">
          {screenshots.map((screen, i) => {
            const isActive = i === index;
            return (
              <button
                key={screen.id}
                onClick={() => handleIndexChange(i)}
                className={`group relative flex-1 min-w-0 max-w-[160px] aspect-video rounded-xl overflow-hidden transition-all duration-500 border-2 ${isActive
                  ? 'border-transparent z-20 shadow-lg'
                  : 'border-white/10 hover:border-white/30 grayscale hover:grayscale-0'
                  }`}
              >
                <img
                  src={screen.src}
                  alt={screen.title}
                  className="w-full h-full object-cover"
                />

                {/* Active Progress Bar */}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/40 backdrop-blur-[2px]">
                    <motion.div
                      style={{ scaleX: progress }}
                      className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)] origin-left"
                    />
                  </div>
                )}

                {/* Hover/Pause Overlay */}
                <div className={`absolute inset-0 bg-black/60 transition-opacity flex items-center justify-center p-2 text-center ${(isActive && (isHovering || isPaused)) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}>
                  {isActive ? (
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      {isPaused || isHovering ? (
                        <Play className="w-6 h-6 text-white fill-white" />
                      ) : (
                        <Pause className="w-6 h-6 text-white fill-white" />
                      )}
                    </motion.div>
                  ) : (
                    <span className="text-white text-[10px] font-bold uppercase tracking-[0.1em] scale-90 group-hover:scale-100 transition-transform">
                      {screen.title}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
