import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

// Use a module-level variable to track the very first time this component is rendered across the entire app session.
let isFirstAppMount = true;

const pageVariants = {
  initial: {
    opacity: 0,
    y: 10,
    scale: 0.99
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.25,
      ease: 'easeOut'
    }
  },
  out: {
    opacity: 0,
    y: -10,
    scale: 0.99,
    transition: {
      duration: 0.25,
      ease: 'easeOut'
    }
  }
};

const startupVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  in: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay: 0.4,
      ease: 'easeOut'
    }
  },
  out: {
    opacity: 0,
    y: -10,
    scale: 0.99,
    transition: {
      duration: 0.25,
      ease: 'easeOut'
    }
  }
};

const PageTransition = ({ children }) => {
  // Capture the startup state for THIS specific component instance.
  // We use the global flag and then immediately set it to false so NO OTHER instance (next route) picks it up.
  const [isStartup] = useState(isFirstAppMount);
  if (isFirstAppMount) {
    isFirstAppMount = false;
  }

  // Handle scrolling to top on page mount.
  // Since this component is wrapped in AnimatePresence mode="wait",
  // this effect will only run for the base route after the previous route has exited.
  useEffect(() => {
    const content = document.getElementById('main-content');
    if (content) {
      content.scrollTop = 0;
    }
  }, []);

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={isStartup ? startupVariants : pageVariants}
      style={{ width: '100%', height: '100%' }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
