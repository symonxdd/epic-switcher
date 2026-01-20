import { useState } from 'react';
import { HiArrowsExpand } from 'react-icons/hi';
import styles from '../ModalShared.module.css';
import {
  DEFAULT_GRADIENT,
  getThumbnailUrl,
  getFirstVisibleChar,
  getBorderPreference,
  saveBorderPreference
} from './avatarUtils';

export default function AvatarPreview({
  currentImage,
  currentColor,
  username,
  cacheBust,
  onViewFullImage
}) {
  const [showBorder, setShowBorder] = useState(getBorderPreference);

  const hasImage = currentImage && currentImage !== "";
  const gradient = currentColor || DEFAULT_GRADIENT;

  const handleToggleBorder = (e) => {
    const newVal = e.target.checked;
    setShowBorder(newVal);
    saveBorderPreference(newVal);
  };

  return (
    <div className={styles.modalLeftColumn}>
      {hasImage && (
        <div className={styles.showBorderToggleSpacer} aria-hidden="true">
          <label className={styles.toggleLabel}>placeholder</label>
          <div className={styles.switchPlaceholder}></div>
        </div>
      )}

      <div className={styles.avatarPreviewContainer}>
        <div
          className={`${styles.currentAvatar} ${(!showBorder || !hasImage) ? styles.currentAvatarNoBorder : ''} ${hasImage ? styles.clickableAvatar : ''}`}
          style={{ background: gradient }}
          onClick={() => {
            if (hasImage && onViewFullImage) {
              onViewFullImage();
            }
          }}
        >
          {hasImage ? (
            <>
              <img
                src={getThumbnailUrl(currentImage, cacheBust)}
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

      {hasImage && (
        <div className={styles.showBorderToggle} style={{ '--avatar-accent': gradient }}>
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
  );
}
