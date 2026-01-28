import styles from './TopBar.module.css';
import { WindowMinimise, WindowToggleMaximise, Quit } from '../../wailsjs/runtime/runtime';

function TopBar({ className }) {
  const isDev = import.meta.env.MODE === 'development';
  const title = `Epic Switcher${isDev ? ' (dev)' : ''}`;

  return (
    <div className={`${styles.topBar} ${className || ''}`} onDoubleClick={WindowToggleMaximise}>
      <div className={styles.title}>{title}</div>

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
