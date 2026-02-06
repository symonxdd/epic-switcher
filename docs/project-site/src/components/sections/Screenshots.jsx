import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, animate } from 'framer-motion';
import { Pause, Play } from 'lucide-react';

const screenshots = [
  { id: 1, src: '/screenshots/accounts.png', title: 'Accounts' },
  { id: 2, src: '/screenshots/customize-avatar.png', title: 'Customize Avatar' },
  { id: 3, src: '/screenshots/manage.png', title: 'Manage' },
  { id: 4, src: '/screenshots/add-session.png', title: 'Add Session' },
  { id: 5, src: '/screenshots/edit-nickname.png', title: 'Edit Nickname' },
  { id: 6, src: '/screenshots/delete-session.png', title: 'Delete Session' },
  { id: 7, src: '/screenshots/transparency.png', title: 'Trust & Transparency' },
  { id: 8, src: '/screenshots/settings-update-notice.png', title: 'Settings' },
];

export const Screenshots = () => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const progress = useMotionValue(0);
  const DURATION = 5000;

  const handleIndexChange = useCallback((newIndex) => {
    if (newIndex === index) {
      setIsPaused(!isPaused);
      return;
    }
    setDirection(newIndex > index ? 1 : -1);
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
        setDirection(1); // Auto-play always slides forward
        handleIndexChange((index + 1) % screenshots.length);
      }
    });

    return () => controls.stop();
  }, [index, isHovering, isPaused, progress, handleIndexChange]);

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? '100%' : '-100%',
      scale: 1.1,
      filter: 'blur(10px)',
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      scale: 1,
      filter: 'blur(0px)',
      opacity: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      scale: 0.95,
      filter: 'blur(5px)',
      opacity: 0,
    }),
  };

  return (
    <div
      className="relative w-full pb-12 pt-0"
    >
      <div className="relative max-w-[960px] mx-auto z-10">
        {/* Main Image Container */}
        <div
          className="relative w-full overflow-hidden rounded-lg border border-white/5"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* This invisible image forces the container to the correct aspect ratio of the current slide */}
          <img
            src={screenshots[index].src}
            className="w-full h-auto opacity-0 pointer-events-none select-none"
            aria-hidden="true"
          />
          <AnimatePresence initial={false} custom={direction}>
            <motion.img
              key={index}
              src={screenshots[index].src}
              alt={screenshots[index].title}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
                scale: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
                filter: { duration: 0.4 },
                opacity: { duration: 0.4 }
              }}
              className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
            />
          </AnimatePresence>
        </div>


        {/* Thumbnails Container */}
        <div className="flex justify-center gap-4 mt-8 px-4">
          {screenshots.map((screen, i) => {
            const isActive = i === index;
            return (
              <div key={screen.id} className="flex-1 min-w-0 max-w-[160px] flex flex-col items-center">
                <button
                  onClick={() => handleIndexChange(i)}
                  className={`group relative w-full aspect-video rounded-xl overflow-hidden transition-all duration-500 border-2 ${isActive
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
                      <Play className="w-6 h-6 text-white/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </div>
                </button>
                <span className={`mt-2 text-[10px] font-medium transition-colors duration-300 text-center truncate w-full ${isActive ? 'text-primary' : 'text-muted-foreground/60'}`}>
                  {screen.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
