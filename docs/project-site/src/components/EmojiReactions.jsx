import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { REACTION_EMOJIS } from '@/lib/emoji-config';

export const EmojiReactions = () => {
  const [counts, setCounts] = useState({});
  const [userReactions, setUserReactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiAvailable, setApiAvailable] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Load counts from API
    const fetchCounts = async () => {
      try {
        const response = await fetch('/api/reactions');
        const contentType = response.headers.get("content-type");
        if (!response.ok || !contentType || !contentType.includes("application/json")) {
          setApiAvailable(false);
          return;
        }
        const data = await response.json();
        if (data.counts) {
          setCounts(data.counts);
        }
      } catch (error) {
        setApiAvailable(false);
      } finally {
        setIsLoading(false);
      }
    };

    // Load user reactions from localStorage
    const saved = localStorage.getItem('epic-switcher-reactions');
    if (saved) {
      setUserReactions(JSON.parse(saved));
    }

    fetchCounts();
  }, []);

  const handleReact = async (char) => {
    if (userReactions.includes(char)) return;

    // Optimistic Update
    const newCounts = { ...counts, [char]: (counts[char] || 0) + 1 };
    const newReactions = [...userReactions, char];
    setCounts(newCounts);
    setUserReactions(newReactions);
    localStorage.setItem('epic-switcher-reactions', JSON.stringify(newReactions));

    // Send to API only if available
    if (!apiAvailable) return;

    try {
      await fetch('/api/reactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emoji: char })
      });
    } catch (error) {
      console.error("Failed to save reaction:", error);
    }
  };

  const EmojiButton = ({ emoji, index, isHovered }) => {
    const hasReacted = userReactions.includes(emoji.char);
    const count = counts[emoji.char] || 0;

    return (
      <button
        onClick={() => handleReact(emoji.char)}
        disabled={hasReacted || !apiAvailable}
        className={`group relative flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-300 whitespace-nowrap ${hasReacted && isHovered
          ? 'cursor-default'
          : 'hover:bg-black/5 dark:hover:bg-white/5 active:scale-90'
          }`}
      >
        {/* Selection highlight fade */}
        <AnimatePresence>
          {hasReacted && isHovered && (
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
              key={count}
              initial={{ opacity: 0 }}
              animate={{
                opacity: isHovered ? 1 : 0,
                width: isHovered ? 'auto' : 0,
                marginLeft: isHovered ? 0 : -8
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className={`text-xs font-bold font-mono overflow-hidden relative z-10 ${hasReacted
                ? 'text-primary dark:text-white'
                : 'text-muted-foreground'
                }`}
            >
              {count}
            </motion.span>
          )}
        </AnimatePresence>

        {/* Pop effect on click */}
        {hasReacted && userReactions[userReactions.length - 1] === emoji.char && (
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

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 1.5, duration: 0.8, ease: "circOut" }}
      className="fixed bottom-8 left-8 z-[100]"
    >
      {/* Desktop version with hover */}
      <div
        className="hidden md:block w-fit"
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Title - shows on hover */}
        <motion.div
          initial={false}
          animate={{
            opacity: isHovered ? 1 : 0,
            height: isHovered ? 'auto' : 0,
            width: isHovered ? 'auto' : '64px',
            marginBottom: isHovered ? 0 : -8
          }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <div
            className="px-4 py-2 bg-white/40 dark:bg-black/20 backdrop-blur-md border border-black/5 dark:border-white/10 shadow-sm"
            style={{
              borderTopLeftRadius: '12px',
              borderTopRightRadius: '12px',
              borderBottomLeftRadius: '4px',
              borderBottomRightRadius: '4px',
              borderBottom: 'none'
            }}
          >
            <span className="text-xs font-semibold text-black/70 dark:text-foreground/80 tracking-tight whitespace-nowrap">
              Let us know your thoughts
            </span>
          </div>
        </motion.div>

        {/* Emoji bar with smooth width transition */}
        <motion.div
          initial={false}
          animate={{
            width: isHovered ? 'auto' : '64px'
          }}
          transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
          onMouseEnter={() => setIsHovered(true)}
          className="bg-white/40 dark:bg-black/20 backdrop-blur-xl border border-black/10 dark:border-border/50 rounded-full shadow-2xl overflow-hidden"
        >
          <div className="flex items-center gap-1 p-1.5">
            {REACTION_EMOJIS.map((emoji, index) => (
              <EmojiButton key={emoji.char} emoji={emoji} index={index} isHovered={isHovered} />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Mobile version - always expanded */}
      <div className="md:hidden block">
        {/* Title */}
        <div
          className="px-4 py-2 bg-white/40 dark:bg-black/20 backdrop-blur-md border border-black/5 dark:border-white/10 shadow-sm"
          style={{
            borderTopLeftRadius: '12px',
            borderTopRightRadius: '12px',
            borderBottomLeftRadius: '4px',
            borderBottomRightRadius: '4px',
            borderBottom: 'none'
          }}
        >
          <span className="text-xs font-semibold text-black/70 dark:text-foreground/80 tracking-tight whitespace-nowrap">
            Let us know your thoughts
          </span>
        </div>

        {/* Emoji bar */}
        <div className="flex items-center gap-1 p-1.5 bg-white/40 dark:bg-black/20 backdrop-blur-xl border border-black/10 dark:border-border/50 rounded-full shadow-2xl">
          {REACTION_EMOJIS.map((emoji, index) => (
            <EmojiButton key={emoji.char} emoji={emoji} index={index} isHovered={true} />
          ))}
        </div>
      </div>
    </motion.div>
  );
};