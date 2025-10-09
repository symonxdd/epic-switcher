import { useContext, useState } from 'react';
import PageHeader from '../components/PageHeader';
import { AuthContext } from '../context/AuthContext';
import { SessionContext } from '../context/SessionContext';
import toast from 'react-hot-toast';
import styles from './Accounts.module.css';

function Accounts() {
  const { isLoggedIn } = useContext(AuthContext);
  const { sessions, isLoading } = useContext(SessionContext);
  const [toastMsg, setToastMsg] = useState(null);

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`Copied: ${text}`);
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  return (
    <>
      <PageHeader title="Accounts" />

      {!isLoggedIn && !isLoading && (
        <div className={styles.noAccountMessage}>
          There's currently no account logged in to the Epic Games Launcher.
        </div>
      )}

      {isLoggedIn && !isLoading && (
        <>
          {sessions.length === 0 ? (
            <div className={styles.noAccountMessage}>
              No saved sessions found. Please add one from the Manage tab.
            </div>
          ) : (
            <div className={styles.listContainer}>
              {sessions.map((session) => {
                const displayName = session.alias || session.username || session.userId;
                return (
                  <div key={session.userId} className={styles.listItem}>
                    <div
                      className={styles.username}
                      onClick={() => copyToClipboard(displayName)}
                    >
                      {displayName}
                    </div>
                    <div
                      className={styles.userId}
                      onClick={() => copyToClipboard(session.userId)}
                    >
                      {session.userId}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg(null)} />}
    </>
  );
}

export default Accounts;
