"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import ThinSpinner from "@/components/ThinSpinner";

export default function ClientBillingRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Preserve any query parameters like ?session=success or ?billing_request_id
    const search = typeof window !== "undefined" ? window.location.search : "";

    // Parse existing search params and append/override tab parameter to 'billing'
    const params = new URLSearchParams(search);
    params.set("tab", "billing");

    router.replace(`/client?${params.toString()}`);
  }, [router]);

  return <ThinSpinner fullScreen text="Redirecting..." size="xl" />;
}
