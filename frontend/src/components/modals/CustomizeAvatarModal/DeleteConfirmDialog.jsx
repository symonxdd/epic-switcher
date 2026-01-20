import styles from '../ModalShared.module.css';

/**
 * Confirmation dialog for deleting an avatar from the library.
 */
export default function DeleteConfirmDialog({
  filename,
  onCancel,
  onConfirm
}) {
  if (!filename) return null;

  return (
    <div className={styles.confirmDeleteOverlay} onClick={onCancel}>
      <div className={styles.confirmDeleteModal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.confirmDeleteTitle}>Delete Image</div>
        <p className={styles.confirmDeleteText}>
          Are you sure you want to delete this image from your library?
        </p>
        <div className={styles.confirmDeleteButtons}>
          <button className={styles.secondaryButton} onClick={onCancel}>
            Cancel
          </button>
          <button
            className={styles.dangerPrimaryButton}
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
