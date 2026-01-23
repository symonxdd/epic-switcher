import { useState } from 'react';
import { HiArrowsExpand } from 'react-icons/hi';
import styles from '../ModalShared.module.css';
import {
  DEFAULT_GRADIENT,
  getThumbnailUrl,
  getFirstVisibleChar,
  getBorderPreference,
  saveBorderPreference,
  getBorderThickness,
  saveBorderThickness
} from './avatarUtils';
import { useAvatarCache } from '../../../context/AvatarCacheContext';

export default function AvatarPreview({
  currentImage,
  currentColor,
  username,
  onViewFullImage
}) {
  const [showBorder, setShowBorder] = useState(getBorderPreference);
  const [borderThickness, setBorderThickness] = useState(getBorderThickness);
  const { cacheVersion } = useAvatarCache();

  const hasImage = currentImage && currentImage !== "";
  const gradient = currentColor || DEFAULT_GRADIENT;

  const handleToggleBorder = (e) => {
    const newVal = e.target.checked;
    setShowBorder(newVal);
    saveBorderPreference(newVal);
  };

  const handleThicknessChange = (e) => {
    const newVal = parseInt(e.target.value, 10);
    setBorderThickness(newVal);
    saveBorderThickness(newVal);
  };

  return (
    <div className={styles.modalLeftColumn}>
      <div className={styles.avatarPreviewContainer}>
        <div
          className={`${styles.currentAvatar} ${(!showBorder || !hasImage) ? styles.currentAvatarNoBorder : ''} ${hasImage ? styles.clickableAvatar : ''}`}
          style={{
            background: gradient,
            padding: showBorder && hasImage ? `${borderThickness}px` : undefined
          }}
          onClick={() => {
            if (hasImage && onViewFullImage) {
              onViewFullImage();
            }
          }}
        >
          {hasImage ? (
            <>
              <img
                src={getThumbnailUrl(currentImage, cacheVersion)}
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
        <>
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

          <div className={styles.thicknessSliderContainer} style={{ '--avatar-accent': gradient }}>
            <div className={styles.thicknessSliderHeader}>
              <label htmlFor="thicknessSlider" className={styles.toggleLabel}>Border thickness</label>
              <span className={styles.thicknessValue}>{borderThickness}px</span>
            </div>
            <input
              id="thicknessSlider"
              type="range"
              min="1"
              max="8"
              value={borderThickness}
              onChange={handleThicknessChange}
              className={styles.thicknessSlider}
              disabled={!showBorder}
            />
          </div>
        </>
      )}
    </div>
  );
}
