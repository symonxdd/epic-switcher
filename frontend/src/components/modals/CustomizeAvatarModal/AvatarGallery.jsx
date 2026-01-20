import { useState, useEffect } from 'react';
import { GetAvailableAvatars, RemoveAvatar } from '../../../../wailsjs/go/services/AvatarService';
import { HiOutlinePlus } from 'react-icons/hi';
import styles from '../ModalShared.module.css';
import AvatarGalleryItem from './AvatarGalleryItem';
import { DEFAULT_GRADIENT, getBaseFilename, getFirstVisibleChar } from './avatarUtils';

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

  useEffect(() => {
    GetAvailableAvatars()
      .then((avatars) => setAvailableAvatars(avatars || []))
      .catch(console.error);
  }, [currentImage]);

  useEffect(() => {
    GetAvailableAvatars()
      .then((avatars) => setAvailableAvatars(avatars || []))
      .catch(console.error);
  }, [cacheBust]);

  const handleSelectAvatar = async (filename) => {
    if (filename === currentAvatarBase) return;
    if (onSelectAvatar) onSelectAvatar(filename);
  };

  const handleUseInitials = async () => {
    if (!hasImage) return;
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
