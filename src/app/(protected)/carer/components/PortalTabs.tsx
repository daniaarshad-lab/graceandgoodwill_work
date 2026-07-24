"use client";

import { useRouter } from "next/navigation";
import { useRef, useEffect } from "react";

export type TabType =
  | "overview"
  | "profile"
  | "media"
  | "compliance"
  | "availability"
  | "opportunities"
  | "applications"
  | "history"
  | "placements"
  | "referrals"
  | "agreements";

interface PortalTabsProps {
  activeTab: TabType;
  setActiveTab?: (tab: TabType) => void;
}

export default function PortalTabs({
  activeTab,
  setActiveTab,
}: PortalTabsProps) {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0 && e.deltaX === 0) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };

    let isDown = false;
    let startX = 0;
    let scrollLeftPos = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDown = true;
      startX = e.pageX - el.offsetLeft;
      scrollLeftPos = el.scrollLeft;
    };
    const onMouseLeave = () => {
      isDown = false;
    };
    const onMouseUp = () => {
      isDown = false;
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      const walk = (x - startX) * 2;
      el.scrollLeft = scrollLeftPos - walk;
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('mousedown', onMouseDown);
    el.addEventListener('mouseleave', onMouseLeave);
    el.addEventListener('mouseup', onMouseUp);
    el.addEventListener('mousemove', onMouseMove);

    return () => {
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('mousedown', onMouseDown);
      el.removeEventListener('mouseleave', onMouseLeave);
      el.removeEventListener('mouseup', onMouseUp);
      el.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  const tabs = [
    { id: "overview", label: "Overview", href: "/carer?tab=overview" },
    { id: "profile", label: "My Profile", href: "/carer?tab=profile" },
    { id: "media", label: "Media", href: "/carer?tab=media" },
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
      id: "applications",
      label: "My Applications",
      href: "/carer?tab=applications",
    },
    {
      id: "history",
      label: "Application History",
      href: "/carer?tab=history",
    },
    {
      id: "placements",
      label: "Placements",
      href: "/carer?tab=placements",
    },
    { id: "agreements" as TabType, label: "Legal Agreements", href: "/carer?tab=agreements" },
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
        ref={scrollRef}
        className="flex border-b border-gold-300/10 pb-1 overflow-x-auto gap-1 sm:gap-2 portal-tabs"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <style>{`.portal-tabs::-webkit-scrollbar { display: none; }`}</style>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id as TabType, tab.href)}
            className={`px-3 sm:px-5 py-3 min-h-[44px] text-xs sm:text-sm font-semibold rounded-t-xl transition-all duration-300 whitespace-nowrap flex-shrink-0 ${activeTab === tab.id
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
