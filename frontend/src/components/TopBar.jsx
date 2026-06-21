import { useEffect, useState } from 'react';
import { Minus, Square, Copy, X } from 'lucide-react';
import styles from './TopBar.module.css';
import {
  WindowMinimise,
  WindowToggleMaximise,
  WindowIsMaximised,
  Quit,
} from '../../wailsjs/runtime/runtime';
import { ThemeToggle } from './ThemeToggle';
import { LayoutToggle } from './LayoutToggle';
import { STORAGE_KEYS } from '../constants/storageKeys';

function TopBar({ className }) {
  const [buttonStyle, setButtonStyle] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.WINDOW_BUTTON_STYLE) || 'windows';
  });
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    const handleSync = () => {
      setButtonStyle(localStorage.getItem(STORAGE_KEYS.WINDOW_BUTTON_STYLE) || 'macos');
    };
    window.addEventListener('storage', handleSync);
    return () => window.removeEventListener('storage', handleSync);
  }, []);

  useEffect(() => {
    WindowIsMaximised().then(setIsMaximized);
    const syncMaximized = () => WindowIsMaximised().then(setIsMaximized);
    window.addEventListener('resize', syncMaximized);
    return () => window.removeEventListener('resize', syncMaximized);
  }, []);

  const handleToggleMaximize = () => {
    WindowToggleMaximise();
    setIsMaximized((prev) => !prev);
  };

  return (
    <div className={`${styles.topBar} ${className || ''}`} onDoubleClick={handleToggleMaximize}>
      <div className={styles.titleContainer}>
        <ThemeToggle className={styles.topBtn} />
        <LayoutToggle className={styles.topBtn} />
      </div>

      {buttonStyle === 'windows' ? (
        <div key="windows" className={styles.winControlsWindows}>
          <button
            className={styles.winBtnWindows}
            onClick={WindowMinimise}
            onDoubleClick={(e) => e.stopPropagation()}
            title="Minimize"
            aria-label="Minimize"
          >
            <Minus size={14} strokeWidth={1.8} />
          </button>
          <button
            className={styles.winBtnWindows}
            onClick={handleToggleMaximize}
            onDoubleClick={(e) => e.stopPropagation()}
            title={isMaximized ? "Restore" : "Maximize"}
            aria-label={isMaximized ? "Restore" : "Maximize"}
          >
            {isMaximized ? <Copy size={13} strokeWidth={1.7} /> : <Square size={11} strokeWidth={1.8} />}
          </button>
          <button
            className={`${styles.winBtnWindows} ${styles.closeWindows}`}
            onClick={Quit}
            onDoubleClick={(e) => e.stopPropagation()}
            title="Close"
            aria-label="Close"
          >
            <X size={14} strokeWidth={1.8} />
          </button>
        </div>
      ) : (
        <div key="macos" className={styles.winControls}>
          <button
            className={`${styles.winBtn} ${styles.minimize}`}
            onClick={WindowMinimise}
            title="Minimize"
          ></button>
          <button
            className={`${styles.winBtn} ${styles.maximize}`}
            onClick={handleToggleMaximize}
            title="Maximize"
          ></button>
          <button
            className={`${styles.winBtn} ${styles.close}`}
            onClick={Quit}
            title="Close"
          ></button>
        </div>
      )}
    </div>
  );
}

export default TopBar;
