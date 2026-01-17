import { useState, useRef, useEffect } from 'react'
import { GetAvailableAvatars, SetAvatar, DeleteAvatarFile, SetAvatarColor } from '../../../wailsjs/go/services/AvatarService'
import styles from './ModalShared.module.css'

export default function EditAvatarModal({
  onSelect,
  onCancel,
  username,
  userId,
  currentAvatarImage,
  currentAvatarColor,
  onAvatarChange,
  onColorChange
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

  const handleCancel = () => {
    closeCallbackRef.current = onCancel;
    setIsClosing(true);
  };

  const handleAvatarClick = async (filename) => {
    if (!userId || !filename) {
      console.warn('Cannot set avatar: missing userId or filename', { userId, filename });
      return;
    }

    if (filename === currentAvatarImage) {
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
      if (confirmDelete === currentAvatarImage) {
        if (onAvatarChange) onAvatarChange("");
      }

      setConfirmDelete(null);
    } catch (err) {
      console.error('Failed to delete avatar:', err);
    }
  };

  function getFirstVisibleChar(str) {
    if (!str) return "";
    const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
    const firstSegment = [...segmenter.segment(str)][0]?.segment || "";
    const isEmoji = /\p{Emoji}/u.test(firstSegment);
    return isEmoji ? firstSegment : firstSegment.toUpperCase();
  }

  const defaultGradient = 'linear-gradient(135deg, #FBBB03, #E21F0A)';

  return (
    <div
      className={`${styles.modalOverlay} ${isClosing ? styles.closing : ''}`}
      onAnimationEnd={handleAnimationEnd}
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3>Edit Avatar</h3>

        <div className={styles.modalTwoColumn}>
          <div className={styles.modalLeftColumn}>
            <div className={styles.avatarPreviewContainer}>
              <div
                className={styles.currentAvatar}
                style={{ background: currentAvatarColor || defaultGradient }}
              >
                {(currentAvatarImage && currentAvatarImage !== "") ? (
                  <img
                    src={`/custom-avatar/${currentAvatarImage}?t=${new Date().getTime()}`}
                    alt="Current Avatar"
                    className={styles.currentAvatar}
                    style={{ margin: 0 }}
                  />
                ) : (
                  getFirstVisibleChar(username)
                )}
              </div>
              <span className={styles.previewLabel}>Current</span>
            </div>
          </div>

          <div className={styles.modalRightColumn}>
            <div className={styles.colorSelectionContainer}>
              <p className={styles.galleryLabel}>Select a color:</p>
              <div className={styles.colorGrid}>
                {[
                  'linear-gradient(135deg, #FBBB03, #E21F0A)',
                  'linear-gradient(135deg, #A855F7, #3B82F6)',
                  'linear-gradient(135deg, #10B981, #3B82F6)',
                  'linear-gradient(135deg, #EC4899, #EF4444)',
                  'linear-gradient(135deg, #F59E0B, #D97706)',
                  'linear-gradient(135deg, #6B7280, #374151)'
                ].map((gradient) => (
                  <div
                    key={gradient}
                    className={`${styles.colorCircle} ${currentAvatarColor === gradient || (!currentAvatarColor && gradient === defaultGradient) ? styles.colorCircleActive : ''}`}
                    style={{ background: gradient }}
                    onClick={async () => {
                      try {
                        await SetAvatarColor(userId, gradient);
                        if (onColorChange) onColorChange(gradient);
                      } catch (err) {
                        console.error('Failed to set avatar color:', err);
                      }
                    }}
                  />
                ))}
              </div>
            </div>

            <div className={styles.avatarGalleryContainer}>
              <p className={styles.galleryLabel}>Or an existing avatar:</p>
              <div className={styles.avatarGallery}>
                {availableAvatars.length === 0 ? (
                  <p style={{ fontSize: '0.75rem', opacity: 0.5, fontStyle: 'italic', margin: '10px 0' }}>
                    No custom images yet
                  </p>
                ) : (
                  availableAvatars.map((avatar) => (
                    <div key={avatar} className={styles.avatarWrapper}>
                      <img
                        src={`/custom-avatar/${avatar}?t=${Date.now()}`}
                        alt={avatar}
                        className={`${styles.avatarMiniature} ${currentAvatarImage === avatar ? styles.avatarMiniatureActive : ''}`}
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
                  ))
                )}
              </div>
            </div>

            <div style={{ textAlign: 'left' }}>
              <p style={{ fontSize: '0.8rem', opacity: 0.7, margin: '0 0 8px 0' }}>
                Selecting a new image will open a file selector.
              </p>
              <button
                className={styles.primaryButton}
                onClick={handleSelect}
              >
                {currentAvatarImage ? 'Change Image' : 'Select Image'}
              </button>
            </div>
          </div>
        </div>

        <div className={styles.modalButtons}>
          <div className={styles.modalButtonRow}>
            <button className={styles.secondaryButton} onClick={handleCancel}>
              Close
            </button>
          </div>
        </div>

        {confirmDelete && (
          <div className={styles.confirmDeleteOverlay} onClick={() => setConfirmDelete(null)}>
            <div className={styles.confirmDeleteModal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.confirmDeleteTitle}>Delete Image</div>
              <p className={styles.confirmDeleteText}>
                Are you sure you want to delete this image from your library?
              </p>
              <div className={styles.confirmDeleteButtons}>
                <button className={styles.secondaryButton} onClick={() => setConfirmDelete(null)}>
                  Cancel
                </button>
                <button
                  className={styles.dangerPrimaryButton}
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
