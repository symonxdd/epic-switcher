import styles from './TopBar.module.css';
import { WindowMinimise, WindowToggleMaximise, Quit } from '../../wailsjs/runtime/runtime';
import { ThemeToggle } from './ThemeToggle';

function TopBar({ className }) {
  const title = "Epic Switcher";

  return (
    <div className={`${styles.topBar} ${className || ''}`} onDoubleClick={WindowToggleMaximise}>
      <div className={styles.titleContainer}>
        <ThemeToggle className={styles.themeToggle} />
      </div>

      <div className={styles.winControls}>
        <button
          className={`${styles.winBtn} ${styles.minimize}`}
          onClick={WindowMinimise}
          title="Minimize"
        ></button>
        <button
          className={`${styles.winBtn} ${styles.maximize}`}
          onClick={WindowToggleMaximise}
          title="Maximize"
        ></button>
        <button
          className={`${styles.winBtn} ${styles.close}`}
          onClick={Quit}
          title="Close"
        ></button>
      </div>
    </div>
  );
}

export default TopBar;
