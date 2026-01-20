import { HiScissors } from 'react-icons/hi';
import styles from '../ModalShared.module.css';
import { getThumbnailUrl, DEFAULT_GRADIENT } from './avatarUtils';

/**
 * Single avatar thumbnail in the gallery with hover actions (recrop, delete).
 */
export default function AvatarGalleryItem({
  filename,
  isActive,
  accentColor,
  cacheBust,
  onSelect,
  onRecrop,
  onDelete
}) {
  const gradient = accentColor || DEFAULT_GRADIENT;

  return (
    <div
      className={`${styles.avatarWrapper} ${isActive ? styles.avatarWrapperActive : ''}`}
      style={isActive ? { '--avatar-accent': gradient } : {}}
    >
      <img
        src={getThumbnailUrl(filename, cacheBust)}
        alt={filename}
        className={`${styles.avatarMiniature} ${isActive ? styles.avatarMiniatureActive : ''}`}
        onClick={() => onSelect(filename)}
      />
      <button
        className={styles.deleteAvatarBtn}
        onClick={(e) => {
          e.stopPropagation();
          onDelete(filename);
        }}
        title="Delete this image"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      <button
        className={styles.cropAvatarBtn}
        onClick={(e) => {
          e.stopPropagation();
          onRecrop(filename);
        }}
        title="Adjust crop"
      >
        <HiScissors />
      </button>
    </div>
  );
}
