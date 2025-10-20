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

export default function Manage() {
  const { sessions, isLoading, onAliasChange } = useContext(SessionContext);
  const { activeLoginSession } = useContext(AuthContext);
  const activeUserId = activeLoginSession?.userId || null;
  const [activeTab, setActiveTab] = useState("aliases");

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`Copied: ${text}`);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const tabs = [
    { id: "aliases", label: "Aliases" },
    { id: "ignored", label: "Ignored Sessions" },
    { id: "delete", label: "Delete Session" },
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
        return <DeleteSessionTab />;
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
