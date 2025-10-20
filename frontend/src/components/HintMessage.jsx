import { useState, useEffect } from "react";
import { HiOutlineLightBulb, HiX } from "react-icons/hi";
import styles from "./HintMessage.module.css";
import { STORAGE_KEYS } from "../constants/storageKeys";

export default function HintMessage() {
  const storageKey = STORAGE_KEYS.USERNAME_HINT_DISMISSED;
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const isDismissed = localStorage.getItem(storageKey) === "true";
    setDismissed(isDismissed);
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(storageKey, "true");
    setDismissed(true);
  };

  if (dismissed) return null;

  return (
    <div className={styles.hintBox}>
      <div className={styles.leftSection}>
        <HiOutlineLightBulb className={styles.icon} />
        <div className={styles.textBlock}>
          <span className={styles.title}>Not seeing your username?</span>
          <span className={styles.message}>
            Try starting any game from the Epic Games Launcher for that account.
          </span>
        </div>
      </div>

      {/* Tooltip wrapper for the close button */}
      <div className={styles.closeTooltipWrapper}>
        <button
          className={styles.dismissButton}
          onClick={handleDismiss}
          aria-label="Dismiss hint"
        >
          <HiX />
        </button>
        <div className={styles.tooltip}>
          Bye bye
        </div>
      </div>
    </div>
  );
}
