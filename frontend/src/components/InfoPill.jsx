import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { ClipboardSetText } from "../../wailsjs/runtime/runtime";
import styles from "./InfoPill.module.css";

// Small pill that reveals its value in an instant tooltip on hover or focus,
// and copies the value on click. Without a value it explains why instead.
export default function InfoPill({ icon, label, value, emptyValue, emptyHint }) {
  const [tooltipPos, setTooltipPos] = useState(null);
  const [copied, setCopied] = useState(false);
  const pillRef = useRef(null);
  const hasValue = Boolean(value);

  const showTooltip = () => {
    const rect = pillRef.current?.getBoundingClientRect();
    if (rect) {
      setTooltipPos({ top: Math.round(rect.top), left: Math.round(rect.left) });
    }
  };

  const hideTooltip = () => {
    setTooltipPos(null);
    setCopied(false);
  };

  const handleClick = async (e) => {
    e.stopPropagation();
    if (!hasValue) return;
    try {
      await ClipboardSetText(value);
      setCopied(true);
    } catch (err) {
      console.error("❌ Failed to copy:", err);
    }
  };

  let hint = copied ? "Copied!" : "Click to copy";
  if (!hasValue) hint = emptyHint;

  return (
    <>
      <button
        ref={pillRef}
        type="button"
        className={`${styles.pill} ${hasValue ? "" : styles.unknown}`}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        onClick={handleClick}
        aria-label={hasValue ? `Copy ${label}` : emptyValue}
      >
        {icon}
        <span className={styles.label}>{label}</span>
      </button>

      {tooltipPos && createPortal(
        <div
          className={styles.tooltip}
          style={{ top: `${tooltipPos.top - 6}px`, left: `${tooltipPos.left - 4}px` }}
        >
          <span className={hasValue ? styles.value : styles.emptyValue}>
            {hasValue ? value : emptyValue}
          </span>
          <span className={styles.hint}>{hint}</span>
        </div>,
        document.body
      )}
    </>
  );
}
