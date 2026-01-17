import { useState, useRef } from 'react'
import styles from './ModalShared.module.css'

export default function AvatarSelectionModal({
  onSelect,
  onRemove,
  onCancel,
  username,
  currentAvatarPath
}) {
  const [isClosing, setIsClosing] = useState(false);
  const closeCallbackRef = useRef(null);

  const handleAnimationEnd = (e) => {
    if (e.target !== e.currentTarget) return;
    if (isClosing && closeCallbackRef.current) {
      closeCallbackRef.current();
    }
  };

  const handleSelect = () => {
    onSelect();
    closeCallbackRef.current = () => { };
    setIsClosing(true);
  };

  const handleRemove = () => {
    if (onRemove) {
      onRemove();
      closeCallbackRef.current = () => { };
      setIsClosing(true);
    }
  };

  const handleCancel = () => {
    closeCallbackRef.current = onCancel;
    setIsClosing(true);
  };

  return (
    <div
      className={`${styles.modalOverlay} ${isClosing ? styles.closing : ''}`}
      onAnimationEnd={handleAnimationEnd}
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3>Custom Avatar</h3>

        <div className={styles.modalNote}>
          <p>You can set a custom profile picture for <strong>{username}</strong>.</p>

          {currentAvatarPath && (
            <div className={styles.avatarPreviewContainer}>
              <img
                src={`/custom-avatar/${currentAvatarPath}?t=${new Date().getTime()}`}
                alt="Current Avatar"
                className={styles.currentAvatar}
              />
              <span className={styles.previewLabel}>Current Selection</span>
            </div>
          )}

          <p>
            This will open a file selector on your system. Supported formats: PNG, JPG, WEBP.
          </p>
        </div>

        <div className={styles.modalButtons}>
          <div className={styles.modalButtonRow}>
            {currentAvatarPath && (
              <button className={styles.dangerButton} onClick={handleRemove} style={{ marginRight: 'auto' }}>
                Remove
              </button>
            )}
            <button className={styles.secondaryButton} onClick={handleCancel}>
              Cancel
            </button>
            <button className={styles.primaryButton} onClick={handleSelect}>
              {currentAvatarPath ? 'Change Image' : 'Select Image'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
