import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, animate } from 'framer-motion';
import { Pause, Play, Expand } from 'lucide-react';
import { ScreenshotLightbox } from '../ScreenshotLightbox';

const screenshots = [
  {
    id: 1,
    title: 'Accounts',
    variants: [
      { name: 'Sidebar', dark: '/screenshots/accounts.png', light: '/screenshots/accounts-light.png' },
      { name: 'Top Nav', dark: '/screenshots/accounts-top-layout.png', light: '/screenshots/accounts-light-top-layout.png' }
    ]
  },
  { id: 2, src: '/screenshots/customize-avatar.png', title: 'Customize Avatar' },
  { id: 3, src: '/screenshots/crop-image.png', title: 'Crop Image' },
  { id: 4, src: '/screenshots/manage.png', title: 'Manage' },
  { id: 5, src: '/screenshots/add-session.png', title: 'Add Session' },
  { id: 6, src: '/screenshots/edit-nickname.png', title: 'Edit Nickname' },
  { id: 7, src: '/screenshots/delete-session.png', title: 'Delete Session' },
  { id: 8, src: '/screenshots/transparency.png', title: 'Trust & Transparency' },
  { id: 9, src: '/screenshots/settings-update-notice.png', title: 'Settings' },
];

const DURATION = 5000;
const SLIDER_INITIAL_POS = 62;

