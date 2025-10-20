import styles from "../modals/ModalShared.module.css";

export default function DeleteSessionModal({ session, onConfirm, onCancel }) {
  if (!session) return null;

  return (
    <div className={styles.modalOverlay} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3>Delete Saved Session</h3>

        <div className={styles.modalNote}>
          <p>Are you sure you want to <strong>delete</strong> this saved session?</p>
          <p>This will <strong>not log you out</strong>, but only remove the session from the saved sessions this app manages.</p>
        </div>

        {session.username && (
          <div className={styles.modalUsername}>
            Username: {session.username}
          </div>
        )}
        <div className={styles.modalUserId}>
          User ID: {session.userId}
        </div>

        <div className={styles.modalButtons}>
          <div className={styles.modalButtonRow}>
            <button className={styles.primaryButton} onClick={onConfirm}>
              Delete
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
