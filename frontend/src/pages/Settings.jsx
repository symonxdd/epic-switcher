import { useState, useEffect, useRef } from "react";
import { useTheme } from "../context/ThemeContext";
import { AnimatePresence } from "framer-motion";
import PageHeader from '../components/PageHeader';
import styles from "./Settings.module.css";
import DismissSupportModal from "../components/modals/DismissSupportModal";
import { STORAGE_KEYS } from "../constants/storageKeys";
import toast from "react-hot-toast";
import { FaGithub } from "react-icons/fa";
import { GetLatestVersion } from "../../wailsjs/go/services/UpdateService";
import { BrowserOpenURL } from '../../wailsjs/runtime';

const CHEEKY_MESSAGES = [
  "Nice try! Settings are mandatory for your sanity. 🤨",
  "Forbidden! Without settings, who even are you? 🕵️",
  "Access Denied: You're trying to hide the most powerful page. ⚡",
  "I don't think so! You'd be lost without me. ✨",
  "Error: User is being too cheeky. Resetting toggle. 🤖",
  "Nice try, but I like it here. I'm staying. 🏠",
  "Whoops! My finger slipped and I turned it back on. 🤷‍♂️",
  "How are you going to reach 'Epic' status without these? 🏆",
  "Settings: The only thing standing between you and chaos. 🌪️"
];

