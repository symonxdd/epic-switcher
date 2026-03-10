import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { HiX, HiClipboardCopy } from 'react-icons/hi';
import styles from './DiagnosticsModal.module.css';
import { GetDiagnostics } from '../../../../wailsjs/go/services/DiagnosticService';

export default function DiagnosticsModal({ onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        if (GetDiagnostics) {
          const result = await GetDiagnostics();
          setData(result);
        } else {
          setData({ error: "DiagnosticService not available in Wails context." });
        }
      } catch (err) {
        setData({ error: err.toString() });
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleCopy = () => {
    if (data) {
      navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      toast.success("Diagnostics copied to clipboard!");
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>System Diagnostics</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <HiX />
          </button>
        </div>

        <div className={styles.modalBody}>
          {loading ? (
            <p>Loading diagnostics...</p>
          ) : (
            <pre className={styles.jsonOutput}>
              {JSON.stringify(data, null, 2)}
            </pre>
          )}
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.copyBtn} onClick={handleCopy} disabled={!data || loading}>
            <HiClipboardCopy /> Copy to Clipboard
          </button>
        </div>
      </div>
    </div>
  );
}
