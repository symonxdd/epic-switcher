import { useTheme } from "../context/ThemeContext";
import PageHeader from '../components/PageHeader';
import styles from "./Settings.module.css";

function Settings() {
  const { theme, setTheme, trueBlack, setTrueBlack, currentTheme } = useTheme();

  return (
    <div className={styles.settingsContainer}>
      <PageHeader title="Settings" />

      {/* --- Theme Selector --- */}
      <div className={styles.themeSettingGroup}>
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

        {/* --- True Black Toggle --- */}
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
    </div>
  );
}

export default Settings;
