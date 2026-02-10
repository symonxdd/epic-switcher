import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { REACTION_EMOJIS } from '@/lib/emoji-config';
import { EmojiButton } from './EmojiButton';

export const EmojiReactions = () => {
  const [counts, setCounts] = useState({});
  const [userReactions, setUserReactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiAvailable, setApiAvailable] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef(null);
  const scrollRef = useRef(null);

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

  // Reset scroll position on collapse
  useEffect(() => {
    if (!isExpanded && scrollRef.current) {
      scrollRef.current.scrollLeft = 0;
    }
  }, [isExpanded]);

  // Handle outside clicks/taps to collapse on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        if (isExpanded) {
          setIsExpanded(false);
        }
      }
    };

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isExpanded]);

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

  const handleMobileToggle = () => {
    if (window.innerWidth < 768) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <motion.div
      ref={containerRef}
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 1.5, duration: 0.8, ease: "circOut" }}
      className="fixed bottom-8 left-8 z-40"
    >
      <div
        className="relative w-fit"
        onMouseLeave={() => window.innerWidth >= 768 && setIsExpanded(false)}
        onClick={handleMobileToggle}
      >
        {/* Title - Tab Style */}
        <motion.div
          initial={false}
          animate={{
            opacity: isExpanded ? 1 : 0,
            y: isExpanded ? 1 : 10,
            scale: isExpanded ? 1 : 0.95,
            x: '-50%'
          }}
          transition={{
            duration: isExpanded ? 0.3 : 0.2,
            delay: isExpanded ? 0.35 : 0,
            ease: "easeOut"
          }}
          className="absolute bottom-full left-1/2 z-0 w-fit flex flex-col items-center"
        >
          <div className="relative px-6 py-2 bg-white/40 dark:bg-black/20 backdrop-blur-xl border border-black/10 dark:border-border/50 border-b-0 rounded-t-2xl shadow-sm flex items-center justify-center">
            <span className="text-xs font-semibold text-black/70 dark:text-foreground/80 group-hover:text-primary transition-colors tracking-tight whitespace-nowrap leading-none mt-0.5">
              Let us know your thoughts
            </span>
          </div>
        </motion.div>

        {/* Emoji bar */}
        <motion.div
          layout
          initial={false}
          animate={{
            width: isExpanded ? 'auto' : '64px'
          }}
          transition={{
            duration: 0.35,
            delay: isExpanded ? 0 : 0.2,
            ease: [0.25, 0.1, 0.25, 1]
          }}
          onMouseEnter={() => window.innerWidth >= 768 && setIsExpanded(true)}
          className="relative z-10 bg-white/60 dark:bg-black/40 backdrop-blur-2xl border border-black/10 dark:border-border/50 rounded-full shadow-2xl overflow-hidden max-w-[calc(100vw-64px)]"
        >
          <div
            ref={scrollRef}
            className={`flex items-center gap-1 p-1.5 overflow-x-auto overflow-y-hidden scrollbar-hide ${!isExpanded ? 'pointer-events-none' : 'pointer-events-auto'}`}
            style={{
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {REACTION_EMOJIS.map((emoji) => (
              <EmojiButton
                key={emoji.char}
                emoji={emoji}
                isExpanded={isExpanded}
                count={counts[emoji.char] || 0}
                hasReacted={userReactions.includes(emoji.char)}
                isLastReaction={userReactions[userReactions.length - 1] === emoji.char}
                apiAvailable={apiAvailable}
                handleReact={handleReact}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
