"use client";

import CenteredLayout from "@/components/CenteredLayout";
import Card from "@/components/Card";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function ClientPage() {
  const { user } = useAuth();
  
  return (
    <CenteredLayout
      title="Client Portal"
      subtitle={`Welcome, Client ${user?.firstName || ""}`}
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
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            ></path>
          </svg>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gold-200">My Care Account</h3>
          <p className="text-sm text-gold-100/70">
            This is the care recipient or family dashboard restricted to Clients only. Your care schedule and provider management profiles will be available soon.
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
