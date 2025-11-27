import { useState, useRef } from 'react'
import styles from './ModalShared.module.css'

export default function AddAccountModal({
  onMoveAside,
  onCancel
}) {
  const [isClosing, setIsClosing] = useState(false);
  const pendingActionRef = useRef(null);

  const handleAnimationEnd = () => {
    if (isClosing && pendingActionRef.current) {
      pendingActionRef.current();
    }
  };

  const handleMoveAside = () => {
    pendingActionRef.current = onMoveAside;
    setIsClosing(true);
  };

  const handleCancel = () => {
    pendingActionRef.current = onCancel;
    setIsClosing(true);
  };

  return (
    <div
      className={`${styles.modalOverlay} ${isClosing ? styles.closing : ''}`}
      onAnimationEnd={handleAnimationEnd}
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3>Prepare to Add Account</h3>

        <div className={styles.modalNote}>
          <p>This will move the active session aside.</p>
          <p>
            The Epic Games Launcher will <strong>restart</strong> so you can log in with a different account.
          </p>
          <p>
            Once you've signed in, return to this app.
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
