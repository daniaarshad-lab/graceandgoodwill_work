"use client";

import React from "react";
import StaticSiteHeader from "@/components/StaticSiteHeader";
import SiteFooter from "@/components/SiteFooter";

export default function PublicLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <>
      <StaticSiteHeader />
      <div className="flex-grow">{children}</div>
      <SiteFooter />
    </>
  );
}
