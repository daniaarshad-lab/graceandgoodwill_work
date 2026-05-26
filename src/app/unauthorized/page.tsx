"use client";

import Link from "next/link";
import CenteredLayout from "@/components/CenteredLayout";
import Card from "@/components/Card";

export default function UnauthorizedPage() {
  return (
    <CenteredLayout
      title="Access Denied"
      subtitle="You do not have the required permissions to view this resource."
    >
      <Card className="text-center space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-500">
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
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            ></path>
          </svg>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gold-200">Restricted Route</h3>
          <p className="text-sm text-gold-100/70">
            This portal is restricted to authorized credentials only. If you believe this is an error, please log out and sign in with the correct account.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/"
            className="inline-flex w-full items-center justify-center rounded-xl border border-gold-DEFAULT/30 text-gold-DEFAULT px-4 py-3 text-sm font-semibold transition hover:bg-gold-DEFAULT/10 hover:border-gold-DEFAULT"
          >
            Go to Home
          </Link>
          <Link
            href="/login"
            className="inline-flex w-full items-center justify-center rounded-xl bg-gold-DEFAULT px-4 py-3 text-sm font-semibold text-navy-950 shadow-elegant transition hover:bg-gold-300"
          >
            Login Page
          </Link>
        </div>
      </Card>
    </CenteredLayout>
  );
}
