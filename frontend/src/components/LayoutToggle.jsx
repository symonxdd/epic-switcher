import { useEffect, useState } from 'react';
import { Wind } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { STORAGE_KEYS } from "../constants/storageKeys";
import styles from "./LayoutToggle.module.css";

export const LayoutToggle = ({ className }) => {
  const [layoutMode, setLayoutMode] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.LAYOUT_MODE) || 'sidebar';
  });

  useEffect(() => {
    const handleSync = () => {
      const mode = localStorage.getItem(STORAGE_KEYS.LAYOUT_MODE) || 'sidebar';
      setLayoutMode(mode);
    };

    window.addEventListener("storage", handleSync);
    return () => window.removeEventListener("storage", handleSync);
  }, []);

  const toggleLayout = () => {
    const newMode = layoutMode === 'sidebar' ? 'top-nav' : 'sidebar';
    localStorage.setItem(STORAGE_KEYS.LAYOUT_MODE, newMode);
    setLayoutMode(newMode);
    // Dispatch storage event to notify MainLayout
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <button
      onClick={toggleLayout}
      onDoubleClick={(e) => e.stopPropagation()}
      className={`${styles.toggleBtn} ${className || ""}`}
      aria-label="Toggle layout mode"
      title={layoutMode === 'sidebar' ? "Switch to Top Navigation" : "Switch to Sidebar"}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={layoutMode}
          initial={{ scale: 0.8, opacity: 0, rotate: layoutMode === 'sidebar' ? 0 : 90 }}
          animate={{ scale: 1, opacity: 1, rotate: layoutMode === 'sidebar' ? 0 : 90 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={styles.iconContainer}
        >
          <Wind size={18} className={styles.icon} />
        </motion.div>
      </AnimatePresence>
    </button>
  );
};
