import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

// Use a module-level variable to track the very first time this component is rendered across the entire app session.
let isAppStartup = true;

const pageVariants = {
  initial: {
    opacity: 0,
    y: 10,
    scale: 0.99
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1
  },
  out: {
    opacity: 0,
    y: -10,
    scale: 0.99
  }
};

const pageTransition = {
  type: 'tween',
  ease: 'easeOut',
  duration: 0.25
};

const startupVariants = {
  initial: {
    opacity: 0,
  },
  in: {
    opacity: 1,
  },
  out: {
    opacity: 0,
    y: -10,
    scale: 0.99
  }
};

const startupTransition = {
  type: 'tween',
  ease: 'easeOut',
  duration: 0.6
};

const PageTransition = ({ children }) => {
  const [isStartup] = useState(isAppStartup);

  useEffect(() => {
    isAppStartup = false;
  }, []);

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={isStartup ? startupVariants : pageVariants}
      transition={isStartup ? startupTransition : pageTransition}
      style={{ width: '100%', height: '100%' }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
