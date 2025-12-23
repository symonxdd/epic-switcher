import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const screenshots = [
  { id: 1, src: '/screenshots/accounts-page.png', title: 'Main Dashboard' },
  { id: 2, src: '/screenshots/add-account-modal.png', title: 'Add Account' },
  { id: 3, src: '/screenshots/manage-page-with-hint.png', title: 'Manage Sessions' },
  { id: 4, src: '/screenshots/how-it-works-page.png', title: 'How it Works' },
  { id: 5, src: '/screenshots/settings-page-with-update-notice.png', title: 'Settings' },
];

export const Carousel = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % screenshots.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full pb-12 pt-0">
      <div className="flex justify-center items-center relative h-[350px] md:h-[550px] max-w-7xl mx-auto">
        {screenshots.map((screen, i) => {
          let position = i - index;
          if (position < -Math.floor(screenshots.length / 2)) position += screenshots.length;
          if (position > Math.floor(screenshots.length / 2)) position -= screenshots.length;

          const isActive = position === 0;
          const isVisible = Math.abs(position) <= 1; // Only show 3 items to avoid clutter

          return (
            <motion.div
              key={screen.id}
              initial={false}
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
              className="absolute w-[280px] md:w-[750px] overflow-hidden rounded-2xl shadow-2xl bg-transparent border-none"
              style={{ perspective: 1000 }}
            >
              <img
                src={screen.src}
                alt={screen.title}
                className="w-full h-auto block rounded-2xl"
              />
              {isActive && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/20 backdrop-blur-xl rounded-full border border-white/10 shadow-lg whitespace-nowrap"
                >
                  <p className="text-sm font-medium tracking-tight text-white">{screen.title}</p>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="flex justify-center gap-3 mt-12">
        {screenshots.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${i === index
              ? 'bg-foreground w-8 opacity-100'
              : 'bg-foreground/20 hover:bg-foreground/40 w-1.5'
              }`}
            aria-label={`Go to screenshot ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
