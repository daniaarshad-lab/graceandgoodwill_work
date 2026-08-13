import React from 'react';

export default function CompassionLogo() {
  return (
    <div className="flex items-center gap-6 p-8 bg-navy-950">
      {/* Logo SVG - Representing the hands holding a heart */}
      <div className="w-24 h-24 shrink-0">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fde6c4" />
              <stop offset="50%" stopColor="#d4af37" />
              <stop offset="100%" stopColor="#b8812a" />
            </linearGradient>
            <linearGradient id="handsGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f5d4a0" />
              <stop offset="100%" stopColor="#c99232" />
            </linearGradient>
          </defs>
          
          {/* Heart */}
          <path
            d="M50 55 C50 55, 67 40, 67 28 C67 19, 58 14, 50 22 C42 14, 33 19, 33 28 C33 40, 50 55, 50 55 Z"
            fill="url(#goldGradient)"
          />
          
          {/* Left Hand */}
          <path
            d="M32 42 C25 45, 18 38, 15 45 C12 52, 20 62, 30 70 C38 76, 42 75, 42 75 L42 85 L32 85 C22 85, 8 72, 8 52 C8 45, 12 38, 18 35 C24 32, 32 42, 32 42 Z"
            fill="url(#handsGradient)"
          />
          <path d="M22 36 C18 38, 15 43, 16 48 C16 48, 26 44, 33 48" stroke="url(#handsGradient)" strokeWidth="3" fill="none" strokeLinecap="round" />

          {/* Right Hand */}
          <path
            d="M68 42 C75 45, 82 38, 85 45 C88 52, 80 62, 70 70 C62 76, 58 75, 58 75 L58 85 L68 85 C78 85, 92 72, 92 52 C92 45, 88 38, 82 35 C76 32, 68 42, 68 42 Z"
            fill="url(#handsGradient)"
          />
          <path d="M78 36 C82 38, 85 43, 84 48 C84 48, 74 44, 67 48" stroke="url(#handsGradient)" strokeWidth="3" fill="none" strokeLinecap="round" />
        </svg>
      </div>

      {/* Text Section */}
      <div className="flex flex-col justify-center gap-1">
        <h1 className="text-5xl font-serif tracking-widest text-[#B59163] font-normal m-0 p-0 leading-none">
          COMPASSION
        </h1>
        <div className="text-3xl font-sans font-normal text-[#D6C19F] leading-snug tracking-wide">
          <p className="m-0 p-0">A duty to care,</p>
          <p className="m-0 p-0">a promise to serve.</p>
        </div>
      </div>
    </div>
  );
}
