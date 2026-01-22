import { useContext, useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { FaUserAlt, FaCog, FaLayerGroup, FaInfoCircle, FaQuestionCircle } from 'react-icons/fa';
import { SessionContext } from '../context/SessionContext';
import styles from './Sidebar.module.css';
import appLogo from '../assets/images/app-logo.png';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { SupportCoffee } from './SupportCoffee';

function Sidebar() {
  const { sessions, isLoading } = useContext(SessionContext);
  const [showCounter, setShowCounter] = useState(false);
  const [hiddenItems, setHiddenItems] = useState([]);
  const sessionCount = sessions?.length ?? 0;

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

  return (
    <aside className={styles.sidebar}>
      <div className={styles.topGroup}>
        <div className={styles.logoContainer}>
          <img src={appLogo} alt="App logo" className={styles.logoImage} />
          <span className={styles.logoText}>Epic Switcher</span>
        </div>

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
              className={({ isActive }) =>
                isActive
                  ? `${styles['sidebar-item']} ${styles.active}`
                  : styles['sidebar-item']
              }
            >
              <FaLayerGroup className={styles.icon} />
              <span>Manage</span>
            </NavLink>
          )}
        </div>
      </div>

      <div className={styles.bottomGroup}>
        <div className={styles['sidebar-bottom']}>
          {!hiddenItems.includes('/faq') && (
            <NavLink
              to="/faq"
              className={({ isActive }) =>
                isActive
                  ? `${styles['sidebar-item']} ${styles.active}`
                  : styles['sidebar-item']
              }
            >
              <FaQuestionCircle className={styles.icon} />
              <span>FAQ</span>
            </NavLink>
          )}

          {!hiddenItems.includes('/how-it-works') && (
            <NavLink
              to="/how-it-works"
              className={({ isActive }) =>
                isActive
                  ? `${styles['sidebar-item']} ${styles.active}`
                  : styles['sidebar-item']
              }
            >
              <FaInfoCircle className={styles.icon} />
              <span>How it works</span>
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
