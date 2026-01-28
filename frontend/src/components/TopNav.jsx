import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './TopNav.module.css';
import { STORAGE_KEYS } from '../constants/storageKeys';

function TopNav() {
  const [hiddenItems, setHiddenItems] = useState([]);

  useEffect(() => {
    const handleSync = () => {
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
      } else {
        setHiddenItems([]);
      }
    };

    handleSync();
    window.addEventListener("storage", handleSync);
    return () => window.removeEventListener("storage", handleSync);
  }, []);

  const navItems = [
    { path: '/accounts', label: 'Accounts' },
    { path: '/manage', label: 'Manage' },
    { path: '/faq', label: 'FAQ' },
    { path: '/how-it-works', label: 'How it works' },
    { path: '/settings', label: 'Settings' },
  ];

  return (
    <nav className={styles.topNav}>
      <div className={styles.navContainer}>
        {navItems
          .filter(item => !hiddenItems.includes(item.path))
          .map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
              }
              draggable="false"
            >
              {item.label}
            </NavLink>
          ))}
      </div>
    </nav>
  );
}

export default TopNav;
