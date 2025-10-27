import { useState, useEffect } from 'react';
import styles from './AliasInput.module.css';

export default function AliasInput({ userId, alias, onAliasChange }) {
  // local state so the input DOM node remains stable
  const [localAlias, setLocalAlias] = useState(alias || '');

  // if parent updates (e.g., from sync), keep local in sync
  useEffect(() => {
    setLocalAlias(alias || '');
  }, [alias]);

  const handleChange = (e) => {
    const newAlias = e.target.value;
    setLocalAlias(newAlias);        // update locally → no cursor jump
    onAliasChange(userId, newAlias); // update globally (live save)
  };

  const handleClear = () => {
    setLocalAlias('');
    onAliasChange(userId, '');
  };

  return (
    <div className={styles.inputWrapper}>
      <input
        className={styles.aliasInput}
        value={localAlias}
        placeholder="Enter alias..."
        onChange={handleChange}
        spellCheck="false"
      />
      {localAlias && (
        <button
          className={styles.clearBtn}
          onClick={handleClear}
        >
          ✕
        </button>
      )}
    </div>
  );
}
