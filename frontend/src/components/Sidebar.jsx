import { useContext, useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { FaRegUser, FaUserAlt, FaCog, FaListUl, FaShieldAlt } from 'react-icons/fa';
import { SessionContext } from '../context/SessionContext';
import { AuthContext } from '../context/AuthContext';
import styles from './Sidebar.module.css';
import appLogo from '../assets/images/app-logo.png';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { SupportCoffee } from './SupportCoffee';

// The sidebar can be dragged wider or narrower; these keep the logo, labels
// and the coffee card fitting, and leave the content enough room
const SIDEBAR_DEFAULT_WIDTH = 260;
const SIDEBAR_MIN_WIDTH = 200;
const SIDEBAR_MAX_WIDTH = 360;

function readSidebarWidth() {
  const stored = Number(localStorage.getItem(STORAGE_KEYS.SIDEBAR_WIDTH));
  return stored >= SIDEBAR_MIN_WIDTH && stored <= SIDEBAR_MAX_WIDTH ? stored : SIDEBAR_DEFAULT_WIDTH;
}

function Sidebar({ style }) {
  const [width, setWidth] = useState(readSidebarWidth);
  const [isResizing, setIsResizing] = useState(false);
  const { sessions, isLoading } = useContext(SessionContext);
  const { isSwitchingAccount } = useContext(AuthContext);
  const [showCounter, setShowCounter] = useState(false);
  const [hiddenItems, setHiddenItems] = useState([]);
  const sessionCount = sessions?.length ?? 0;
  const isDev = import.meta.env.MODE === 'development';

  useEffect(() => {
    const handleSync = () => {
      const stored = localStorage.getItem(STORAGE_KEYS.SHOW_SIDEBAR_ACCOUNT_COUNT);
      setShowCounter(stored === "true");

      const storedHidden = localStorage.getItem(STORAGE_KEYS.SIDEBAR_HIDDEN_ITEMS);
      if (storedHidden) {
        try {
          const parsed = JSON.parse(storedHidden);
          setHiddenItems(prev => {
            if (JSON.stringify(prev) === storedHidden) return prev;
            return parsed;
          });
        } catch (e) {
          console.error("Failed to parse hidden items", e);
          setHiddenItems([]);
        }
      }
    };

    handleSync();
    window.addEventListener("storage", handleSync);
    return () => window.removeEventListener("storage", handleSync);
  }, []);

  const handleResizeStart = (e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = width;
    let latestWidth = startWidth;

    setIsResizing(true);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    const handleMove = (moveEvent) => {
      latestWidth = Math.min(
        SIDEBAR_MAX_WIDTH,
        Math.max(SIDEBAR_MIN_WIDTH, Math.round(startWidth + moveEvent.clientX - startX))
      );
      setWidth(latestWidth);
    };

    const handleUp = () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      setIsResizing(false);
      localStorage.setItem(STORAGE_KEYS.SIDEBAR_WIDTH, String(latestWidth));
    };

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
  };

  // Double-click the handle to go back to the default width
  const handleResizeReset = () => {
    setWidth(SIDEBAR_DEFAULT_WIDTH);
    localStorage.removeItem(STORAGE_KEYS.SIDEBAR_WIDTH);
  };

  return (
    <aside className={styles.sidebar} style={{ ...style, width }}>
      <div
        className={`${styles.resizeHandle} ${isResizing ? styles.resizing : ''}`}
        onPointerDown={handleResizeStart}
        onDoubleClick={handleResizeReset}
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize sidebar"
      />
      <div className={styles.topGroup}>
        {!hiddenItems.includes('sidebar-logo') && (
          <div className={styles.logoContainer}>
            <img src={appLogo} alt="App logo" className={styles.logoImage} />
            <div className={styles.logoTextContainer}>
              <span className={styles.logoText}>Epic Switcher</span>
              {isDev && <span className={styles.devIndicator}>(dev)</span>}
            </div>
          </div>
        )}
        <div className={styles['sidebar-top']}>
          <NavLink
            to="/accounts"
            className={({ isActive }) =>
              isActive
                ? `${styles['sidebar-item']} ${styles.active}`
                : styles['sidebar-item']
            }
          >
            <FaUserAlt className={styles.icon} />
            <span>Accounts</span>
            {!isLoading && sessionCount > 0 && showCounter && (
              <span className={styles.badge}>{sessionCount}</span>
            )}
          </NavLink>

          {!hiddenItems.includes('/manage') && (
            <NavLink
              to="/manage"
              onClick={(e) => {
                if (isSwitchingAccount) e.preventDefault();
              }}
              className={({ isActive }) =>
                `${styles['sidebar-item']} ${isActive ? styles.active : ''} ${isSwitchingAccount ? styles.disabled : ''}`
              }
              aria-disabled={isSwitchingAccount}
            >
              <FaListUl className={styles.icon} />
              <span>Manage</span>
            </NavLink>
          )}
        </div>
      </div>

      <div className={styles.bottomGroup}>
        <div className={styles['sidebar-bottom']}>
          {!hiddenItems.includes('/transparency') && (
            <NavLink
              to="/transparency"
              className={({ isActive }) =>
                isActive
                  ? `${styles['sidebar-item']} ${styles.active}`
                  : styles['sidebar-item']
              }
            >
              <FaShieldAlt className={styles.icon} />
              <span>Transparency</span>
            </NavLink>
          )}

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              isActive
                ? `${styles['sidebar-item']} ${styles.active}`
                : styles['sidebar-item']
            }
          >
            <FaCog className={styles.icon} />
            <span>Settings</span>
          </NavLink>
        </div>

        <div className={styles.coffeeContainer}>
          <SupportCoffee />
        </div>
      </div>
    </aside>

  );
}

export default Sidebar;
