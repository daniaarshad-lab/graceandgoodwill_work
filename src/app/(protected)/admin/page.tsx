"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import CarePlatformShell from "@/components/care-platform/CarePlatformShell";
import type { AdminView } from "@/components/care-platform/AdminSidebar";
import ThinSpinner from "@/components/ThinSpinner";

const VALID_VIEWS: AdminView[] = [
  "dashboard",
  "carer-review",
  "active-placement",
  "health-conditions",
  "medication",
  "allergies",
  "declarations",
  "carer-accommodation",
  "expired-link",
];

function AdminPortalEntry() {
  const searchParams = useSearchParams();
  const requestedView = searchParams.get("view") as AdminView | null;
  const initialView: AdminView =
    requestedView && VALID_VIEWS.includes(requestedView)
      ? requestedView
      : "dashboard";

  return <CarePlatformShell initialView={initialView} />;
}

export default function AdminPortalPage() {
  return (
    <Suspense fallback={<ThinSpinner fullScreen size="xl" text="Loading Admin Portal..." />}>
      <AdminPortalEntry />
    </Suspense>
  );
}
