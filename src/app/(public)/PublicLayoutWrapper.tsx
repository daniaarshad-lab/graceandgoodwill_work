"use client";

import React from "react";
import StaticSiteHeader from "@/components/StaticSiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { usePathname } from "next/navigation";

export default function PublicLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname() || "";
  const isPublicCarerProfile =
    pathname.includes("/public/carer") ||
    pathname.includes("/carer/") ||
    (typeof window !== "undefined" &&
      (window.location.pathname.includes("/public/carer") ||
        window.location.pathname.includes("/carer/")));

  return (
    <>
      <StaticSiteHeader />
      <div className="flex-grow">{children}</div>
      {!isPublicCarerProfile && <SiteFooter />}
    </>
  );
}
