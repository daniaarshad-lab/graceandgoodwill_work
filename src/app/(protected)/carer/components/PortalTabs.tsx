"use client";

import { useRouter } from "next/navigation";

export type TabType =
  | "overview"
  | "profile"
  | "compliance"
  | "availability"
  | "opportunities"
  | "referrals"
  | "membership";

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
    { id: "overview", label: "Overview", href: "/carer?tab=overview" },
    { id: "profile", label: "My Profile", href: "/carer?tab=profile" },
    {
      id: "compliance",
      label: "Compliance Vault",
      href: "/carer?tab=compliance",
    },
    {
      id: "availability",
      label: "Availability",
      href: "/carer?tab=availability",
    },
    {
      id: "opportunities",
      label: "Placement Opportunities",
      href: "/carer?tab=opportunities",
    },
    {
      id: "membership",
      label: "Membership & Billing",
      href: "/carer?tab=membership",
    },
    { id: "referrals", label: "Referral Program", href: "/carer/referrals" },
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
    <div className="relative">
      <div
        className="flex border-b border-gold-300/10 pb-1 overflow-x-auto gap-1 sm:gap-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <style>{`.portal-tabs::-webkit-scrollbar { display: none; }`}</style>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id as TabType, tab.href)}
            className={`px-3 sm:px-5 py-3 min-h-[44px] text-xs sm:text-sm font-semibold rounded-t-xl transition-all duration-300 whitespace-nowrap flex-shrink-0 ${
              activeTab === tab.id
                ? "border-b-2 border-gold-DEFAULT text-gold-DEFAULT bg-gold-DEFAULT/5"
                : "text-gold-200/60 hover:text-gold-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
