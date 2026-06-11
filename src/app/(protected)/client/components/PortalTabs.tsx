type TabType =
  | "overview"
  | "profile"
  | "request"
  | "carers"
  | "tracking"
  | "enquiry";

interface PortalTabsProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export default function PortalTabs({
  activeTab,
  setActiveTab,
}: PortalTabsProps) {
  const tabs = [
    { id: "request", label: "Submit Care Request" },
    { id: "overview", label: "Dashboard Overview" },
    { id: "profile", label: "Profile Management" },
    { id: "carers", label: "Carer Profiles" },
    { id: "tracking", label: "Track Requests" },
    { id: "enquiry", label: "Support & Enquiries" },
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
