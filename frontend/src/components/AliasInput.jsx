import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { HiOutlineLightBulb } from "react-icons/hi";
import styles from "./AliasInput.module.css";

export default function AliasInput({ userId, alias = "", onAliasChange, autoFocus }) {
  const [localAlias, setLocalAlias] = useState(alias);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
  const iconRef = useRef(null);
  const inputRef = useRef(null);

  // Keep localAlias in sync with prop
  useEffect(() => {
    setLocalAlias(alias);
  }, [alias]);

  // Autofocus input when prop changes
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select(); // optional: select text for easy editing
    }
  }, [autoFocus]);

  const handleChange = (e) => {
    const newAlias = e.target.value;
    setLocalAlias(newAlias);
    onAliasChange(userId, newAlias);
  };

  const handleClear = () => {
    setLocalAlias("");
    onAliasChange(userId, "");
  };

  const handleMouseEnter = () => {
    if (iconRef.current) {
      const rect = iconRef.current.getBoundingClientRect();
      setTooltipPos({
        top: rect.top + window.scrollY + rect.height / 2,
        left: rect.left + window.scrollX - 10,
      });
      setShowTooltip(true);
    }
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  return (
    <div className={styles.inputWrapper}>
      {/* Lightbulb on the left */}
      <div
        className={styles.infoTooltipWrapper}
        ref={iconRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <HiOutlineLightBulb className={styles.infoIcon} />
      </div>

      <input
        ref={inputRef}
        className={styles.aliasInput}
        value={localAlias}
        placeholder="Enter alias..."
        onChange={handleChange}
        spellCheck="false"
      />

      {localAlias && (
        <button className={styles.clearBtn} onClick={handleClear}>
          ✕
        </button>
      )}

      {/* Tooltip via React Portal */}
      {showTooltip &&
        createPortal(
          <div
            className={styles.tooltip}
            style={{
              position: "absolute",
              top: tooltipPos.top,
              left: tooltipPos.left,
              transform: "translate(-100%, -50%)", // left of bulb, vertically centered
            }}
          >
            Aliases are only used within this app
            <br />
            Changes are auto-saved 😌
          </div>,
          document.body
        )}
    </div>
  );
}
