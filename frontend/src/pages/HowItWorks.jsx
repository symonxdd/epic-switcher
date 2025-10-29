import PageHeader from '../components/PageHeader';
import styles from './HowItWorks.module.css';
import { FaInfoCircle, FaLock, FaGithub } from 'react-icons/fa';
import { FiArrowUpRight } from 'react-icons/fi';
import { OpenDirectory } from '../../wailsjs/go/services/SystemService';
import { BrowserOpenURL } from '../../wailsjs/runtime';

function HowItWorks() {
  const handleOpen = async (key) => {
    try {
      await OpenDirectory(key);
    } catch (err) {
      console.error('Failed to open directory:', err);
    }
  }

  const handleOpenGithub = () => {
    try {
      BrowserOpenURL('https://github.com/symonxdd/epic-games-account-switcher');
    } catch (err) {
      console.error('Failed to open GitHub link in default browser:', err);
    }
  }

  return (
    <>
      <PageHeader title="How it works" />

      <div className={styles.container}>
        <div className={styles.section}>
          <div className={styles.offlineSubtext}>
            No data is collected or shared. It only stores your login sessions locally on your device.
          </div>

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

          <div className={styles.privacyNotice}>
            {/* merged offline + note line */}
            <div className={styles.offlineAndNote}>
              <div className={styles.inlineItem}>
                <FaLock className={`${styles.icon} ${styles.lockIcon}`} />
                <strong>This app works completely offline</strong>
              </div>
              <div className={styles.inlineItem}>
                <FaInfoCircle className={styles.icon} />
                <strong>This app will not affect your accounts in any way</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.directoriesSection}>
        <strong className={styles.directoriesTitle}>Accessed directories</strong>
        <div className={styles.directoriesList}>
          <span onClick={() => handleOpen('appData')}>
            This app's data <FiArrowUpRight className={styles.directoryIcon} />
          </span>
          <span onClick={() => handleOpen('sessionFile')}>
            Epic active session file <FiArrowUpRight className={styles.directoryIcon} />
          </span>
          <span onClick={() => handleOpen('logs')}>
            Epic logs <FiArrowUpRight className={styles.directoryIcon} />
          </span>
        </div>

        <div className={styles.sourceSection}>
          <strong className={styles.directoriesTitle}>Source code</strong>
          <div className={styles.directoriesList}>
            <span onClick={handleOpenGithub}>
              <FaGithub className={styles.directoryIcon} />
              View on GitHub
            </span>
          </div>
        </div>
      </div>
    </>
  )
}

export default HowItWorks;
