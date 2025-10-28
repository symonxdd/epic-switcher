import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { FaUserAlt, FaCog, FaLayerGroup, FaInfoCircle } from 'react-icons/fa';
import { SessionContext } from '../context/SessionContext';
import styles from './Sidebar.module.css';
import appLogo from '../assets/images/app-logo.png';

function Sidebar() {
  const { sessions, isLoading } = useContext(SessionContext);
  const sessionCount = sessions?.length ?? 0;

  return (
    <aside className={styles.sidebar}>
      <div className={styles.topGroup}>
        <div className={styles.logoContainer}>
          {/* <img src={appLogo} alt="App logo" className={styles.logoImage} /> */}
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
            {!isLoading && sessionCount > 0 && (
              <span className={styles.badge}>{sessionCount}</span>
            )}
          </NavLink>

          <NavLink
            to="/manage"
            className={({ isActive }) =>
              isActive
                ? `${styles['sidebar-item']} ${styles.active}`
                : styles['sidebar-item']
            }
          >
            <FaLayerGroup className={styles.icon} /> Manage
          </NavLink>
        </div>
      </div>

      <div className={styles['sidebar-bottom']}>
        <NavLink
          to="/how-it-works"
          className={({ isActive }) =>
            isActive
              ? `${styles['sidebar-item']} ${styles.active}`
              : styles['sidebar-item']
          }
        >
          <FaInfoCircle className={styles.icon} /> How it works
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            isActive
              ? `${styles['sidebar-item']} ${styles.active}`
              : styles['sidebar-item']
          }
        >
          <FaCog className={styles.icon} /> Settings
        </NavLink>
      </div>
    </aside>

  );
}

export default Sidebar;
