import { useState, useEffect, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './TopNav.module.css';
import { STORAGE_KEYS } from '../constants/storageKeys';
import appLogo from '../assets/images/app-logo.png';
import { AuthContext } from '../context/AuthContext';

function TopNav() {
  const [hiddenItems, setHiddenItems] = useState([]);
  const { isSwitchingAccount } = useContext(AuthContext);

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
    { path: '/transparency', label: 'Transparency' },
    { path: '/settings', label: 'Settings' },
  ];

  return (
    <nav className={styles.topNav}>
      <div className={styles.navContainer}>
        {navItems
          .filter(item => !hiddenItems.includes(item.path))
          .map((item) => {
            const isManageDisabled = item.path === '/manage' && isSwitchingAccount;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={(e) => {
                  if (window.location.pathname === item.path || isManageDisabled) {
                    e.preventDefault();
                  }
                }}
                className={({ isActive }) =>
                  `${styles.navItem} ${isActive ? styles.active : ''} ${isManageDisabled ? styles.disabled : ''}`
                }
                aria-disabled={isManageDisabled}
                draggable="false"
              >
                {item.label}
              </NavLink>
            );
          })}
      </div>

      <div className={styles.spacer} />
    </nav>
  );
}

export default TopNav;
