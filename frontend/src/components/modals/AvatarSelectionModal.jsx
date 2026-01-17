import { useState, useRef, useEffect } from 'react'
import { GetAvailableAvatars, SetAvatar, DeleteAvatarFile } from '../../../wailsjs/go/services/AvatarService'
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
  const [confirmDelete, setConfirmDelete] = useState(null); // stores filename to delete
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
    if (!userId || !filename) {
      console.warn('Cannot set avatar: missing userId or filename', { userId, filename });
      return;
    }

    if (filename === currentAvatarPath) {
      console.log('Avatar already selected, doing nothing.');
      return;
    }

    try {
      console.log('Setting avatar for user:', userId, 'to file:', filename);
      await SetAvatar(userId, filename);
      if (onAvatarChange) {
        onAvatarChange(filename);
      }
      // Only close if onAvatarChange didn't already handle it
      closeCallbackRef.current = onCancel;
      setIsClosing(true);
    } catch (err) {
      console.error('Failed to set avatar:', err);
    }
  };

  const handleDeleteClick = (e, filename) => {
    e.stopPropagation();
    setConfirmDelete(filename);
  };

  const confirmDeleteAvatar = async () => {
    if (!confirmDelete) return;
    try {
      await DeleteAvatarFile(confirmDelete);
      setAvailableAvatars(prev => prev.filter(a => a !== confirmDelete));

      // If the deleted avatar was the one currently assigned to this user, 
      // we should probably clear it in the UI/session store too.
      if (confirmDelete === currentAvatarPath) {
        onRemove();
      }

      setConfirmDelete(null);
    } catch (err) {
      console.error('Failed to delete avatar:', err);
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
              <span className={styles.previewLabel}>Current</span>
            </div>
          )}

          {availableAvatars.length > 0 && (
            <div className={styles.avatarGalleryContainer}>
              <p className={styles.galleryLabel}>Select from existing avatars:</p>
              <div className={styles.avatarGallery}>
                {availableAvatars.map((avatar) => (
                  <div key={avatar} className={styles.avatarWrapper}>
                    <img
                      src={`/custom-avatar/${avatar}?t=${Date.now()}`}
                      alt={avatar}
                      className={`${styles.avatarMiniature} ${currentAvatarPath === avatar ? styles.avatarMiniatureActive : ''}`}
                      onClick={() => handleAvatarClick(avatar)}
                    />
                    <button
                      className={styles.deleteAvatarBtn}
                      onClick={(e) => handleDeleteClick(e, avatar)}
                      title="Delete this image"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
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

        {confirmDelete && (
          <div className={styles.confirmDeleteOverlay} onClick={() => setConfirmDelete(null)}>
            <div className={styles.confirmDeleteModal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.confirmDeleteTitle}>Delete Image</div>
              <p className={styles.confirmDeleteText}>
                Confirm deleting this image
              </p>
              <div className={styles.confirmDeleteButtons}>
                <button className={styles.secondaryButton} onClick={() => setConfirmDelete(null)}>
                  Cancel
                </button>
                <button
                  className={styles.primaryButton}
                  onClick={confirmDeleteAvatar}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
