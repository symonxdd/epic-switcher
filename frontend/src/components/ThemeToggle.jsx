import { Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import styles from "./ThemeToggle.module.css";

export const ThemeToggle = ({ className }) => {
  const { theme, setTheme, currentTheme } = useTheme();

  const toggleTheme = () => {
    // If 'system', it will switch to the opposite of current resolved theme
    setTheme(currentTheme === "dark" ? "light" : "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      onDoubleClick={(e) => e.stopPropagation()}
      className={`${styles.toggleBtn} ${className || ""}`}
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={currentTheme}
          initial={{ scale: 0.8, opacity: 0, rotate: -45 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          exit={{ scale: 0.8, opacity: 0, rotate: 45 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={styles.iconContainer}
        >
          {currentTheme === "dark" ? (
            <Sun size={18} className={styles.icon} />
          ) : (
            <Moon size={18} className={styles.icon} />
          )}
        </motion.div>
      </AnimatePresence>
    </button>
  );
};
