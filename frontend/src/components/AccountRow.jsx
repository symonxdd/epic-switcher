import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineCheckCircle,
  HiOutlinePencil,
  HiOutlineTrash,
} from "react-icons/hi";
import styles from "./AccountRow.module.css";
import EditAliasModal from "./modals/EditAliasModal";
import { useAvatarCache } from "../context/AvatarCacheContext";
import { getBorderPreference } from "./modals/CustomizeAvatarModal/avatarUtils";
import { useEffect } from "react";

export default function AccountRow({
  session,
  isActive,
  onAliasChange,
  onDeleteSession,
}) {
  const [showAliasModal, setShowAliasModal] = useState(false);
  const [showBorder, setShowBorder] = useState(getBorderPreference());
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);
  const { cacheVersion } = useAvatarCache();

  useEffect(() => {
    const handleStorageChange = () => {
      setShowBorder(getBorderPreference());
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const displayName =
    session?.alias || session?.username || session?.userId;

  const metaLineValue = session?.alias
    ? session?.username || session?.userId
    : session?.userId;

  function getFirstVisibleChar(str) {
    if (!str) return "";
    const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
    const firstSegment = [...segmenter.segment(str)][0]?.segment || "";
    const isEmoji = /\p{Emoji}/u.test(firstSegment);
    return isEmoji ? firstSegment : firstSegment.toUpperCase();
  }

  const handleAliasEdit = (e) => {
    e.stopPropagation();
    setShowAliasModal(true);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDeleteSession?.(session.userId);
  };

  const handleMouseEnter = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setTooltipPos({
        top: Math.round(rect.top),
        left: Math.round(rect.left + rect.width / 2),
      });
      setShowTooltip(true);
    }
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };


  return (
    <div className={styles.rowWrapper}>
      <div className={styles.listItem}>
        <div className={styles.avatarWrapper}>
          <div
            className={`${styles.avatar} ${!showBorder ? styles.avatarNoBorder : ""}`}
            style={{
              background: session?.avatarColor || undefined,
              padding: showBorder ? '2px' : 0
            }}
          >
            {session?.avatarImage ? (
              <img
                src={`/avatar-thumb/${session.avatarImage}?v=${cacheVersion}`}
                alt=""
                className={styles.customAvatarImage}
              />
            ) : (
              getFirstVisibleChar(displayName)
            )}
          </div>
        </div>

        <div className={styles.textBlock}>
          <div className={styles.inlineRow}>
            <div className={`${styles.displayName} ${styles.selectableText}`}>{displayName}</div>
          </div>

          <div className={styles.inlineRow}>
            <div className={`${styles.metaLine} ${styles.selectableText}`}>{metaLineValue}</div>
          </div>
        </div>

        <div className={styles.actionsWrapper}>
          <>
            {isActive && (
              <div
                className={styles.tooltipTrigger}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                ref={triggerRef}
              >
                <div className={styles.activeIndicator}>
                  <HiOutlineCheckCircle />
                </div>
                {createPortal(
                  <AnimatePresence>
                    {showTooltip && (
                      <motion.div
                        className={styles.portalTooltip}
                        initial={{ opacity: 0, x: "-50%", y: 4 }}
                        animate={{ opacity: 1, x: "-50%", y: 0 }}
                        exit={{ opacity: 0, x: "-50%", y: 4 }}
                        transition={{
                          duration: 0.25,
                          ease: [0.4, 0, 0.2, 1],
                          opacity: { duration: 0.15 }
                        }}
                        style={{
                          top: `${tooltipPos.top - 42}px`, // Fixed height + small gap
                          left: `${tooltipPos.left}px`,
                        }}
                      >
                        Currently logged in
                      </motion.div>
                    )}
                  </AnimatePresence>,
                  document.body
                )}
              </div>
            )}

            <button
              type="button"
              className={`${styles.editAliasButton} ${session.alias ? styles.hasAlias : ""}`}
              onClick={handleAliasEdit}
            >
              <HiOutlinePencil />
              <span>Edit nickname</span>
            </button>

            <button
              type="button"
              className={styles.iconButton}
              onClick={handleDelete}
            >
              <HiOutlineTrash />
            </button>

            {showAliasModal && (
              <EditAliasModal
                userId={session.userId}
                currentAlias={session.alias}
                onAliasChange={onAliasChange}
                onClose={() => setShowAliasModal(false)}
              />
            )}
          </>
        </div>
      </div>
    </div>
  );
}
