import { useState, useRef } from 'react';
import styles from "../modals/ModalShared.module.css";

export default function DeleteSessionModal({ session, onConfirm, onCancel }) {
  const [isClosing, setIsClosing] = useState(false);
  const pendingActionRef = useRef(null);

  if (!session) return null;

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
        <h3>Delete saved session</h3>

        <div className={styles.modalNote}>
          <p>Are you sure you want to <strong>delete</strong> this saved session?</p>
          <p>This will <strong>not log you out</strong>, but only remove the session from the saved sessions this app manages.</p>
        </div>

        {session.username && (
          <div className={styles.modalUsername}>
            Username: {session.username}
          </div>
        )}
        <div className={styles.modalUserId}>
          User ID: {session.userId}
        </div>

        <div className={styles.modalButtons}>
          <div className={styles.modalButtonRow}>
            <button className={styles.secondaryButton} onClick={handleCancel}>
              <span>Cancel</span>
            </button>
            <button className={styles.primaryButton} onClick={handleConfirm}>
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
