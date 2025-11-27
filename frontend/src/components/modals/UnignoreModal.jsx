import { useState, useRef } from 'react';
import styles from "./ModalShared.module.css";

export default function UnignoreModal({ userId, onConfirm, onCancel }) {
  const [isClosing, setIsClosing] = useState(false);
  const pendingActionRef = useRef(null);

  const handleAnimationEnd = () => {
    if (isClosing && pendingActionRef.current) {
      pendingActionRef.current();
    }
  };

  const handleConfirm = () => {
    pendingActionRef.current = onConfirm;
    setIsClosing(true);
  };

  const handleCancel = () => {
    pendingActionRef.current = onCancel;
    setIsClosing(true);
  };

  return (
    <div
      className={`${styles.modalOverlay} ${isClosing ? styles.closing : ''}`}
      onClick={handleCancel}
      onAnimationEnd={handleAnimationEnd}
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3>Revert Ignored Account</h3>

        <div className={styles.modalNote}>
          <p>Are you sure you want to <strong>un-ignore</strong> this account?</p>
          <p>The <strong>Accounts page</strong> will start notifying you about this account again.</p>
        </div>

        <div className={styles.modalUserId}>User ID: {userId}</div>

        <div className={styles.modalButtons}>
          <div className={styles.modalButtonRow}>
            <button className={styles.primaryButton} onClick={handleConfirm}>
              Un-ignore
            </button>
            <button className={styles.secondaryButton} onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
