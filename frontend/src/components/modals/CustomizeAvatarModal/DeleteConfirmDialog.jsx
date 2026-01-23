import styles from '../ModalShared.module.css';
import { getThumbnailUrl } from './avatarUtils';
import { useAvatarCache } from '../../../context/AvatarCacheContext';

export default function DeleteConfirmDialog({
  filename,
  onCancel,
  onConfirm
}) {
  const { cacheVersion } = useAvatarCache();

  if (!filename) return null;

  return (
    <div className={styles.confirmDeleteOverlay} onClick={onCancel}>
      <div className={styles.confirmDeleteModal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.confirmDeleteTitle}>Delete image</div>

        <p className={styles.confirmDeleteText}>
          Are you sure you want to delete this image from your library?
        </p>

        <div className={styles.deletePreviewContainer}>
          <img
            src={getThumbnailUrl(filename, cacheVersion)}
            alt="To be deleted"
            className={styles.deletePreviewImage}
          />
        </div>
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
