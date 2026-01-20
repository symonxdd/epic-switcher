import { SetAvatarColor } from '../../../../wailsjs/go/services/AvatarService';
import styles from '../ModalShared.module.css';
import { AVATAR_GRADIENTS, DEFAULT_GRADIENT } from './avatarUtils';

/**
 * Color gradient picker grid.
 * Self-contained: handles its own click logic and backend calls.
 */
export default function ColorPicker({
  userId,
  currentColor,
  hasImage,
  onColorChange
}) {
  const handleColorClick = (gradient) => {
    const isActive = currentColor === gradient || (!currentColor && gradient === DEFAULT_GRADIENT);
    if (isActive) return;

    // 1. Optimistically update UI first
    if (onColorChange) onColorChange(gradient);

    // 2. Call service in background to avoid blocking UI thread/animations
    SetAvatarColor(userId, gradient).catch((err) => {
      console.error('Failed to set avatar color:', err);
      // Could revert UI here if needed
    });
  };

  return (
    <div className={styles.colorSelectionContainer}>
      <p className={styles.galleryLabel}>
        {hasImage ? "Choose a border color:" : "Choose a background color:"}
      </p>
      <div className={styles.colorGrid}>
        {AVATAR_GRADIENTS.map((gradient) => (
          <div
            key={gradient}
            className={`${styles.colorCircle} ${(currentColor === gradient || (!currentColor && gradient === DEFAULT_GRADIENT)) ? styles.colorCircleActive : ''}`}
            style={{ backgroundImage: gradient }}
            onClick={() => handleColorClick(gradient)}
          />
        ))}
      </div>
    </div>
  );
}
