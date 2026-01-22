import { useState, useContext } from "react";
import PageHeader from "../components/PageHeader";
import { SessionContext } from "../context/SessionContext";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import HintMessage from "../components/HintMessage";
import DeleteSessionModal from "../components/modals/DeleteSessionModal";
import styles from "./Manage.module.css";
import AccountRow from "../components/AccountRow";
import { DeleteSession } from "../../wailsjs/go/services/SessionStore";
import { MoveAsideActiveSession } from "../../wailsjs/go/services/AuthService";
import { HiPlus } from "react-icons/hi";
import AddAccountModal from "../components/modals/AddAccountModal";

export default function Manage() {
  const { sessions, setSessions, isLoading, onAliasChange } = useContext(SessionContext);
  const { activeLoginSession } = useContext(AuthContext);
  const activeUserId = activeLoginSession?.userId || null;

  const [deleteTarget, setDeleteTarget] = useState(null);

  const [editingAliasForId, setEditingAliasForId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  async function handleDelete(userId) {
    try {
      await DeleteSession(userId);
      toast.success("Session deleted", { id: "delete-session" });
      setSessions((prev) => prev.filter((s) => s.userId !== userId));
      setDeleteTarget(null);
    } catch (err) {
      console.error("Failed to delete session:", err);
      toast.error("Failed to delete session", { id: "delete-session-error" });
    }
  }

  async function handleAddMainAction() {
    try {
      await MoveAsideActiveSession();
      toast.success("Epic Games Launcher restarted — log in with your other account.", { id: "move-aside-active-session" });
      setShowAddModal(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to move aside active session.", { id: "move-aside-error" });
    }
  }

  function handleAddCancel() {
    setShowAddModal(false);
  }

  return (
    <div className={styles.pageWrapper}>
      <PageHeader
        title="Manage"
        rightElement={
          <button
            className={styles.addButton}
            onClick={() => setShowAddModal(true)}
          >
            <HiPlus />
            <span>Add</span>
          </button>
        }
      />

      <div className={styles.description}>
        Add new accounts, customize aliases, and delete unused sessions.
      </div>

      {!isLoading && (
        <>
          {sessions.length === 0 ? (
            <div className={styles.noSessionsMessage}>No sessions available.</div>
          ) : (
            <div className={styles.listContainer}>
              {sessions.map((session, idx) => {
                return (
                  <AccountRow
                    key={session.userId}
                    session={session}
                    isActive={session.userId === activeUserId}
                    onAliasChange={onAliasChange}
                    onDeleteSession={() => {
                      setEditingAliasForId(null);
                      setDeleteTarget(session);
                    }}
                    isEditing={editingAliasForId === session.userId}
                    onEditToggle={() =>
                      setEditingAliasForId(prev =>
                        prev === session.userId ? null : session.userId
                      )
                    }
                    onCloseEdit={() => setEditingAliasForId(null)}
                  />
                );
              })}
            </div>
          )}
        </>
      )}

      {sessions.length > 0 && <HintMessage />}

      {deleteTarget && (
        <DeleteSessionModal
          session={deleteTarget}
          onConfirm={() => handleDelete(deleteTarget.userId)}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {showAddModal && (
        <AddAccountModal onMoveAside={handleAddMainAction} onCancel={handleAddCancel} />
      )}
    </div>
  );
}
