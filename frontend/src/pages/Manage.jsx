import { useContext, useState } from "react";
import PageHeader from "../components/PageHeader";
import { SessionContext } from "../context/SessionContext";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import TabBar from "../components/tabs/TabBar";
import AliasesTab from "../components/tabs/AliasesTab";
import IgnoredSessionsTab from "../components/tabs/IgnoredSessionsTab";
import DeleteSessionTab from "../components/tabs/DeleteSessionTab";
import HintMessage from "../components/HintMessage";
import styles from "./Manage.module.css";
import { TbTags, TbUserOff, TbTrash } from "react-icons/tb";

export default function Manage() {
  const { sessions, isLoading, onAliasChange } = useContext(SessionContext);
  const { activeLoginSession } = useContext(AuthContext);
  const activeUserId = activeLoginSession?.userId || null;
  const [activeTab, setActiveTab] = useState("aliases");

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`Copied: ${text}`, { id: "copy-to-clipboard" });
    } catch {
      toast.error("Failed to copy", { id: "copy-error" });
    }
  };

  const tabs = [
    { id: "aliases", label: "Aliases", icon: <TbTags /> },
    { id: "ignored", label: "Ignored", icon: <TbUserOff /> },
    { id: "delete", label: "Delete", icon: <TbTrash /> },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "aliases":
        return (
          <AliasesTab
            sessions={sessions}
            isLoading={isLoading}
            activeLoginSession={activeLoginSession}
            activeUserId={activeUserId}
            onAliasChange={onAliasChange}
            copyToClipboard={copyToClipboard}
          />
        );
      case "ignored":
        return (
          <IgnoredSessionsTab
            sessions={sessions}
            isLoading={isLoading}
            activeLoginSession={activeLoginSession}
          />
        );
      case "delete":
        return <DeleteSessionTab
          isLoading={isLoading}
          activeUserId={activeUserId} />;
      default:
        return null;
    }
  };

  return (
    <>
      <PageHeader title="Manage" />

      {!isLoading && (
        <>
          <TabBar tabs={tabs} defaultTab="aliases" onTabChange={setActiveTab} />
          {renderTabContent()}
        </>
      )}

      {sessions.length > 0 && <HintMessage />}
    </>
  );
}
