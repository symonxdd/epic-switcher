import { motion } from 'framer-motion';
import { useEffect } from 'react';

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

const PageTransition = ({ children }) => {
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
      variants={pageVariants}
      style={{ width: '100%', height: '100%' }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
