import React from "react";
import StaticSiteHeader from "@/components/StaticSiteHeader";
import SiteFooter from "@/components/SiteFooter";

export default function PublicLayout({
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
