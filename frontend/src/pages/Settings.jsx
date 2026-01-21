import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import PageHeader from '../components/PageHeader';
import styles from "./Settings.module.css";
import { STORAGE_KEYS } from "../constants/storageKeys";
import toast from "react-hot-toast";
import { FaGithub } from "react-icons/fa";
import { GetLatestVersion } from "../../wailsjs/go/services/UpdateService";
import { BrowserOpenURL } from '../../wailsjs/runtime';

function Settings() {
  const { theme, setTheme, trueBlack, setTrueBlack, currentTheme } = useTheme();
  const [hideUserIds, setHideUserIds] = useState(false);
  const [supportDismissed, setSupportDismissed] = useState(false);
  const [remoteVersion, setRemoteVersion] = useState(null);
  const [remoteReleaseUrl, setRemoteReleaseUrl] = useState(null);

  const currentVersion = typeof __APP_VERSION__ !== "undefined" ? __APP_VERSION__ : "1.0.0";

  // Load settings from localStorage on mount
  useEffect(() => {
    const handleSync = () => {
      const storedHideUserIds = localStorage.getItem(STORAGE_KEYS.HIDE_USER_IDS);
      if (storedHideUserIds === "true") setHideUserIds(true);

      const storedSupportDismissed = localStorage.getItem(STORAGE_KEYS.SUPPORT_COFFEE_DISMISSED);
      setSupportDismissed(storedSupportDismissed === "true");
    };

    handleSync();
    window.addEventListener("storage", handleSync);
    return () => window.removeEventListener("storage", handleSync);
  }, []);

  // Persist settings
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HIDE_USER_IDS, hideUserIds);
  }, [hideUserIds]);

  // --- Fetch latest GitHub version ---
  useEffect(() => {
    const checkForUpdate = async () => {
      try {
        const release = await GetLatestVersion();
        if (!release?.tag_name) return;

        const cleanTag = release.tag_name.startsWith("v")
          ? release.tag_name.slice(1)
          : release.tag_name;

        setRemoteVersion(cleanTag);
        setRemoteReleaseUrl(release.html_url);
      } catch (err) {
        console.warn("Version check failed:", err);
      }
    };

    checkForUpdate();
  }, [currentVersion]);

  // --- Compare versions semantically ---
  function isRemoteVersionNewer(remote, local) {
    const parse = (v) => v.split(".").map(Number);
    const [r1, r2, r3] = parse(remote);
    const [l1, l2, l3] = parse(local);
    if (r1 > l1) return true;
    if (r1 === l1 && r2 > l2) return true;
    if (r1 === l1 && r2 === l2 && r3 > l3) return true;
    return false;
  }

  function isUpToDate() {
    if (!remoteVersion) return true; // assume up-to-date until we know
    return !isRemoteVersionNewer(remoteVersion, currentVersion);
  }

  const handleOpenGithubRelease = () => {
    try {
      BrowserOpenURL(remoteReleaseUrl);
    } catch (err) {
      console.error('Failed to open GitHub link in default browser:', err);
    }
  }

  return (
    <div className={styles.settingsContainer}>
      <PageHeader title="Settings" />

      <div className={styles.settingsGrid}>
        {/* --- General Settings --- */}
        <div className={styles.settingsGroup}>
          <h5 className={styles.labelHeading}>General</h5>

          {/* Hide User IDs / (Usernames, if alias set) */}
          <div className={styles.toggleRow}>
            <label htmlFor="hideUserIdsToggle" className={styles.toggleLabel}>Hide User IDs on Accounts page</label>
            <label className={styles.switch}>
              <input
                id="hideUserIdsToggle"
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
          </div>

          <div className={styles.btnGroup}>
            <button
              className={styles.resetButton}
              onClick={() => {
                localStorage.removeItem(STORAGE_KEYS.USERNAME_HINT_DISMISSED);
                toast.success("Hints have been reset!", { id: "reset-hints" });
              }}
            >
              Reset hints
            </button>

            {supportDismissed && (
              <button
                className={styles.resetButton}
                onClick={() => {
                  localStorage.removeItem(STORAGE_KEYS.SUPPORT_COFFEE_DISMISSED);
                  window.dispatchEvent(new Event("storage"));
                  setSupportDismissed(false);
                  toast.success("Support notice will be shown again!", { id: "reset-support" });
                }}
              >
                Re-show support notice
              </button>
            )}
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
              <label htmlFor="trueBlackToggle" className={styles.toggleLabel}>Enable True Black</label>
              <label className={styles.switch}>
                <input
                  id="trueBlackToggle"
                  type="checkbox"
                  checked={trueBlack}
                  onChange={(e) => setTrueBlack(e.target.checked)}
                />
                <span className={styles.slider}></span>
              </label>
            </div>
          )}
        </div>

        {/* --- Update Available Notice --- */}
        {remoteVersion && isRemoteVersionNewer(remoteVersion, currentVersion) && (
          <div className={styles.settingsGroup}>
            <h5 className={styles.labelHeading}>
              New update ready
              <span className={styles.versionSubtext}>v{remoteVersion}</span>
            </h5>
            <button
              className={styles.actionButton}
              onClick={handleOpenGithubRelease}
            >
              <FaGithub />
              View on GitHub
            </button>
          </div>
        )}
      </div>

      <div className={styles.appFooter}>
        <div className={styles.footerTop}>
          v{currentVersion} (
          {import.meta.env.MODE === "development" ? "dev" : "release"}
          {remoteVersion
            ? isUpToDate()
              ? ", latest"
              : ", update available"
            : ""}
          )
        </div>

        <div className={styles.footerBottom}>
          Powered by React, Go & Wails
        </div>
      </div>
    </div>
  );
}

export default Settings;
