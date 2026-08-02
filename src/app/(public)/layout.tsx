import React from "react";
import PublicLayoutWrapper from "./PublicLayoutWrapper";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PublicLayoutWrapper>{children}</PublicLayoutWrapper>;
}
