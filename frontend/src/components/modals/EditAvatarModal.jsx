import { useState, useRef, useEffect } from 'react'
import { GetAvailableAvatars, SetAvatar, DeleteAvatarFile, SetAvatarColor, RemoveAvatar, SelectImage, ReadImageAsBase64, SaveAvatarWithCrop } from '../../../wailsjs/go/services/AvatarService'
import { HiOutlineCheckCircle, HiPencil, HiOutlinePlus, HiTrash, HiOutlinePhotograph, HiScissors } from 'react-icons/hi';
import { HiArrowsExpand } from 'react-icons/hi';
import styles from './ModalShared.module.css'
import { STORAGE_KEYS } from '../../constants/storageKeys'
import ImageLightbox from './ImageLightbox'
import CropAvatarModal from './CropAvatarModal'

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
  const [showLightbox, setShowLightbox] = useState(false); // for viewing full-res image
  const [showCropModal, setShowCropModal] = useState(false);
  const [cropImage, setCropImage] = useState(null); // Base64 or URL
  const [cropSourcePath, setCropSourcePath] = useState(null); // Original path or filename
  const [cacheBust, setCacheBust] = useState(0); // Increment to force thumbnail reload
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

  // Helper to extract filename without query string for proper comparison
  const getBaseFilename = (filenameWithQuery) => {
    if (!filenameWithQuery) return filenameWithQuery;
    return filenameWithQuery.split('?')[0];
  };

  // Get the base filename for comparison operations
  const currentAvatarBase = getBaseFilename(currentAvatarImage);

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
    try {
      const path = await SelectImage();
      if (!path) return; // User cancelled

      // Read as base64 for preview in cropper
      // We need to read it because the browser can't access local file paths directly
      const base64 = await ReadImageAsBase64(path);

      setCropImage(base64);
      setCropSourcePath(path);
      setShowCropModal(true);
    } catch (err) {
      console.error("Failed to select image:", err);
    }
  };

  const handleRecrop = (e, filename) => {
    e.stopPropagation();
    // For existing avatars, we can use the server URL with cache busting
    setCropImage(`/avatar-full/${filename}${cacheBust ? `?v=${cacheBust}` : ''}`);
    setCropSourcePath(filename);
    setShowCropModal(true);
  };

  const handleCropConfirm = async (pixelCrop) => {
    if (!cropSourcePath || !userId) return;

    try {
      // pixelCrop contains x, y, width, height
      /* 
         NOTE: cropSourcePath can be:
         1. A full absolute path (new upload)
         2. A filename (re-crop existing)
         The backend handles both distinctions.
      */
      const newFilename = await SaveAvatarWithCrop(
        userId,
        cropSourcePath,
        Math.round(pixelCrop.x),
        Math.round(pixelCrop.y),
        Math.round(pixelCrop.width),
        Math.round(pixelCrop.height)
      );

      // Force thumbnails to reload by incrementing cache bust counter
      setCacheBust(prev => prev + 1);

      // Refresh avatars list
      await refreshAvatars();

      // Update the parent with the filename + timestamp for cache busting
      // The timestamp will persist in session state and propagate to Accounts page
      if (onAvatarChange) {
        const filenameWithCacheBust = `${newFilename}?t=${Date.now()}`;
        onAvatarChange(filenameWithCacheBust);
      }

      setShowCropModal(false);
      setCropImage(null);
      setCropSourcePath(null);
    } catch (err) {
      console.error("Failed to save cropped avatar:", err);
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

    // Compare using base filename (without query string)
    if (filename === currentAvatarBase) {
      console.log('Avatar already selected, doing nothing.');
      return;
    }

    try {
      console.log('Setting avatar for user:', userId, 'to file:', filename);
      await SetAvatar(userId, filename);
      if (onAvatarChange) {
        // Add timestamp to bust cache for the new selection
        onAvatarChange(`${filename}?t=${Date.now()}`);
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
      // Compare using base filename (without query string)
      if (confirmDelete === currentAvatarBase) {
        await RemoveAvatar(userId);
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
      <div className={`${styles.modal} ${styles.modalWide}`} onClick={(e) => e.stopPropagation()}>
        <h3>Customize Avatar</h3>

        <div className={styles.modalTwoColumn}>
          <div className={styles.modalLeftColumn}>
            {/* Top spacer to balance the toggle at the bottom and keep avatar centered */}
            {currentAvatarImage && currentAvatarImage !== "" && (
              <div className={styles.showBorderToggleSpacer} aria-hidden="true">
                <label className={styles.toggleLabel}>placeholder</label>
                <div className={styles.switchPlaceholder}></div>
              </div>
            )}

            <div className={styles.avatarPreviewContainer}>
              <div
                className={`${styles.currentAvatar} ${(!showBorder || !currentAvatarImage || currentAvatarImage === "") ? styles.currentAvatarNoBorder : ''} ${(currentAvatarImage && currentAvatarImage !== "") ? styles.clickableAvatar : ''}`}
                style={{ background: currentAvatarColor || defaultGradient }}
                onClick={() => {
                  if (currentAvatarImage && currentAvatarImage !== "") {
                    setShowLightbox(true);
                  }
                }}
              >
                {(currentAvatarImage && currentAvatarImage !== "") ? (
                  <>
                    <img
                      src={`/avatar-thumb/${currentAvatarImage}${!currentAvatarImage.includes('?') && cacheBust ? `?v=${cacheBust}` : ''}`}
                      alt="Current Avatar"
                      style={{ margin: 0 }}
                    />
                    <div className={styles.avatarOverlay}>
                      <HiArrowsExpand />
                    </div>
                  </>
                ) : (
                  <span className={styles.initialsText}>{getFirstVisibleChar(username)}</span>
                )}
              </div>
              <span className={styles.previewLabel}>Current</span>
            </div>

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

          <div className={styles.modalVerticalDivider} />

          <div className={styles.modalRightColumn}>


            <div className={styles.avatarGalleryContainer}>
              <div className={styles.galleryHeader}>
                <p className={styles.galleryLabel}>Choose an avatar:</p>
                <button
                  className={styles.uploadAvatarBtnMini}
                  onClick={handleSelect}
                  title="Select new image"
                >
                  <HiOutlinePlus />
                  <span>Add Image</span>
                </button>
              </div>
              <div className={styles.avatarGallery}>
                {availableAvatars.map((avatar) => (
                  <div
                    key={avatar}
                    className={`${styles.avatarWrapper} ${currentAvatarBase === avatar ? styles.avatarWrapperActive : ''}`}
                    style={currentAvatarBase === avatar ? { '--avatar-accent': currentAvatarColor || defaultGradient } : {}}
                  >
                    <img
                      src={`/avatar-thumb/${avatar}${cacheBust ? `?v=${cacheBust}` : ''}`}
                      alt={avatar}
                      className={`${styles.avatarMiniature} ${currentAvatarBase === avatar ? styles.avatarMiniatureActive : ''}`}
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
                    <button
                      className={styles.cropAvatarBtn}
                      onClick={(e) => handleRecrop(e, avatar)}
                      title="Adjust crop"
                    >
                      <HiScissors />
                    </button>
                  </div>
                ))}
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
                    style={{ backgroundImage: gradient }}
                    onClick={() => {
                      const isActive = currentAvatarColor === gradient || (!currentAvatarColor && gradient === defaultGradient);
                      if (isActive) return;

                      // 1. Optimistically update UI first
                      if (onColorChange) onColorChange(gradient);

                      // If there is an image, update the border toggle optmistically
                      if (currentAvatarImage && !showBorder) {
                        handleToggleBorder({ target: { checked: true } });
                      }

                      // 2. Call service in background to avoid blocking UI thread/animations
                      SetAvatarColor(userId, gradient).catch((err) => {
                        console.error('Failed to set avatar color:', err);
                        // Optionally revert UI if needed, but usually not necessary for color
                      });
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

      {/* Full-resolution image lightbox */}
      {showLightbox && currentAvatarImage && (
        <ImageLightbox
          src={`/avatar-full/${currentAvatarImage}${!currentAvatarImage.includes('?') && cacheBust ? `?v=${cacheBust}` : ''}`}
          alt="Full resolution avatar"
          onClose={() => setShowLightbox(false)}
        />
      )}

      {showCropModal && cropImage && (
        <CropAvatarModal
          image={cropImage}
          onCropComplete={handleCropConfirm}
          onCancel={() => {
            setShowCropModal(false);
            setCropImage(null);
            setCropSourcePath(null);
          }}
        />
      )}
    </div>
  )
}
