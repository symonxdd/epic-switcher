import { useState, useContext } from "react";
import { createPortal } from "react-dom";
import {
  HiOutlineCheckCircle,
  HiOutlineHashtag,
  HiOutlineMail,
  HiOutlinePencil,
  HiOutlineTrash,
  HiPencil,
} from "react-icons/hi";
import styles from "./AccountRow.module.css";
import EditAliasModal from "./modals/EditAliasModal";
import CustomizeAvatarModal from "./modals/CustomizeAvatarModal";
import InfoPill from "./InfoPill";
import { AuthContext } from "../context/AuthContext";
import { SessionContext } from "../context/SessionContext";
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
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const { updateSessionLocally, selectAvatar, removeAvatar } = useContext(SessionContext);
  const [showBorder, setShowBorder] = useState(getBorderPreference());
  const { cacheVersion } = useAvatarCache();
  const { isNewLauncher } = useContext(AuthContext);

  useEffect(() => {
    const handleStorageChange = () => {
      setShowBorder(getBorderPreference());
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const displayName =
    session?.alias || session?.username || session?.userId;

  // With a nickname set, the real username would otherwise not be shown anywhere
  const showUsername = Boolean(session?.alias && session?.username);

  // Only the new launcher provides emails, so with the legacy one the pill would never fill in
  const showEmailPill = isNewLauncher || Boolean(session?.email);

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

  return (
    <div className={styles.rowWrapper}>
      <div className={styles.listItem}>
        <button
          type="button"
          className={styles.avatarWrapper}
          onClick={() => setShowAvatarModal(true)}
          aria-label="Customize avatar"
        >
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
            <div className={styles.avatarOverlay}>
              <HiPencil />
            </div>
          </div>
        </button>

        <div className={styles.textBlock}>
          <div className={styles.inlineRow}>
            <div className={`${styles.displayName} ${styles.selectableText}`}>{displayName}</div>
          </div>

          <div className={styles.inlineRow}>
            {showUsername && (
              <div className={`${styles.metaLine} ${styles.selectableText}`}>{session.username}</div>
            )}
            <InfoPill icon={<HiOutlineHashtag />} label="ID" value={session?.userId} />
            {showEmailPill && (
              <InfoPill
                icon={<HiOutlineMail />}
                label="Email"
                value={session?.email}
                emptyValue="Email not known yet"
                emptyHint="Log in to this account once in the new launcher"
              />
            )}
            {isActive && (
              <span className={styles.loggedInPill}>
                <HiOutlineCheckCircle />
                <span className={styles.loggedInLabel}>Logged in</span>
              </span>
            )}
          </div>
        </div>

        <div className={styles.actionsWrapper}>
          <>
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

      {/* Portaled, as this row sits inside the list's grid */}
      {showAvatarModal && createPortal(
        <CustomizeAvatarModal
          username={displayName}
          userId={session.userId}
          currentAvatarImage={session.avatarImage}
          currentAvatarColor={session.avatarColor}
          onSelect={() => selectAvatar(session.userId)}
          onRemove={() => removeAvatar(session.userId)}
          onCancel={() => setShowAvatarModal(false)}
          onAvatarChange={(filename) => updateSessionLocally(session.userId, { avatarImage: filename })}
          onColorChange={(color) => updateSessionLocally(session.userId, { avatarColor: color })}
        />,
        document.body
      )}
    </div>
  );
}
