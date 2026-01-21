import { useState, useRef, useEffect } from 'react';
import { HiOutlineLightBulb, HiOutlineX } from 'react-icons/hi';
import styles from './ModalShared.module.css';

import localStyles from './EditAliasModal.module.css';

export default function EditAliasModal({
  userId,
  currentAlias,
  onAliasChange,
  onClose
}) {
  const [isClosing, setIsClosing] = useState(false);
  const closeCallbackRef = useRef(null);
  const inputRef = useRef(null);

  const handleAnimationEnd = (e) => {
    if (e.target !== e.currentTarget) return;
    if (isClosing && closeCallbackRef.current) {
      closeCallbackRef.current();
    }
  };

  const handleClose = () => {
    closeCallbackRef.current = onClose;
    setIsClosing(true);
  };

  const handleChange = (e) => {
    onAliasChange(userId, e.target.value);
  };

  const handleClear = () => {
    onAliasChange(userId, "");
    inputRef.current?.focus();
  };

  return (
    <div
      className={`${styles.modalOverlay} ${isClosing ? styles.closing : ''}`}
      onAnimationEnd={handleAnimationEnd}
      onClick={handleClose}
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3>Edit Alias</h3>

        <div className={localStyles.bodyContent}>
          <div className={localStyles.infoBlock}>
            <div className={localStyles.iconWrapper}>
              <HiOutlineLightBulb />
            </div>
            <p className={localStyles.infoText}>
              Aliases are strictly local to this app. They allow you to add a custom nickname to any account, making it easier to distinguish between them at a glance.
            </p>
          </div>

          <div className={localStyles.inputContainer}>
            <input
              ref={inputRef}
              className={localStyles.input}
              value={currentAlias || ""}
              placeholder="Enter custom alias..."
              onChange={handleChange}
              autoFocus
            />
            {currentAlias && (
              <button className={localStyles.clearButton} onClick={handleClear} title="Clear alias">
                <HiOutlineX />
              </button>
            )}
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
            <button className={styles.secondaryButton} onClick={handleClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
