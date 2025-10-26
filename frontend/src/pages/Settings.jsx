import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import PageHeader from '../components/PageHeader';
import styles from "./Settings.module.css";
import { STORAGE_KEYS } from "../constants/storageKeys";
import toast from "react-hot-toast";

function Settings() {
  const { theme, setTheme, trueBlack, setTrueBlack, currentTheme } = useTheme();
  const [hideUserIds, setHideUserIds] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const storedHideUserIds = localStorage.getItem(STORAGE_KEYS.HIDE_USER_IDS);
    if (storedHideUserIds === "true") setHideUserIds(true);
  }, []);

  // Persist settings
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HIDE_USER_IDS, hideUserIds);
  }, [hideUserIds]);

  return (
    <div className={styles.settingsContainer}>
      <PageHeader title="Settings" />

      <div className={styles.settingsGrid}>
        {/* --- Accounts Page Settings --- */}
        <div className={styles.settingsGroup}>
          <h5 className={styles.labelHeading}>Accounts page</h5>

          {/* Hide User IDs */}
          <div className={styles.toggleRow}>
            <label className={styles.switch}>
              <input
                type="checkbox"
                checked={hideUserIds}
                onChange={(e) => {
                  setHideUserIds(e.target.checked);
                  toast.success(
                    e.target.checked
                      ? "User IDs hidden on Accounts page"
                      : "User IDs visible"
                    , { id: "hide-user-ids" });
                }}
              />
              <span className={styles.slider}></span>
            </label>
            <span className={styles.toggleLabel}>Hide User IDs on Accounts page</span>
          </div>
        </div>

        {/* --- Theme Selector --- */}
        <div className={styles.settingsGroup}>
          <h5 className={styles.labelHeading}>Theme</h5>

          <div className={styles.btnGroup}>
            {["light", "dark", "system"].map((option) => (
              <button
                key={option}
                className={`${styles.btn} ${theme === option ? styles.active : ""}`}
                onClick={() => setTheme(option)}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>

          {currentTheme === "dark" && (
            <div className={styles.trueBlackToggle}>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={trueBlack}
                  onChange={(e) => setTrueBlack(e.target.checked)}
                />
                <span className={styles.slider}></span>
              </label>
              <span className={styles.toggleLabel}>Enable True Black</span>
            </div>
          )}
        </div>

        {/* --- Reset Hints --- */}
        <div className={styles.settingsGroup}>
          <h5 className={styles.labelHeading}>Hints</h5>
          <button
            className={styles.resetButton}
            onClick={() => {
              localStorage.removeItem(STORAGE_KEYS.USERNAME_HINT_DISMISSED);
              toast.success("Hints have been reset!", { id: "reset-hints" });
            }}
          >
            Reset hints
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;
