import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, animate } from 'framer-motion';

const screenshots = [
  { id: 1, src: '/screenshots/accounts-page.png', title: 'Main Dashboard' },
  { id: 2, src: '/screenshots/add-account-modal.png', title: 'Add Account' },
  { id: 3, src: '/screenshots/manage-page-with-hint.png', title: 'Manage Sessions' },
  { id: 4, src: '/screenshots/how-it-works-page.png', title: 'How it Works' },
  { id: 5, src: '/screenshots/settings-page-with-update-notice.png', title: 'Settings' },
];

export const Carousel = () => {
  const [index, setIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const isPaused = isHovering || isDragging;
  const progress = useMotionValue(0);
  const DURATION = 5000;

  const handleIndexChange = useCallback((newIndex) => {
    setIndex(newIndex);
    progress.jump(0);
  }, [progress]);

  useEffect(() => {
    if (isPaused) return;

    // Calculate remaining duration based on current progress
    const remainingDuration = DURATION * (1 - progress.get());

    const controls = animate(progress, 1, {
      duration: remainingDuration / 1000,
      ease: "linear",
      onComplete: () => {
        handleIndexChange((index + 1) % screenshots.length);
      }
    });

    return () => controls.stop();
  }, [index, isPaused, progress, handleIndexChange]);

  const handleDragEnd = (event, info) => {
    const threshold = 50;
    if (info.offset.x < -threshold) {
      handleIndexChange((index + 1) % screenshots.length);
    } else if (info.offset.x > threshold) {
      handleIndexChange((index - 1 + screenshots.length) % screenshots.length);
    }
  };

  return (
    <div
      className="relative w-full pb-12 pt-0"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="flex justify-center items-center relative h-[350px] md:h-[550px] max-w-7xl mx-auto">
        {screenshots.map((screen, i) => {
          let position = i - index;
          if (position < -Math.floor(screenshots.length / 2)) position += screenshots.length;
          if (position > Math.floor(screenshots.length / 2)) position -= screenshots.length;

          const isActive = position === 0;
          const isVisible = Math.abs(position) <= 1;

          return (
            <motion.div
              key={screen.id}
              initial={false}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragStart={() => setIsDragging(true)}
              onDragEnd={(event, info) => {
                setIsDragging(false);
                handleDragEnd(event, info);
              }}
              onClick={() => {
                if (!isActive) setIndex(i);
              }}
              animate={{
                x: position * (window.innerWidth < 768 ? 220 : 500),
                scale: isActive ? 1 : 0.7,
                opacity: isVisible ? (isActive ? 1 : 0.4) : 0,
                zIndex: isActive ? 10 : 5,
                rotateY: position * 20,
              }}
              transition={{
                type: 'spring',
                stiffness: 260,
                damping: 25,
              }}
              className={`absolute w-[280px] md:w-[750px] overflow-hidden rounded-2xl shadow-2xl bg-transparent border-none ${isActive ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'
                }`}
              style={{ perspective: 1000 }}
            >
              <img
                src={screen.src}
                alt={screen.title}
                className="w-full h-auto block rounded-2xl pointer-events-none"
              />
              {isActive && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-8 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/20 backdrop-blur-xl rounded-full border border-white/10 shadow-lg whitespace-nowrap pointer-events-none text-center"
                >
                  <p className="text-sm font-medium tracking-tight text-white">{screen.title}</p>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="flex justify-center gap-3 -mt-5 md:-mt-10 relative z-20">
        {screenshots.map((_, i) => (
          <button
            key={i}
            onClick={() => handleIndexChange(i)}
            className={`h-1.5 rounded-full overflow-hidden transition-all duration-300 relative ${i === index
              ? 'bg-foreground/20 w-8 opacity-100'
              : 'bg-foreground/20 hover:bg-foreground/40 w-1.5'
              }`}
            aria-label={`Go to screenshot ${i + 1}`}
          >
            {i === index && (
              <motion.div
                style={{ scaleX: progress }}
                className="absolute top-0 left-0 h-full w-full bg-foreground origin-left"
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
