type TabType = "overview" | "profile" | "compliance" | "availability";

interface PortalTabsProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export default function PortalTabs({
  activeTab,
  setActiveTab,
}: PortalTabsProps) {
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "profile", label: "My Profile" },
    { id: "compliance", label: "Compliance Vault" },
    { id: "availability", label: "Availability" },
  ] as const;

  return (
    <div className="flex border-b border-gold-300/10 pb-1 overflow-x-auto gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id as TabType)}
          className={`px-5 py-3 text-sm font-semibold rounded-t-xl transition-all duration-300 whitespace-nowrap ${
            activeTab === tab.id
              ? "border-b-2 border-gold-DEFAULT text-gold-DEFAULT bg-gold-DEFAULT/5"
              : "text-gold-200/60 hover:text-gold-50"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
