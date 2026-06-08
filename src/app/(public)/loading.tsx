"use client";

import React from "react";

export default function PublicLoading() {
  return (
    <div className="min-h-[60vh] w-full flex flex-col items-center justify-center bg-navy-950 text-gold-100 py-12">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-gold/25"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-gold border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
        </div>
        <p className="text-xs tracking-widest text-gold-200 font-semibold uppercase animate-pulse">
          Loading Content...
        </p>
      </div>
    </div>
  );
}
