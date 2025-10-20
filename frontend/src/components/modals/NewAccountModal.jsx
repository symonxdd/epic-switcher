import styles from './ModalShared.module.css'

export default function NewAccountModal({
  newLoginUsername,
  newLoginSession,
  onAccept,
  onIgnore,
  onDismiss
}) {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3>New Account Detected</h3>

        <div className={styles.modalNote}>
          This is the account that's logged in at the moment in the Epic Games Launcher.
        </div>

        {newLoginUsername && (
          <div className={styles.modalUsername}>
            Username: {newLoginUsername}
          </div>
        )}
        <div className={styles.modalUserId}>
          User ID: {newLoginSession.userId}
        </div>

        <div className={styles.modalButtons}>
          <div className={styles.modalButtonRow}>
            <button className={styles.primaryButton} onClick={onAccept}>
              Add Account
            </button>
            <button className={styles.secondaryButton} onClick={onDismiss}>
              Not now
            </button>
          </div>
          <button className={styles.ghostButton} onClick={onIgnore}>
            Don't ask again
          </button>
        </div>
      </div>
    </div>
  )
}
