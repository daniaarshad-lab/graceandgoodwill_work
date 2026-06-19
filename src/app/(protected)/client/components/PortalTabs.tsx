"use client";

import { useRouter } from "next/navigation";

export type TabType =
  | "request"
  | "overview"
  | "profile"
  | "carers"
  | "tracking"
  | "enquiry"
  | "referrals";

interface PortalTabsProps {
  activeTab: TabType;
  setActiveTab?: (tab: TabType) => void;
}

export default function PortalTabs({
  activeTab,
  setActiveTab,
}: PortalTabsProps) {
  const router = useRouter();

  const tabs = [
    {
      id: "request",
      label: "Submit Care Request",
      href: "/client?tab=request",
    },
    {
      id: "overview",
      label: "Dashboard Overview",
      href: "/client?tab=overview",
    },
    { id: "profile", label: "Profile Management", href: "/client?tab=profile" },
    { id: "carers", label: "Carer Profiles", href: "/client?tab=carers" },
    { id: "tracking", label: "Track Requests", href: "/client?tab=tracking" },
    {
      id: "enquiry",
      label: "Support & Enquiries",
      href: "/client?tab=enquiry",
    },
    { id: "referrals", label: "Refer a Client", href: "/client/referrals" },
  ] as const;

  const handleTabClick = (tabId: TabType, href: string) => {
    if (tabId === "referrals") {
      router.push(href);
    } else {
      if (setActiveTab) {
        setActiveTab(tabId);
        if (
          typeof window !== "undefined" &&
          window.location.pathname.includes("/referrals")
        ) {
          router.push(href);
        }
      } else {
        router.push(href);
      }
    }
  };

  return (
    <div
      className="flex flex-nowrap items-center border-b border-gold-300/10 pb-1 overflow-x-auto gap-1"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      <style>{`.client-tabs-nav::-webkit-scrollbar { display: none; }`}</style>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleTabClick(tab.id as TabType, tab.href)}
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
