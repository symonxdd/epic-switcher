import React, { useState, useRef } from 'react';
import styles from "./ModalShared.module.css";
import { Star } from 'lucide-react';
import { BrowserOpenURL } from '../../../wailsjs/runtime';

export default function DismissSupportModal({ onConfirm, onCancel }) {
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

  const handleCoffeeClick = (e) => {
    e.preventDefault();
    try {
      BrowserOpenURL('https://buymeacoffee.com/symonxd');
    } catch (err) {
      console.error('Failed to open link:', err);
    }
  };

  const handleRepoClick = (e) => {
    e.preventDefault();
    try {
      BrowserOpenURL('https://github.com/symonxdd/epic-switcher');
    } catch (err) {
      console.error('Failed to open link:', err);
    }
  };

  return (
    <div
      className={`${styles.modalOverlay} ${isClosing ? styles.closing : ''}`}
      onClick={handleCancel}
      onAnimationEnd={handleAnimationEnd}
    >
      <div className={styles.modal} style={{ maxWidth: '520px' }} onClick={(e) => e.stopPropagation()}>
        <h3>Dismiss support notice?</h3>

        <div className={styles.modalNote} style={{ fontSize: '0.82rem' }}>
          <p>Thank you for using Epic Switcher. If you find the support notice distracting, you're free to hide it at any time.</p>
          <p>
            Simply starring the{" "}
            <span
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] underline cursor-pointer font-medium transition-colors duration-200"
              onClick={handleRepoClick}
            >
              repository on GitHub
            </span>{" "}
            is already a huge help and means a lot to me.
          </p>
          <p>
            Alternatively, while absolutely not expected, if you're feeling generous, any small amount via{" "}
            <span
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] underline cursor-pointer font-medium transition-colors duration-200"
              onClick={handleCoffeeClick}
            >
              Buy Me a Coffee
            </span>{" "}
            is always welcome and helps sustain development.
          </p>
        </div>

        <div className={styles.modalButtons}>
          <div className={styles.modalButtonRow}>
            <button className={styles.secondaryButton} onClick={handleCancel}>
              <span>Cancel</span>
            </button>
            <button className={styles.primaryButton} onClick={handleConfirm}>
              <span>Dismiss support notice</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
