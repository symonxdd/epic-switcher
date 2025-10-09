import { useContext } from 'react';
import PageHeader from '../components/PageHeader';
import { SessionContext } from '../context/SessionContext';
import styles from './Manage.module.css';

function Manage() {
  const { sessions, isLoading, onAliasChange } = useContext(SessionContext);

  if (isLoading) return null;

  if (!sessions.length) {
    return (
      <>
        <PageHeader title="Manage" />
        <div className={styles.emptyState}>
          No saved sessions yet. Log in with Epic Games first.
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Manage" />

      <div className={styles.listContainer}>
        {sessions.map((session) => (
          <div key={session.userId} className={styles.listItem}>
            <div className={styles.originalName}>
              {session.username || session.userId}
            </div>
            <div className={styles.inputWrapper}>
              <input
                className={styles.aliasInput}
                value={session.alias || ''}
                placeholder="Enter alias..."
                onChange={(e) => onAliasChange(session.userId, e.target.value)}
              />
              {session.alias && (
                <button
                  className={styles.clearBtn}
                  onClick={() => onAliasChange(session.userId, '')}
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Manage;
