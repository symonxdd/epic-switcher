import { NavLink } from 'react-router-dom';
import { FaUserAlt, FaCog, FaLayerGroup, FaInfoCircle } from 'react-icons/fa';
import styles from './Sidebar.module.css';

function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles["sidebar-top"]}>
        <NavLink
          to="/accounts"
          className={({ isActive }) =>
            isActive
              ? `${styles["sidebar-item"]} ${styles.active}`
              : styles["sidebar-item"]
          }
        >
          <FaUserAlt className={styles.icon} /> Accounts
        </NavLink>

        <NavLink
          to="/manage"
          className={({ isActive }) =>
            isActive
              ? `${styles["sidebar-item"]} ${styles.active}`
              : styles["sidebar-item"]
          }
        >
          <FaLayerGroup className={styles.icon} /> Manage
        </NavLink>
      </div>

      <div className={styles["sidebar-bottom"]}>
        <NavLink
          to="/how-it-works"
          className={({ isActive }) =>
            isActive
              ? `${styles["sidebar-item"]} ${styles.active}`
              : styles["sidebar-item"]
          }
        >
          <FaInfoCircle className={styles.icon} /> How it works
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            isActive
              ? `${styles["sidebar-item"]} ${styles.active}`
              : styles["sidebar-item"]
          }
        >
          <FaCog className={styles.icon} /> Settings
        </NavLink>
      </div>
    </aside>
  );
}

export default Sidebar;
