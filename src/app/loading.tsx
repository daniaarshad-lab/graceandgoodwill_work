"use client";

import React from "react";

/* Spinner and label styling match the auth/logout loader in
   src/guards/ProtectedRoute.tsx so route transitions look the same as the rest
   of the app. */
export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-navy-950 text-gold-100">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-DEFAULT"></div>
        <p className="text-sm tracking-wider text-gold-200">Loading...</p>
      </div>
    </div>
  );
}
