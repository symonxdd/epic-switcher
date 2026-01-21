import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { HiOutlineX } from 'react-icons/hi';
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

  return createPortal(
    <div
      className={`${styles.modalOverlay} ${isClosing ? styles.closing : ''}`}
      onAnimationEnd={handleAnimationEnd}
      onClick={handleClose}
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3>Edit nickname</h3>

        <div className={localStyles.bodyContent}>
          <div className={localStyles.infoBlock}>
            <p className={localStyles.infoText}>
              Nicknames allow you to change the display name of your account.
              They are strictly local to this app.
            </p>
          </div>

          <div className={localStyles.inputContainer}>
            <input
              ref={inputRef}
              className={localStyles.input}
              value={currentAlias || ""}
              placeholder="Enter nickname..."
              onChange={handleChange}
              autoFocus
            />
            {currentAlias && (
              <button className={localStyles.clearButton} onClick={handleClear} title="Clear nickname">
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
    </div>,
    document.body
  );
}
