import { useState, useRef } from 'react';
import { SetAvatar, DeleteAvatarFile, RemoveAvatar, SelectImage, SaveAvatarWithCrop } from '../../../../wailsjs/go/services/AvatarService';
import styles from '../ModalShared.module.css';
import ImageLightbox from '../ImageLightbox';
import CropAvatarModal from '../CropAvatarModal';

import AvatarPreview from './AvatarPreview';
import AvatarGallery from './AvatarGallery';
import ColorPicker from './ColorPicker';
import DeleteConfirmDialog from './DeleteConfirmDialog';
import { getBaseFilename, getFullUrl } from './avatarUtils';
import { useAvatarCache } from '../../../context/AvatarCacheContext';

export default function CustomizeAvatarModal({
  onSelect,
  onCancel,
  username,
  userId,
  currentAvatarImage,
  currentAvatarColor,
  onAvatarChange,
  onColorChange,
  onRemove,
  isLocked
}) {
  const [isClosing, setIsClosing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [showLightbox, setShowLightbox] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [cropImage, setCropImage] = useState(null);
  const [cropSourcePath, setCropSourcePath] = useState(null);
  const closeCallbackRef = useRef(null);
  const { cacheVersion, invalidateCache } = useAvatarCache();

  const currentAvatarBase = getBaseFilename(currentAvatarImage);
  const hasImage = currentAvatarImage && currentAvatarImage !== "";

  const handleAnimationEnd = (e) => {
    if (e.target !== e.currentTarget) return;
    if (isClosing && closeCallbackRef.current) {
      closeCallbackRef.current();
    }
  };

  const handleCancel = () => {
    closeCallbackRef.current = onCancel;
    setIsClosing(true);
  };

  const handleAddImage = async () => {
    try {
      const path = await SelectImage();
      if (!path) return;

      // Use HTTP streaming instead of base64 for instant loading
      const encodedPath = btoa(path);
      setCropImage(`/local-file/${encodedPath}`);
      setCropSourcePath(path);
      setShowCropModal(true);
    } catch (err) {
      console.error("Failed to select image:", err);
    }
  };

  const handleRecrop = (filename) => {
    setCropImage(getFullUrl(filename, cacheVersion));
    setCropSourcePath(filename);
    setShowCropModal(true);
  };

  const handleCropConfirm = async (pixelCrop) => {
    if (!cropSourcePath || !userId) return;

    try {
      const newFilename = await SaveAvatarWithCrop(
        userId,
        cropSourcePath,
        Math.round(pixelCrop.x),
        Math.round(pixelCrop.y),
        Math.round(pixelCrop.width),
        Math.round(pixelCrop.height)
      );

      invalidateCache();

      if (onAvatarChange) {
        onAvatarChange(newFilename);  // Clean filename, no query params
      }

      setShowCropModal(false);
      setCropImage(null);
      setCropSourcePath(null);
    } catch (err) {
      console.error("Failed to save cropped avatar:", err);
    }
  };

  const handleSelectAvatar = async (filename) => {
    if (!userId || !filename || filename === currentAvatarBase) return;

    try {
      await SetAvatar(userId, filename);
      if (onAvatarChange) {
        onAvatarChange(filename);  // Clean filename, no query params
      }
    } catch (err) {
      console.error('Failed to set avatar:', err);
    }
  };

  const handleRemoveAvatar = () => {
    if (onAvatarChange) onAvatarChange("");
    if (onRemove) onRemove();
  };

  const handleDeleteRequest = (filename) => {
    setConfirmDelete(filename);
  };

  const handleDeleteConfirm = async () => {
    if (!confirmDelete) return;

    try {
      await DeleteAvatarFile(confirmDelete);

      if (confirmDelete === currentAvatarBase) {
        await RemoveAvatar(userId);
        if (onAvatarChange) onAvatarChange("");
      }

      invalidateCache();
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
      <div className={`${styles.modal} ${styles.modalWide}`} onClick={(e) => e.stopPropagation()}>
        <h3>Customize your avatar</h3>

        <div className={styles.modalTwoColumn}>
          <AvatarPreview
            currentImage={currentAvatarImage}
            currentColor={currentAvatarColor}
            username={username}
            onViewFullImage={() => setShowLightbox(true)}
          />

          <div className={styles.modalVerticalDivider} />

          <div className={styles.modalRightColumn}>
            <AvatarGallery
              userId={userId}
              username={username}
              currentImage={currentAvatarImage}
              currentColor={currentAvatarColor}
              onSelectAvatar={handleSelectAvatar}
              onRemoveAvatar={handleRemoveAvatar}
              onRecrop={handleRecrop}
              onDeleteRequest={handleDeleteRequest}
              onAddImage={handleAddImage}
            />

            <ColorPicker
              userId={userId}
              currentColor={currentAvatarColor}
              hasImage={hasImage}
              onColorChange={onColorChange}
            />
          </div>
        </div>

        {isLocked && (
          <div className={styles.lockedOverlay} onClick={handleCancel}>
            <div className={styles.lockedHint}>
              Please add the account first with the "Add to Switcher" button to customize it's avatar.
            </div>
          </div>
        )}

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

        <DeleteConfirmDialog
          filename={confirmDelete}
          onCancel={() => setConfirmDelete(null)}
          onConfirm={handleDeleteConfirm}
        />
      </div>

      {showLightbox && hasImage && (
        <ImageLightbox
          src={getFullUrl(currentAvatarImage, cacheVersion)}
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
  );
}
