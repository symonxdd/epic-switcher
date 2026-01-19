import { useEffect } from 'react';
import styles from './ModalShared.module.css';

export default function ImageLightbox({ src, alt, onClose }) {
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

  return (
    <div className={styles.lightboxOverlay} onClick={onClose}>
      <img
        src={src}
        alt={alt}
        decoding="async"
        className={styles.lightboxImage}
        onClick={(e) => e.stopPropagation()}
      />
      <button className={styles.lightboxClose} onClick={onClose} title="Close">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  );
}
