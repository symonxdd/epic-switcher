import { useState, useRef, useEffect } from 'react'
import { GetAvailableAvatars, SetAvatar } from '../../../wailsjs/go/services/AvatarService'
import styles from './ModalShared.module.css'

export default function AvatarSelectionModal({
  onSelect,
  onRemove,
  onCancel,
  username,
  userId,
  currentAvatarPath,
  onAvatarChange
}) {
  const [isClosing, setIsClosing] = useState(false);
  const [availableAvatars, setAvailableAvatars] = useState([]);
  const closeCallbackRef = useRef(null);

  useEffect(() => {
    GetAvailableAvatars()
      .then((avatars) => setAvailableAvatars(avatars || []))
      .catch(console.error);
  }, []);

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

  const handleAvatarClick = async (filename) => {
    try {
      await SetAvatar(userId, filename);
      if (onAvatarChange) {
        onAvatarChange(filename);
      }
      closeCallbackRef.current = onCancel;
      setIsClosing(true);
    } catch (err) {
      console.error('Failed to set avatar:', err);
    }
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
          <p>
            This will open a file selector on your system.
          </p>

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

          {availableAvatars.length > 0 && (
            <div className={styles.avatarGalleryContainer}>
              <p className={styles.galleryLabel}>Select from existing avatars:</p>
              <div className={styles.avatarGallery}>
                {availableAvatars.map((avatar) => (
                  <img
                    key={avatar}
                    src={`/custom-avatar/${avatar}?t=${Date.now()}`}
                    alt={avatar}
                    className={`${styles.avatarMiniature} ${currentAvatarPath === avatar ? styles.avatarMiniatureActive : ''}`}
                    onClick={() => handleAvatarClick(avatar)}
                  />
                ))}
              </div>
            </div>
          )}
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
