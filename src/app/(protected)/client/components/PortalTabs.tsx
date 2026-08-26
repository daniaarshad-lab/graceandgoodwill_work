"use client";

import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { useRef, useEffect, useTransition } from "react";
import { Loader2 } from "lucide-react";

export type TabType =
  | "request"
  | "overview"
  | "profile"
  | "carers"
  | "tracking"
  | "applications"
  | "enquiry"
  | "interest-list"
  | "referrals"
  | "billing"
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
  const profile = useAppSelector((state) => state.client.profile);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPending, startTransition] = useTransition();

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

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("mousedown", onMouseDown);
    el.addEventListener("mouseleave", onMouseLeave);
    el.addEventListener("mouseup", onMouseUp);
    el.addEventListener("mousemove", onMouseMove);

    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("mousedown", onMouseDown);
      el.removeEventListener("mouseleave", onMouseLeave);
      el.removeEventListener("mouseup", onMouseUp);
      el.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

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
    {
      id: "profile" as TabType,
      label: "Profile Management",
      href: "/client?tab=profile",
    },
    {
      id: "carers" as TabType,
      label: "Carer Profiles",
      href: "/client?tab=carers",
    },
    {
      id: "interest-list" as TabType,
      label: "Interest List â¤ï¸",
      href: "/client?tab=interest-list",
    },
    {
      id: "tracking" as TabType,
      label: "Placements",
      href: "/client?tab=tracking",
    },
    {
      id: "applications" as TabType,
      label: "Care Requests",
      href: "/client?tab=applications",
    },
    {
      id: "enquiry",
      label: "Support & Enquiries",
      href: "/client?tab=enquiry",
    },
    {
      id: "billing" as TabType,
      label: "Billing & Payments",
      href: "/client?tab=billing",
    },
    {
      id: "agreements" as TabType,
      label: "Terms & Policies",
      href: "/client?tab=agreements",
    },
    { id: "referrals", label: "Refer a Client", href: "/client/referrals" },
  ];

  const handleTabClick = (tabId: TabType, href: string) => {
    startTransition(() => {
      if (setActiveTab) {
        setActiveTab(tabId);
      }
      router.push(href);
    });
  };

  return (
    <>
      {isPending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/40 backdrop-blur-[2px]">
          <div className="bg-navy-900/90 p-4 rounded-2xl border border-navy-800 shadow-2xl flex flex-col items-center space-y-3">
            <Loader2 className="h-8 w-8 animate-spin text-gold-DEFAULT" />
            <p className="text-xs font-medium text-gold-200 tracking-wider uppercase">
              Loading...
            </p>
          </div>
        </div>
      )}
      <div
        ref={scrollRef}
        className="flex flex-nowrap items-center border-b border-gold-300/10 pb-1 overflow-x-auto gap-1 client-tabs-nav"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <style>{`.client-tabs-nav::-webkit-scrollbar { display: none; }`}</style>
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
    </>
  );
}

