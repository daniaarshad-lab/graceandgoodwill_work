"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

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

  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center text-slate-400">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-DEFAULT"></div>
    </div>
  );
}
