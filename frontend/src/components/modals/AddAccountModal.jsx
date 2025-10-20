import styles from './ModalShared.module.css'

export default function AddAccountModal({
  onMoveAside,
  onCancel
}) {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3>Prepare to Add Account</h3>

        <div className={styles.modalNote}>
          <p>This will move the active session aside.</p>
          <p>
            The Epic Games Launcher will <strong>restart</strong> so you can log in with a different account.
          </p>
          <p>
            Once you've signed in, return to this app.
          </p>
        </div>

        <div className={styles.modalButtons}>
          <div className={styles.modalButtonRow}>
            <button className={styles.primaryButton} onClick={onMoveAside}>
              Move aside
            </button>
            <button className={styles.secondaryButton} onClick={onCancel}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
