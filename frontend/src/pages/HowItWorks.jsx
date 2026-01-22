import PageHeader from '../components/PageHeader';
import styles from './HowItWorks.module.css';
import { FaInfoCircle, FaLock, FaGithub, FaGlobe } from 'react-icons/fa';
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
      BrowserOpenURL('https://github.com/symonxdd/epic-switcher');
    } catch (err) {
      console.error('Failed to open GitHub link in default browser:', err);
    }
  }

  const handleOpenProjectSite = () => {
    try {
      BrowserOpenURL('https://epic-switcher.vercel.app/');
    } catch (err) {
      console.error('Failed to open project site link in default browser:', err);
    }
  }

  const handleFileRefHover = (buttonId, isHovering) => {
    const button = document.getElementById(buttonId);
    if (button) {
      if (isHovering) {
        button.classList.add(styles.hovered);
      } else {
        button.classList.remove(styles.hovered);
      }
    }
  }

  return (
    <div className={styles.pageWrapper}>
      <PageHeader title="How it works" />

      <div className={styles.container}>
        <div className={styles.section}>
          <ul className={styles.bulletList}>
            <li className={styles.paragraph}>
              The Epic Games Launcher persists the active login session to a file called{' '}
              <span
                className={`${styles.file} ${styles.fileSessionRef}`}
                onMouseEnter={() => handleFileRefHover('sessionFileBtn', true)}
                onMouseLeave={() => handleFileRefHover('sessionFileBtn', false)}
              >GameUserSettings.ini</span>.
            </li>

            <li className={styles.paragraph}>
              Epic Switcher reads this file, extracts the session key (and User ID), and saves it
              to a local <span
                className={styles.fileAppDataRef}
                onMouseEnter={() => handleFileRefHover('appDataBtn', true)}
                onMouseLeave={() => handleFileRefHover('appDataBtn', false)}
              >JSON file</span> which allows subsequent accounts to be saved.
            </li>

            <li className={styles.paragraph}>
              When Epic Switcher swaps accounts, it overwrites the session key from{' '}
              <span
                className={`${styles.file} ${styles.fileSessionRef}`}
                onMouseEnter={() => handleFileRefHover('sessionFileBtn', true)}
                onMouseLeave={() => handleFileRefHover('sessionFileBtn', false)}
              >GameUserSettings.ini</span> with the correct one from the <span
                className={styles.fileAppDataRef}
                onMouseEnter={() => handleFileRefHover('appDataBtn', true)}
                onMouseLeave={() => handleFileRefHover('appDataBtn', false)}
              >JSON file</span>.
            </li>
          </ul>

          <hr className={styles.divider} />

          <div className={styles.privacyNotice}>
            <div className={styles.offlineAndNote}>
              <div className={`${styles.inlineItem} ${styles.tooltipTrigger}`}>
                <FaLock className={styles.icon} />
                <strong>Works offline</strong>
                <div className={styles.customTooltip}>
                  Epic Switcher functions entirely offline. The only internet connectivity used is to check for new updates, which only occurs when you navigate to the Settings page.
                </div>
              </div>
              <div className={styles.inlineItem}>
                <FaInfoCircle className={styles.icon} />
                <strong>No data is collected or shared</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.directoriesSection}>
        <strong className={styles.directoriesTitle}>Accessed directories</strong>
        <div className={styles.directoriesList}>
          <span id="appDataBtn" onClick={() => handleOpen('appData')}>
            This app's data <FiArrowUpRight className={styles.directoryIcon} />
          </span>
          <span id="sessionFileBtn" onClick={() => handleOpen('sessionFile')}>
            Epic active session file <FiArrowUpRight className={styles.directoryIcon} />
          </span>
          <span className={styles.logButton} onClick={() => handleOpen('logs')}>
            Epic logs <FiArrowUpRight className={styles.directoryIcon} />
            <div className={styles.customTooltip}>
              Epic Switcher reads the launcher's logs to automatically discover usernames for your accounts, as there is no other way to extract them directly.
            </div>
          </span>
        </div>

        <div className={styles.sourceSection}>
          <strong className={styles.directoriesTitle}>Links</strong>
          <div className={styles.directoriesList}>
            <span onClick={handleOpenGithub}>
              <FaGithub className={styles.directoryIcon} />
              View on GitHub
            </span>
            <span onClick={handleOpenProjectSite}>
              <FaGlobe className={styles.directoryIcon} />
              View project site
            </span>
          </div>
        </div>
      </div>

      <div className={styles.madeWith}>
        Meticulously engineered with<span className={styles.heart}>❤️‍🩹</span> by Symon
      </div>
    </div>
  )
}

export default HowItWorks;
