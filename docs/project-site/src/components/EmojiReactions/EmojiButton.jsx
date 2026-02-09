import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const EmojiButton = ({ emoji, isExpanded, count, hasReacted, isLastReaction, apiAvailable, handleReact }) => {
  const handleClick = (e) => {
    e.stopPropagation();
    // On mobile, if not expanded, let the container handle the expansion tap.
    if (window.innerWidth < 768 && !isExpanded) return;
    handleReact(emoji.char);
  };

  return (
    <button
      onClick={handleClick}
      disabled={hasReacted || !apiAvailable}
      className={`group relative flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-300 whitespace-nowrap ${hasReacted && isExpanded
        ? 'cursor-default'
        : 'hover:bg-black/5 dark:hover:bg-white/5 active:scale-90'
        }`}
    >
      {/* Selection highlight fade */}
      <AnimatePresence>
        {hasReacted && isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="absolute inset-0 bg-primary/10 dark:bg-white/10 rounded-full"
          />
        )}
      </AnimatePresence>

      <span
        className={`text-xl relative z-10 transition-transform duration-300 ${!hasReacted && apiAvailable && 'group-hover:scale-125'
          }`}
      >
        {emoji.char}
      </span>

      <AnimatePresence mode="wait">
        {count > 0 && (
          <motion.span
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: isExpanded ? 1 : 0 }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: 0.2 },
              layout: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }
            }}
            className={`text-xs font-bold font-mono overflow-hidden relative z-10 ml-1 ${hasReacted
              ? 'text-primary dark:text-white'
              : 'text-muted-foreground'
              }`}
          >
            {count}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Pop effect on click */}
      {isLastReaction && (
        <motion.div
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 pointer-events-none flex items-center justify-center z-20"
        >
          <div className="w-4 h-4 rounded-full bg-primary/20 blur-sm" />
        </motion.div>
      )}
    </button>
  );
};
