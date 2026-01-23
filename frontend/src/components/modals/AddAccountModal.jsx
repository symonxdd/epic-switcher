import { useState, useRef } from 'react'
import styles from './ModalShared.module.css'

export default function AddAccountModal({
  onMoveAside,
  onCancel
}) {
  const [isClosing, setIsClosing] = useState(false);
  const closeCallbackRef = useRef(null);

  const handleAnimationEnd = (e) => {
    // Only trigger when the overlay's own animation ends,
    // not when child animations (modal slideDown) bubble up
    if (e.target !== e.currentTarget) return;

    // After animation completes, call the parent callback to unmount
    if (isClosing && closeCallbackRef.current) {
      closeCallbackRef.current();
    }
  };

  const handleMoveAside = () => {
    // Execute backend action immediately (don't wait for animation)
    onMoveAside();
    // Store the callback to close modal state after animation
    closeCallbackRef.current = () => { }; // No-op, onMoveAside already handles closing
    // Start exit animation
    setIsClosing(true);
  };

  const handleCancel = () => {
    // Store the cancel callback to execute after animation
    closeCallbackRef.current = onCancel;
    // Start exit animation
    setIsClosing(true);
  };

  return (
    <div
      className={`${styles.modalOverlay} ${isClosing ? styles.closing : ''}`}
      onAnimationEnd={handleAnimationEnd}
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3>Prepare to add account</h3>

        <div className={styles.modalNote}>
          <p>This will move the active session aside.</p>
          <p>
            The Epic Games Launcher will <strong>restart</strong>, and you'll be able to log in with a different account.
          </p>
          <p>
            Once you're signed in, come back, go to the Accounts page and click <strong>Add to Switcher</strong>.
          </p>
        </div>

        <div className={styles.modalButtons}>
          <div className={styles.modalButtonRow}>
            <button className={styles.secondaryButton} onClick={handleCancel}>
              Cancel
            </button>
            <button className={styles.primaryButton} onClick={handleMoveAside}>
              Move aside
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
