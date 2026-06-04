"use client";

import Link from "next/link";
import CenteredLayout from "@/components/CenteredLayout";
import Button from "@/components/Button";
import { AlertTriangle } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <CenteredLayout
      title="Access Denied"
      subtitle="You do not have the required permissions to view this resource."
    >
      <div className="border rounded-2xl p-6 shadow-sm bg-card text-center space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-500">
          <AlertTriangle className="h-8 w-8" strokeWidth={2} />
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gold-200">
            Restricted Route
          </h3>
          <p className="text-sm text-gold-100/70">
            This portal is restricted to authorized credentials only. If you
            believe this is an error, please log out and sign in with the
            correct account.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link href="/" prefetch={true}>
              Go to Home
            </Link>
          </Button>
          <Button asChild variant="primary" className="w-full sm:w-auto">
            <Link href="/login" prefetch={true}>
              Login Page
            </Link>
          </Button>
        </div>
      </div>
    </CenteredLayout>
  );
}
