import { useState, useRef, useEffect } from 'react'
import { GetAvailableAvatars, SetAvatar, DeleteAvatarFile, SetAvatarColor, RemoveAvatar } from '../../../wailsjs/go/services/AvatarService'
import styles from './ModalShared.module.css'
import { STORAGE_KEYS } from '../../constants/storageKeys'

export default function EditAvatarModal({
  onSelect,
  onCancel,
  username,
  userId,
  currentAvatarImage,
  currentAvatarColor,
  onAvatarChange,
  onColorChange,
  onRemove
}) {
  const [isClosing, setIsClosing] = useState(false);
  const [availableAvatars, setAvailableAvatars] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(null); // stores filename to delete
  const [showBorder, setShowBorder] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.SHOW_AVATAR_BORDER);
    return stored !== null ? stored === 'true' : true;
  });
  const closeCallbackRef = useRef(null);

  const handleToggleBorder = (e) => {
    const newVal = e.target.checked;
    setShowBorder(newVal);
    localStorage.setItem(STORAGE_KEYS.SHOW_AVATAR_BORDER, newVal);
    // Notify window for other components to update if they are on the same page
    window.dispatchEvent(new Event('storage'));
  };

  const refreshAvatars = () => {
    GetAvailableAvatars()
      .then((avatars) => setAvailableAvatars(avatars || []))
      .catch(console.error);
  };

  useEffect(() => {
    refreshAvatars();
  }, []);

  // Refresh gallery when image changes (e.g. after upload or set)
  useEffect(() => {
    refreshAvatars();
  }, [currentAvatarImage]);

  const handleAnimationEnd = (e) => {
    if (e.target !== e.currentTarget) return;
    if (isClosing && closeCallbackRef.current) {
      closeCallbackRef.current();
    }
  };

  const handleSelect = async () => {
    await onSelect();
    // Do not close automatically
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
      // Do not close automatically
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
        <h3>Customize Avatar</h3>

        <div className={styles.modalTwoColumn}>
          <div className={styles.modalLeftColumn}>
            <div className={styles.avatarPreviewContainer}>
              <div
                className={`${styles.currentAvatar} ${(!showBorder || !currentAvatarImage || currentAvatarImage === "") ? styles.currentAvatarNoBorder : ''}`}
                style={{ background: currentAvatarColor || defaultGradient }}
              >
                {(currentAvatarImage && currentAvatarImage !== "") ? (
                  <img
                    src={`/custom-avatar/${currentAvatarImage}?t=${new Date().getTime()}`}
                    alt="Current Avatar"
                    style={{ margin: 0 }}
                  />
                ) : (
                  <span className={styles.initialsText}>{getFirstVisibleChar(username)}</span>
                )}
              </div>
              {/* <span className={styles.previewLabel}>Current</span> */}

              {currentAvatarImage && currentAvatarImage !== "" && (
                <div className={styles.showBorderToggle} style={{ '--avatar-accent': currentAvatarColor || defaultGradient }}>
                  <label htmlFor="showBorderToggle" className={styles.toggleLabel}>Show border</label>
                  <label className={styles.switch}>
                    <input
                      id="showBorderToggle"
                      type="checkbox"
                      checked={showBorder}
                      onChange={handleToggleBorder}
                    />
                    <span className={styles.slider}></span>
                  </label>
                </div>
              )}
            </div>
          </div>

          <div className={styles.modalRightColumn}>


            <div className={styles.avatarGalleryContainer}>
              <p className={styles.galleryLabel}>Or an existing avatar:</p>
              <div className={styles.avatarGallery}>
                <button
                  className={styles.uploadAvatarBtn}
                  onClick={handleSelect}
                  title="Select new image"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </button>
                <div
                  className={`${styles.avatarWrapper} ${(!currentAvatarImage || currentAvatarImage === "") ? styles.avatarWrapperActive : ''}`}
                  style={{ '--avatar-accent': currentAvatarColor || defaultGradient }}
                >
                  <div
                    className={`${styles.avatarMiniature} ${styles.noneAvatar} ${(!currentAvatarImage || currentAvatarImage === "") ? styles.avatarMiniatureActive : ''}`}
                    onClick={async () => {
                      if (!currentAvatarImage || currentAvatarImage === "") return;
                      try {
                        await RemoveAvatar(userId);
                        if (onAvatarChange) onAvatarChange("");
                        if (onRemove) onRemove();
                      } catch (err) {
                        console.error('Failed to remove avatar image:', err);
                      }
                    }}
                    style={{ background: currentAvatarColor || defaultGradient }}
                    title="Use initials (no image)"
                  >
                    <span className={styles.initialsText}>{getFirstVisibleChar(username)}</span>
                  </div>
                </div>

                {availableAvatars.map((avatar) => (
                  <div
                    key={avatar}
                    className={`${styles.avatarWrapper} ${currentAvatarImage === avatar ? styles.avatarWrapperActive : ''}`}
                    style={currentAvatarImage === avatar ? { '--avatar-accent': currentAvatarColor || defaultGradient } : {}}
                  >
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
                ))}
              </div>
            </div>

            <div className={styles.colorSelectionContainer}>
              <p className={styles.galleryLabel}>
                {currentAvatarImage ? "Choose a border color:" : "Choose a background color:"}
              </p>
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
                    className={`${styles.colorCircle} ${(currentAvatarColor === gradient || (!currentAvatarColor && gradient === defaultGradient)) ? styles.colorCircleActive : ''}`}
                    style={{ background: gradient }}
                    onClick={async () => {
                      try {
                        // Set the background color
                        await SetAvatarColor(userId, gradient);
                        if (onColorChange) onColorChange(gradient);

                        // If there is an image, update the border
                        if (currentAvatarImage) {
                          if (!showBorder) {
                            handleToggleBorder({ target: { checked: true } });
                          }
                        }
                      } catch (err) {
                        console.error('Failed to set avatar color:', err);
                      }
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.modalButtons}>
          <div className={styles.modalButtonRow}>
            <div className={styles.autoSaveNotice}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Changes are auto-saved
            </div>
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
