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
    <div
      className="flex flex-nowrap items-center border-b border-gold-300/10 pb-1 overflow-x-auto gap-1"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      <style>{`.client-tabs-nav::-webkit-scrollbar { display: none; }`}</style>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id as TabType)}
          className={`px-5 py-3 text-sm font-semibold rounded-t-xl transition-all duration-300 whitespace-nowrap flex-shrink-0 ${
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
