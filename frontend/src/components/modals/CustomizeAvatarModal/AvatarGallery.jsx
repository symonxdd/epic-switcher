import { useState, useEffect } from 'react';
import { GetAvailableAvatars, RemoveAvatar } from '../../../../wailsjs/go/services/AvatarService';
import { HiOutlinePlus } from 'react-icons/hi';
import styles from '../ModalShared.module.css';
import AvatarGalleryItem from './AvatarGalleryItem';
import { DEFAULT_GRADIENT, getBaseFilename, getFirstVisibleChar } from './avatarUtils';

/**
 * Avatar gallery grid with add button and "use initials" option.
 * Self-contained: owns the list of available avatars and fetches them.
 */
export default function AvatarGallery({
  userId,
  username,
  currentImage,
  currentColor,
  cacheBust,
  onSelectAvatar,
  onRemoveAvatar,
  onRecrop,
  onDeleteRequest,
  onAddImage
}) {
  const [availableAvatars, setAvailableAvatars] = useState([]);

  const currentAvatarBase = getBaseFilename(currentImage);
  const gradient = currentColor || DEFAULT_GRADIENT;
  const hasImage = currentImage && currentImage !== "";

  // Fetch available avatars on mount and when currentImage changes
  useEffect(() => {
    GetAvailableAvatars()
      .then((avatars) => setAvailableAvatars(avatars || []))
      .catch(console.error);
  }, [currentImage]);

  // Also expose a way for parent to trigger refresh after crop
  useEffect(() => {
    // Re-fetch when cacheBust changes (after crop operation)
    GetAvailableAvatars()
      .then((avatars) => setAvailableAvatars(avatars || []))
      .catch(console.error);
  }, [cacheBust]);

  const handleSelectAvatar = async (filename) => {
    if (filename === currentAvatarBase) {
      // Already selected, do nothing
      return;
    }
    if (onSelectAvatar) {
      onSelectAvatar(filename);
    }
  };

  const handleUseInitials = async () => {
    if (!hasImage) return; // Already using initials

    try {
      await RemoveAvatar(userId);
      if (onRemoveAvatar) onRemoveAvatar();
    } catch (err) {
      console.error('Failed to remove avatar image:', err);
    }
  };

  return (
    <div className={styles.avatarGalleryContainer}>
      <div className={styles.galleryHeader}>
        <p className={styles.galleryLabel}>Choose an avatar:</p>
        <button
          className={styles.uploadAvatarBtnMini}
          onClick={onAddImage}
          title="Select new image"
        >
          <HiOutlinePlus />
          <span>Add Image</span>
        </button>
      </div>

      <div className={styles.avatarGallery}>
        {availableAvatars.map((avatar) => (
          <AvatarGalleryItem
            key={avatar}
            filename={avatar}
            isActive={currentAvatarBase === avatar}
            accentColor={gradient}
            cacheBust={cacheBust}
            onSelect={handleSelectAvatar}
            onRecrop={onRecrop}
            onDelete={onDeleteRequest}
          />
        ))}

        {/* "Use Initials" option */}
        <div
          className={`${styles.avatarWrapper} ${!hasImage ? styles.avatarWrapperActive : ''}`}
          style={{ '--avatar-accent': gradient }}
        >
          <div
            className={`${styles.avatarMiniature} ${styles.noneAvatar} ${!hasImage ? styles.avatarMiniatureActive : ''}`}
            onClick={handleUseInitials}
            style={{ background: gradient }}
            title="Use initials (no image)"
          >
            <span className={styles.initialsText}>{getFirstVisibleChar(username)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
