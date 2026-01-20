import { useEffect, useState } from 'react';
import { GetImageMetadata } from '../../../wailsjs/go/services/AvatarService';
import styles from './ModalShared.module.css';

export default function ImageLightbox({ src, alt, onClose }) {
  const [metadata, setMetadata] = useState(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Fetch metadata
  useEffect(() => {
    if (!src) return;

    // Extract filename from /avatar-full/filename, removing any query string
    const filenameWithQuery = src.split('/').pop();
    const filename = filenameWithQuery?.split('?')[0];
    if (filename) {
      GetImageMetadata(filename)
        .then(setMetadata)
        .catch(console.error);
    }
  }, [src]);

  return (
    <div className={styles.lightboxOverlay} onClick={onClose}>
      <img
        src={src}
        alt={alt}
        decoding="async"
        className={styles.lightboxImage}
        onClick={(e) => e.stopPropagation()}
      />

      {metadata && (
        <div className={styles.lightboxMetadata} onClick={(e) => e.stopPropagation()}>
          <div className={styles.metadataItem}>
            <span className={styles.metadataLabel}>Dimensions</span>
            <span className={styles.metadataValue}>{metadata.width} × {metadata.height}</span>
          </div>
          <div className={styles.metadataItem}>
            <span className={styles.metadataLabel}>Size</span>
            <span className={styles.metadataValue}>{metadata.formatSize}</span>
          </div>
          <div className={styles.metadataItem}>
            <span className={styles.metadataLabel}>Format</span>
            <span className={styles.metadataValue}>{metadata.format?.toUpperCase()}</span>
          </div>
        </div>
      )}

      <button className={styles.lightboxClose} onClick={onClose} title="Close">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  );
}
