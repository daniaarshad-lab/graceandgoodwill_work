"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminBillingRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin?tab=billing");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-950 text-gold-100">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-DEFAULT"></div>
        <p className="text-sm tracking-wider text-gold-200 font-semibold">Redirecting to unified billing console...</p>
      </div>
    </div>
  );
}
