import PageHeader from '../components/PageHeader';
import styles from './HowItWorks.module.css';

function HowItWorks() {
  return (
    <>
      <PageHeader title="How it works" />

      <div className={styles.container}>
        <div className={styles.section}>
          <p className={styles.paragraph}>
            The Epic Games Launcher persists the active login session to a file called
            <span className={styles.file}> GameUserSettings.ini</span>.
          </p>

          <p className={styles.paragraph}>
            Epic Switcher reads this file, extracts the session key (and User ID), and saves it
            in a local JSON file which allows subsequent accounts to be saved.
          </p>

          <p className={styles.paragraph}>
            When Epic Switcher swaps accounts, it overwrites the session key from the
            <span className={styles.file}> GameUserSettings.ini</span> file with the correct one from the JSON file.
          </p>


          <hr className={styles.divider} />

          <p className={styles.note}>
            Using this tool will not affect your accounts in any way.
          </p>
        </div>
      </div>
    </>
  );
}

export default HowItWorks;
