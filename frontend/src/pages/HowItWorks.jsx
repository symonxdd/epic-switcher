import PageHeader from '../components/PageHeader';
import styles from './HowItWorks.module.css';
import { FaInfoCircle, FaLock } from 'react-icons/fa';
import { FiArrowUpRight } from 'react-icons/fi';
import { OpenDirectory } from '../../wailsjs/go/services/SystemService';

// pull version/env dynamically
const appVersion = import.meta.env.VITE_APP_VERSION || 'v1.0.0';
const environment =
  import.meta.env.MODE === 'development' ? '(dev)' : '(release)';

function HowItWorks() {
  const handleOpen = async (key) => {
    try {
      await OpenDirectory(key);
    } catch (err) {
      console.error('Failed to open directory:', err);
    }
  }

  return (
    <>
      <PageHeader title="How it works" />

      <div className={styles.container}>
        <div className={styles.section}>
          <div className={styles.paragraph}>
            The Epic Games Launcher persists the active login session to a file called
            <span className={styles.file}> GameUserSettings.ini</span>.
          </div>

          <div className={styles.paragraph}>
            Epic Switcher reads this file, extracts the session key (and User ID), and saves it
            in a local JSON file which allows subsequent accounts to be saved.
          </div>

          <div className={styles.paragraph}>
            When Epic Switcher swaps accounts, it overwrites the session key from
            <span className={styles.file}> GameUserSettings.ini</span> with the correct one from the JSON file.
          </div>

          <hr className={styles.divider} />

          <div className={styles.note}>
            <FaInfoCircle className={styles.icon} />
            <strong>This app will not affect your accounts in any way</strong>
          </div>

          <div className={styles.offlineNotice}>
            <div className={styles.offlineLine}>
              <FaLock className={styles.icon} />
              <strong>It works completely offline</strong>
            </div>
            <div className={styles.offlineSubtext}>
              No data is collected or shared. It only stores your login sessions locally on your device.
            </div>
          </div>
        </div>
      </div>

      <div className={styles.directoriesSection}>
        <strong className={styles.directoriesTitle}>Accessed directories:</strong>
        <div className={styles.directoriesList}>
          <span onClick={() => handleOpen('appData')}>
            This app's data <FiArrowUpRight className={styles.directoryIcon} />
          </span>
          <span onClick={() => handleOpen('sessionFile')}>
            Epic Games Launcher active session file <FiArrowUpRight className={styles.directoryIcon} />
          </span>
          <span onClick={() => handleOpen('logs')}>
            Epic Games Launcher logs <FiArrowUpRight className={styles.directoryIcon} />
          </span>
        </div>
      </div>
    </>
  );
}

export default HowItWorks;
