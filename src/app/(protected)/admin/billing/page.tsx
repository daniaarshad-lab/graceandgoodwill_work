"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ThinSpinner from "@/components/ThinSpinner";

export default function AdminBillingRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin?tab=billing");
  }, [router]);

  return (
    <ThinSpinner
      fullScreen
      size="xl"
      text="Redirecting to unified billing console..."
    />
  );
}
