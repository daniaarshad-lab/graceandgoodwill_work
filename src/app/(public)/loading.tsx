"use client";

import React from "react";

/* Spinner and label styling match the auth/logout loader in
   src/guards/ProtectedRoute.tsx. Height stays at 60vh so the site header and
   footer remain in place while a public page loads. */
export default function PublicLoading() {
  return (
    <div className="min-h-[60vh] w-full flex flex-col items-center justify-center bg-navy-950 text-gold-100 py-12">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-DEFAULT"></div>
        <p className="text-sm tracking-wider text-gold-200">Loading...</p>
      </div>
    </div>
  );
}
