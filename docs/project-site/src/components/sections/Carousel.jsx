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
    <div className="relative w-full overflow-hidden py-12">
      <div className="flex justify-center items-center gap-4 relative h-[400px] md:h-[600px]">
        {screenshots.map((screen, i) => {
          // Calculate relative position to handle circular carousel
          let position = i - index;
          if (position < -2) position += screenshots.length;
          if (position > 2) position -= screenshots.length;

          const isActive = position === 0;
          const isVisible = Math.abs(position) <= 2;

          if (!isVisible) return null;

          return (
            <motion.div
              key={screen.id}
              initial={false}
              animate={{
                x: position * 300,
                scale: isActive ? 1.1 : 0.8,
                opacity: isActive ? 1 : 0.4,
                zIndex: isActive ? 10 : 1,
              }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
              }}
              className="absolute w-[300px] md:w-[800px] rounded-xl overflow-hidden shadow-2xl border bg-card"
            >
              <img
                src={screen.src}
                alt={screen.title}
                className="w-full h-auto object-cover"
              />
              {isActive && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-6 left-6 right-6 p-4 bg-background/60 backdrop-blur-md rounded-lg border shadow-lg"
                >
                  <p className="text-lg font-semibold tracking-tight">{screen.title}</p>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="flex justify-center gap-2 mt-8">
        {screenshots.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-2 h-2 rounded-full transition-all ${i === index ? 'bg-primary w-6' : 'bg-muted hover:bg-muted-foreground'
              }`}
          />
        ))}
      </div>
    </div>
  );
};
