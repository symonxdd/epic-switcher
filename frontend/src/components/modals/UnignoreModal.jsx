import styles from "./ModalShared.module.css";

export default function UnignoreModal({ userId, onConfirm, onCancel }) {
  return (
    <div className={styles.modalOverlay} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3>Revert Ignored Account</h3>

        <div className={styles.modalNote}>
          <p>Are you sure you want to <strong>un-ignore</strong> this account?</p>
          <p>The <strong>Accounts page</strong> will start notifying you about this account again.</p>
        </div>

        <div className={styles.modalUserId}>User ID: {userId}</div>

        <div className={styles.modalButtons}>
          <div className={styles.modalButtonRow}>
            <button className={styles.primaryButton} onClick={onConfirm}>
              Un-ignore
            </button>
            <button className={styles.secondaryButton} onClick={onCancel}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