export const Screenshots = () => {
  const [index, setIndex] = useState(0);
  const [variationIndex, setVariationIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(SLIDER_INITIAL_POS);
  const [isDragging, setIsDragging] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const progress = useMotionValue(0);

  const handleIndexChange = useCallback((newIndex, shouldResume = true) => {
    if (newIndex === index) {
      if (shouldResume) setIsPaused(!isPaused);
      return;
    }
    setDirection(newIndex > index ? 1 : -1);
    setIndex(newIndex);
    setVariationIndex(0); // Reset variation when switching main image
    if (shouldResume) setIsPaused(false);
    progress.set(0);
    setSliderPosition(SLIDER_INITIAL_POS);
  }, [index, isPaused, progress]);

  // Handle Comparison Slider Interaction
  const updateSliderPosition = useCallback((clientX) => {
    const container = document.getElementById('slider-container');
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = clientX - rect.left;
    const position = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(position);
  }, []);

  const handleSliderMove = useCallback((e) => {
    if (!isDragging) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    if (clientX !== undefined) updateSliderPosition(clientX);
  }, [isDragging, updateSliderPosition]);

  // Global mouse up to stop dragging even if mouse leaves container
  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);
    if (isDragging) {
      window.addEventListener('mouseup', handleGlobalMouseUp);
      window.addEventListener('touchend', handleGlobalMouseUp);
      window.addEventListener('mousemove', handleSliderMove);
      window.addEventListener('touchmove', handleSliderMove);
    }
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      window.removeEventListener('touchend', handleGlobalMouseUp);
      window.removeEventListener('mousemove', handleSliderMove);
      window.removeEventListener('touchmove', handleSliderMove);
    };
  }, [isDragging, handleSliderMove]);

  useEffect(() => {
    if (isHovering || isPaused || isDragging) return;

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
  }, [index, isHovering, isPaused, isDragging, progress, handleIndexChange]);

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

  const currentScreen = screenshots[index];
  const activeVariant = currentScreen.variants ? currentScreen.variants[variationIndex] : null;
  const darkSrc = activeVariant ? activeVariant.dark : currentScreen.src;
  const lightSrc = activeVariant ? activeVariant.light : (currentScreen.lightSrc || null);
  const hasVariant = !!lightSrc;
  const hasMultipleLayouts = currentScreen.variants && currentScreen.variants.length > 1;

  return (
    <div
      className="relative w-full pb-12 pt-0"
    >
      <div className="relative max-w-[960px] mx-auto z-10 sm:px-4">
        {/* Main Image Container */}
        <div
          id="slider-container"
          className={`group relative w-full overflow-hidden rounded-none sm:rounded-lg border-y sm:border border-white/5 ${hasVariant ? 'cursor-ew-resize' : ''}`}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onClick={(e) => {
            if (isDragging) return;
            // Only open lightbox from main area if it's NOT a comparison slider
            if (hasVariant) return;
            // Only open lightbox if not clicking variant buttons or slider handle
            if (e.target.closest('button')) return;
            setIsLightboxOpen(true);
            setIsPaused(true);
          }}
          onMouseDown={hasVariant ? (e) => {
            e.preventDefault();
            setIsDragging(true);
            updateSliderPosition(e.clientX);
          } : undefined}
          onTouchStart={hasVariant ? (e) => {
            setIsDragging(true);
            updateSliderPosition(e.touches[0].clientX);
          } : undefined}
        >
          {/* This invisible image forces the container to the correct aspect ratio of the current slide */}
          <img
            src={darkSrc}
            className="w-full h-auto opacity-0 pointer-events-none select-none"
            aria-hidden="true"
            draggable="false"
          />
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={index} // Key only off the screenshot index for main transition
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
              className="absolute inset-0 w-full h-full"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={variationIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 w-full h-full"
                >
                  {/* Light Mode (Base) */}
                  <img
                    src={lightSrc || darkSrc}
                    alt={`${currentScreen.title} Light Mode`}
                    className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
                    draggable="false"
                  />

                  {/* Dark Mode (Revealed) */}
                  {hasVariant && (
                    <>
                      <img
                        src={darkSrc}
                        alt={currentScreen.title}
                        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                        className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none transition-none"
                        draggable="false"
                      />

                      {/* Slider Handle */}
                      <div
                        className="absolute top-0 bottom-0 z-10 w-px bg-white/50 backdrop-blur-sm shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                        style={{ left: `${sliderPosition}%` }}
                      >
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-xl">
                          <div className="flex gap-1">
                            <div className="w-0.5 h-3 bg-white/60 rounded-full" />
                            <div className="w-0.5 h-3 bg-white/60 rounded-full" />
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>

          {/* Layout Switcher (Floating Switch) */}
          {hasMultipleLayouts && (
            <div
              className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[20] flex p-1.5 bg-background/30 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl transition-all hover:bg-background/40"
              onMouseDown={(e) => e.stopPropagation()} // Prevent slider drag when clicking buttons
              onTouchStart={(e) => e.stopPropagation()}
            >
              {currentScreen.variants.map((variant, i) => (
                <button
                  key={variant.name}
                  onClick={() => {
                    setVariationIndex(i);
                    setIsPaused(true); // Pause when interacting with variants
                  }}
                  className={`relative px-5 py-2 text-[11px] font-bold uppercase tracking-wider transition-all duration-300 rounded-full z-10 ${variationIndex === i
                    ? 'text-foreground'
                    : 'text-foreground/40 hover:text-foreground/60'
                    }`}
                >
                  {variationIndex === i && (
                    <motion.div
                      layoutId="layout-pill"
                      className="absolute inset-0 bg-white/10 border border-white/10 rounded-full -z-10"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  {variant.name}
                </button>
              ))}
            </div>
          )}

          {/* Expand Hint (Desktop) */}
          {isHovering && (
            <div className="absolute top-4 right-4 z-20 hidden sm:block">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsLightboxOpen(true);
                  setIsPaused(true);
                }}
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                className="p-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10 text-white/70 hover:text-white hover:bg-black/60 transition-colors"
                title="View fullscreen"
              >
                <Expand className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Thumbnails Container */}
        <div className="flex sm:justify-center gap-3 mt-6 px-0 sm:px-4 overflow-x-auto py-6 thin-scrollbar snap-x snap-mandatory touch-pan-x sm:cursor-default">
          {screenshots.map((screen, i) => {
            const isActive = i === index;
            const thumbSrc = screen.variants ? screen.variants[0].dark : screen.src;
            return (
              <div key={screen.id} className={`flex-none w-32 sm:flex-1 sm:max-w-[160px] flex flex-col items-center snap-center ${i === 0 ? 'ml-4 sm:ml-0' : ''} ${i === screenshots.length - 1 ? 'mr-4 sm:mr-0' : ''}`}>
                <button
                  onClick={() => handleIndexChange(i)}
                  className={`group relative w-full aspect-video rounded-sm overflow-hidden transition-all duration-500 border-2 [backface-visibility:hidden] transform-gpu ${isActive
                    ? 'border-white/50 z-20 shadow-lg scale-105'
                    : 'border-white/10 hover:border-white/30 grayscale hover:grayscale-0'
                    }`}
                >
                  <img
                    src={thumbSrc}
                    alt={screen.title}
                    className="w-full h-full object-cover"
                    draggable="false"
                  />

                  {/* Active Progress Bar */}
                  {isActive && !isPaused && !isHovering && !isDragging && (
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

      <ScreenshotLightbox
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        screenshots={screenshots}
        currentIndex={index}
        onIndexChange={handleIndexChange}
        variationIndex={variationIndex}
        direction={direction}
      />
    </div>
  );
};
