"use client";

import React from "react";

/* Spinner and label styling match the auth/logout loader in
   src/guards/ProtectedRoute.tsx, so moving between portal pages looks the same
   as the session checks that wrap them. */
export default function ProtectedLoading() {
  return (
    <div className="min-h-[70vh] w-full flex flex-col items-center justify-center bg-navy-950 text-gold-100 py-12">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-DEFAULT"></div>
        <p className="text-sm tracking-wider text-gold-200">Loading...</p>
      </div>
    </div>
  );
}
