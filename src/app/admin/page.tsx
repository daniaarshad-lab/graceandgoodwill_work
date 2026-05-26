"use client";

import CenteredLayout from "@/components/CenteredLayout";
import Card from "@/components/Card";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminPage() {
  const { user } = useAuth();
  
  return (
    <CenteredLayout
      title="Admin Portal"
      subtitle={`Welcome, Admin ${user?.firstName || ""}`}
    >
      <Card className="text-center space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold/10 text-gold">
          <svg
            className="h-8 w-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            ></path>
          </svg>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gold-200">System Dashboard</h3>
          <p className="text-sm text-gold-100/70">
            This is the administrative dashboard restricted to Admin roles only. Full management tools will be available soon.
          </p>
        </div>
        
        <Link
          href="/"
          className="inline-flex w-full items-center justify-center rounded-xl bg-gold px-4 py-3 text-sm font-semibold text-navy-950 shadow-elegant transition hover:opacity-90"
        >
          Return to Home
        </Link>
      </Card>
    </CenteredLayout>
  );
}
