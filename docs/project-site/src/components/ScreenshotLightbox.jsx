import React, { useEffect, useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Sun, Moon } from 'lucide-react';

export const ScreenshotLightbox = ({
  isOpen,
  onClose,
  screenshots,
  currentIndex,
  onIndexChange,
  variationIndex = 0,
  direction = 0
}) => {
  const [viewMode, setViewMode] = useState('dark');
  const currentScreen = screenshots[currentIndex];

  const getSrc = (screen) => {
    if (screen.variants) {
      const variant = screen.variants[variationIndex] || screen.variants[0];
      return viewMode === 'light' ? (variant.light || variant.dark) : variant.dark;
    }
    return viewMode === 'light' ? (screen.lightSrc || screen.src) : screen.src;
  };

  const activeSrc = getSrc(currentScreen);

  const handleKeyDown = useCallback((e) => {
    if (!isOpen) return;
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowLeft') onIndexChange((currentIndex - 1 + screenshots.length) % screenshots.length, false);
    if (e.key === 'ArrowRight') onIndexChange((currentIndex + 1) % screenshots.length, false);
  }, [isOpen, onClose, currentIndex, onIndexChange, screenshots.length]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    if (isOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      document.body.style.setProperty('--removed-body-scroll-bar-size', `${scrollbarWidth}px`);
      document.body.setAttribute('data-scroll-locked', 'true');
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      document.body.style.removeProperty('--removed-body-scroll-bar-size');
      document.body.removeAttribute('data-scroll-locked');
    };
  }, [isOpen, handleKeyDown]);

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

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] bg-black flex flex-col items-center overflow-hidden"
          onClick={onClose}
        >
          {/* Top Bar */}
          <div className="flex-none w-full p-6 flex justify-between items-center z-50 pointer-events-none">
            <div className="flex items-center gap-3 pl-2">
              <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-full text-white/90 text-[10px] font-bold tracking-widest uppercase shadow-2xl">
                {currentIndex + 1} <span className="text-white/30 mx-1">/</span> {screenshots.length}
              </span>
              <span className="text-white/40 text-[11px] font-medium tracking-wide hidden sm:block">
                {currentScreen.title}
              </span>
            </div>

            <div className="flex items-center gap-2 pointer-events-auto">
              {/* Theme Toggle */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setViewMode(prev => prev === 'dark' ? 'light' : 'dark');
                }}
                className="p-2 text-white/50 hover:text-white transition-all bg-white/5 hover:bg-white/10 rounded-full border border-white/10 hover:scale-110 flex items-center justify-center"
                title={`Switch to ${viewMode === 'dark' ? 'Light' : 'Dark'} version`}
              >
                {viewMode === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); onClose(); }}
                className="p-2 text-white/50 hover:text-white transition-all bg-white/5 hover:bg-white/10 rounded-full border border-white/10 hover:scale-110"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Buttons (Desktop) */}
          <button
            onClick={(e) => { e.stopPropagation(); onIndexChange((currentIndex - 1 + screenshots.length) % screenshots.length, false); }}
            className="fixed left-8 top-1/2 -translate-y-1/2 p-4 text-white/30 hover:text-white transition-all hidden lg:block z-50 group pointer-events-auto"
          >
            <ChevronLeft className="w-12 h-12 group-hover:scale-110 transition-transform" />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); onIndexChange((currentIndex + 1) % screenshots.length, false); }}
            className="fixed right-8 top-1/2 -translate-y-1/2 p-4 text-white/30 hover:text-white transition-all hidden lg:block z-50 group pointer-events-auto"
          >
            <ChevronRight className="w-12 h-12 group-hover:scale-110 transition-transform" />
          </button>

          {/* Main Image Viewport Area */}
          <div
            className="flex-1 w-full relative h-[calc(100vh-140px)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
                  scale: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
                  filter: { duration: 0.3 },
                  opacity: { duration: 0.3 }
                }}
                className="absolute inset-x-0 inset-y-0 w-full h-full flex items-center justify-center p-0"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(e, { offset }) => {
                  const swipeThreshold = 50;
                  if (offset.x > swipeThreshold) {
                    onIndexChange((currentIndex - 1 + screenshots.length) % screenshots.length, false);
                  } else if (offset.x < -swipeThreshold) {
                    onIndexChange((currentIndex + 1) % screenshots.length, false);
                  }
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={viewMode}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    src={activeSrc}
                    alt={currentScreen.title}
                    className="max-w-full max-h-full object-contain shadow-[0_30px_60px_-12px_rgba(0,0,0,0.8)] pointer-events-none select-none rounded-[2px] border border-white/5 [backface-visibility:hidden] transform-gpu"
                    draggable="false"
                  />
                </AnimatePresence>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom Filmstrip */}
          <div
            className="flex-none w-full bg-gradient-to-t from-black via-black/80 to-transparent pt-10 pb-12 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex gap-4 overflow-x-auto max-w-full no-scrollbar px-10 sm:px-20 py-4 items-center justify-center">
              {screenshots.map((screen, i) => {
                const isActive = i === currentIndex;
                const thumbSrc = getSrc(screen);
                return (
                  <div key={screen.id} className="flex flex-col items-center flex-none snap-center">
                    <button
                      onClick={() => onIndexChange(i, false)}
                      className={`relative w-24 h-14 sm:w-32 sm:h-18 rounded-sm overflow-hidden border-2 transition-all duration-300 [backface-visibility:hidden] transform-gpu ${isActive
                          ? 'border-white/50 scale-105 shadow-xl grayscale-0 z-20'
                          : 'border-white/10 grayscale hover:grayscale-0 hover:border-white/30'
                        }`}
                    >
                      <img
                        src={thumbSrc}
                        alt={screen.title}
                        className="w-full h-full object-cover"
                      />
                    </button>
                    <span className={`mt-2 text-[10px] font-medium transition-colors duration-300 text-center truncate w-24 sm:w-32 ${isActive ? 'text-primary' : 'text-muted-foreground/60'
                      }`}>
                      {screen.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};