function Settings() {
  const { theme, setTheme, trueBlack, setTrueBlack, currentTheme } = useTheme();
  const lastCheekyIndexRef = useRef(-1);
  const [showSidebarAccountCount, setShowSidebarAccountCount] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.SHOW_SIDEBAR_ACCOUNT_COUNT) === "true";
  });
  const [hiddenSidebarItems, setHiddenSidebarItems] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.SIDEBAR_HIDDEN_ITEMS);
    if (!stored) return [];
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  });
  const [supportDismissed, setSupportDismissed] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.SUPPORT_COFFEE_DISMISSED) === "true";
  });
  const [showDismissModal, setShowDismissModal] = useState(false);
  const [layoutMode, setLayoutMode] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.LAYOUT_MODE) || 'sidebar';
  });
  const [remoteVersion, setRemoteVersion] = useState(null);
  const [remoteReleaseUrl, setRemoteReleaseUrl] = useState(null);

  const currentVersion = typeof __APP_VERSION__ !== "undefined" ? __APP_VERSION__ : "1.0.0";

  // Load settings from localStorage on mount
  useEffect(() => {
    const handleSync = () => {
      const storedShowSidebarCount = localStorage.getItem(STORAGE_KEYS.SHOW_SIDEBAR_ACCOUNT_COUNT);
      setShowSidebarAccountCount(storedShowSidebarCount === "true");

      const storedHiddenItems = localStorage.getItem(STORAGE_KEYS.SIDEBAR_HIDDEN_ITEMS);
      if (storedHiddenItems) {
        try {
          const parsed = JSON.parse(storedHiddenItems);
          setHiddenSidebarItems(prev => {
            if (JSON.stringify(prev) === storedHiddenItems) return prev;
            return parsed;
          });
        } catch (e) {
          console.error("Failed to parse hidden sidebar items", e);
          setHiddenSidebarItems([]);
        }
      }

      const storedSupportDismissed = localStorage.getItem(STORAGE_KEYS.SUPPORT_COFFEE_DISMISSED);
      setSupportDismissed(storedSupportDismissed === "true");

      const storedLayoutMode = localStorage.getItem(STORAGE_KEYS.LAYOUT_MODE) || 'sidebar';
      setLayoutMode(storedLayoutMode);
    };

    window.addEventListener("storage", handleSync);
    return () => window.removeEventListener("storage", handleSync);
  }, []);

  // Persist settings
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SHOW_SIDEBAR_ACCOUNT_COUNT, showSidebarAccountCount);
    window.dispatchEvent(new Event("storage"));
  }, [showSidebarAccountCount]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SIDEBAR_HIDDEN_ITEMS, JSON.stringify(hiddenSidebarItems));
    window.dispatchEvent(new Event("storage"));
  }, [hiddenSidebarItems]);

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

  const toggleSidebarItem = (path) => {
    setHiddenSidebarItems(prev =>
      prev.includes(path) ? prev.filter(p => p !== path) : [...prev, path]
    );
  }

  return (
    <div className={styles.settingsContainer}>
      <PageHeader title="Settings" />

      <div className={styles.settingsGrid}>
        <div className={styles.settingsColumn}>
          {/* --- Sidebar Settings --- */}
          <div className={styles.settingsGroup}>
            <h5 className={styles.labelHeading}>Sidebar</h5>

            <div className={styles.subGroupItems}>
              <div className={styles.toggleRow}>
                <label htmlFor="layoutModeToggle" className={styles.toggleLabel}>Use top navigation</label>
                <label className={styles.switch}>
                  <input
                    id="layoutModeToggle"
                    type="checkbox"
                    checked={layoutMode === 'top-nav'}
                    onChange={(e) => {
                      const newMode = e.target.checked ? 'top-nav' : 'sidebar';
                      setLayoutMode(newMode);
                      localStorage.setItem(STORAGE_KEYS.LAYOUT_MODE, newMode);
                      window.dispatchEvent(new Event("storage"));
                    }}
                  />
                  <span className={styles.slider}></span>
                </label>
              </div>

              <div className={styles.toggleRow}>
                <label htmlFor="showSidebarCountToggle" className={styles.toggleLabel}>Show account count</label>
                <label className={styles.switch}>
                  <input
                    id="showSidebarCountToggle"
                    type="checkbox"
                    checked={showSidebarAccountCount}
                    onChange={(e) => {
                      setShowSidebarAccountCount(e.target.checked);
                    }}
                  />
                  <span className={styles.slider}></span>
                </label>
              </div>

              <div className={styles.toggleRow}>
                <label htmlFor="supportNoticeToggle" className={styles.toggleLabel}>Support notice</label>
                <label className={styles.switch}>
                  <input
                    id="supportNoticeToggle"
                    type="checkbox"
                    checked={!supportDismissed}
                    onChange={(e) => {
                      const nextVisible = e.target.checked;
                      if (!nextVisible) {
                        // Trigger confirmation modal when trying to hide
                        setShowDismissModal(true);
                      } else {
                        // Show immediately if turning back on
                        localStorage.setItem(STORAGE_KEYS.SUPPORT_COFFEE_DISMISSED, "false");
                        window.dispatchEvent(new Event("storage"));
                        setSupportDismissed(false);
                        toast.success("Support notice enabled", { id: "support-notice" });
                      }
                    }}
                  />
                  <span className={styles.slider}></span>
                </label>
              </div>
            </div>

            <div className={styles.toggleSubGroup}>
              <div className={styles.subGroupHeader}>
                <span className={styles.subGroupLabel}>Tab visibility</span>
              </div>

              <div className={styles.subGroupItems}>
                {[
                  { id: 'sidebar-logo', label: 'Show Logo' },
                  { id: '/manage', label: 'Show Manage' },
                  { id: '/faq', label: 'Show FAQ' },
                  { id: '/how-it-works', label: 'Show \'How it works\'' },
                  { id: '/settings', label: 'Show Settings' }
                ].map(item => (
                  <div key={item.id} className={styles.toggleRow}>
                    <label htmlFor={`toggle-${item.id}`} className={styles.toggleLabel}>{item.label}</label>
                    <label className={styles.switch}>
                      <input
                        id={`toggle-${item.id}`}
                        type="checkbox"
                        checked={item.id === '/settings' ? true : !hiddenSidebarItems.includes(item.id)}
                        onChange={() => {
                          if (item.id === '/settings') {
                            let newIndex;
                            do {
                              newIndex = Math.floor(Math.random() * CHEEKY_MESSAGES.length);
                            } while (newIndex === lastCheekyIndexRef.current);

                            lastCheekyIndexRef.current = newIndex;
                            toast(CHEEKY_MESSAGES[newIndex], {
                              id: "cheeky-settings",
                              icon: "⚠️"
                            });
                            return;
                          }
                          toggleSidebarItem(item.id);
                        }}
                      />
                      <span className={styles.slider}></span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
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

        <div className={styles.settingsColumn}>
          {/* --- General Settings --- */}
          <div className={styles.settingsGroup}>
            <h5 className={styles.labelHeading}>General</h5>

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
        </div>
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

      <AnimatePresence>
        {showDismissModal && (
          <DismissSupportModal
            onConfirm={() => {
              localStorage.setItem(STORAGE_KEYS.SUPPORT_COFFEE_DISMISSED, "true");
              window.dispatchEvent(new Event("storage"));
              setSupportDismissed(true);
              setShowDismissModal(false);
              toast.success("Support notice hidden", { id: "support-notice" });
            }}
            onCancel={() => setShowDismissModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default Settings;
