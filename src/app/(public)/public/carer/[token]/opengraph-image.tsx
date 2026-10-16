import React from "react";
import { ImageResponse } from "next/og";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";
export const revalidate = 86400;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface Props {
  params: Promise<{ token: string }>;
}

let cachedBgBase64: string | null = null;
let cachedLogoBase64: string | null = null;

function getBgBase64(): string {
  if (cachedBgBase64 !== null) return cachedBgBase64;
  try {
    const bgBuffer = fs.readFileSync(path.join(process.cwd(), "public", "bg-share-wp.jpeg"));
    cachedBgBase64 = `data:image/jpeg;base64,${bgBuffer.toString("base64")}`;
  } catch (err) {
    console.error("Failed to load bg-share-wp.jpeg:", err);
    cachedBgBase64 = "";
  }
  return cachedBgBase64;
}

function getLogoBase64(): string {
  if (cachedLogoBase64 !== null) return cachedLogoBase64;
  try {
    const logoBuffer = fs.readFileSync(path.join(process.cwd(), "public", "website_logo.png"));
    cachedLogoBase64 = `data:image/png;base64,${logoBuffer.toString("base64")}`;
  } catch (err) {
    console.error("Failed to load website_logo.png:", err);
    cachedLogoBase64 = "";
  }
  return cachedLogoBase64;
}

/* ── Google Fonts loader for Satori (next/og ImageResponse) ── */
let cachedCormorantSemiBold: ArrayBuffer | null = null;
let cachedMontserratMedium: ArrayBuffer | null = null;
let cachedMontserratSemiBold: ArrayBuffer | null = null;

async function loadGoogleFont(family: string, weight: number): Promise<ArrayBuffer> {
  const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}`;
  const cssRes = await fetch(url, {
    headers: {
      // Old Safari User-Agent ensures Google Fonts returns TTF format which Satori supports (WOFF2 is not supported by Satori)
      "User-Agent":
        "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1",
    },
    signal: AbortSignal.timeout(4000),
  });
  const css = await cssRes.text();
  const fontUrlMatch = css.match(/src:\s*url\(([^)]+)\)/);
  if (!fontUrlMatch?.[1]) throw new Error(`Could not extract font URL for ${family}:${weight}`);
  const fontRes = await fetch(fontUrlMatch[1], { signal: AbortSignal.timeout(4000) });
  return fontRes.arrayBuffer();
}

async function getCormorantSemiBold(): Promise<ArrayBuffer> {
  if (cachedCormorantSemiBold) return cachedCormorantSemiBold;
  cachedCormorantSemiBold = await loadGoogleFont("Cormorant Garamond", 600);
  return cachedCormorantSemiBold;
}

async function getMontserratMedium(): Promise<ArrayBuffer> {
  if (cachedMontserratMedium) return cachedMontserratMedium;
  cachedMontserratMedium = await loadGoogleFont("Montserrat", 500);
  return cachedMontserratMedium;
}

async function getMontserratSemiBold(): Promise<ArrayBuffer> {
  if (cachedMontserratSemiBold) return cachedMontserratSemiBold;
  cachedMontserratSemiBold = await loadGoogleFont("Montserrat", 600);
  return cachedMontserratSemiBold;
}

/* ── Brand colour constants (warm champagne / antique gold palette) ── */
const GOLD_PRIMARY = "#D4AF6A"; // Warm champagne gold
const GOLD_DARK = "#B99150"; // Antique gold
const GOLD_LIGHT = "#E8D09A"; // Soft champagne
const NAVY_BG = "#09142B"; // Deep midnight navy
const CREAM_BG = "#F8F5EE"; // Warm ivory

export default async function Image({ params }: Props) {
  const { token } = await params;

  const bgBase64 = getBgBase64();
  const logoBase64 = getLogoBase64();

  let displayName = "Grace & Goodwill Carer";
  let photoUrl: string | null = null;

  try {
    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      "https://graceandgoodwill.co.uk";

    const apiBase = (
      process.env.NEXT_PUBLIC_API_URL ||
      `${appUrl}/api`
    )
      .replace(/\/+$/, "")
      .replace(/\/api\/?$/, "");

    // 2500ms timeout so crawler doesn't timeout before receiving response
    const res = await fetch(`${apiBase}/api/public/carer/${token}`, {
      signal: AbortSignal.timeout(2500),
      cache: "no-store",
    });

    if (res.ok) {
      const profile = await res.json();
      if (profile.displayName) displayName = profile.displayName;
      if (profile.photoUrl) photoUrl = profile.photoUrl;
    }
  } catch (err) {
    console.warn("Could not fetch carer profile for OG image:", err);
  }

  // Format privacy name: First Name + Last Initial (e.g. Komal V.)
  let safeName = "Grace & Goodwill Carer";
  let initialLetter = "G";

  if (displayName && displayName !== "Our Carer" && displayName !== "Grace & Goodwill Carer") {
    const nameParts = displayName.split(/\s+/).filter(Boolean);
    const firstName = nameParts.length > 0 ? nameParts[0] : "Carer";
    const lastInitial = nameParts.length > 1 ? nameParts[nameParts.length - 1].charAt(0).toUpperCase() : "";
    safeName = lastInitial && !firstName.endsWith(".") ? `${firstName} ${lastInitial}.` : firstName;
    initialLetter = safeName.charAt(0).toUpperCase() || "C";
  }

  // Pre-fetch carer photo if available (2500ms timeout)
  let carerPhotoData: string | null = null;
  if (photoUrl) {
    try {
      const photoRes = await fetch(photoUrl, { signal: AbortSignal.timeout(2500) });
      if (photoRes.ok) {
        const buffer = await photoRes.arrayBuffer();
        const b64 = Buffer.from(buffer).toString("base64");
        const ct = photoRes.headers.get("content-type") || "image/jpeg";
        carerPhotoData = `data:${ct};base64,${b64}`;
      }
    } catch {
      // Fallback to placeholder monogram
    }
  }

  // Load custom fonts for Satori (best-effort; falls back to system serif/sans-serif)
  let fonts: { name: string; data: ArrayBuffer; weight: 400 | 500 | 600 | 700; style: "normal" }[] = [];
  try {
    const [cormorant600, montserrat500, montserrat600] = await Promise.all([
      getCormorantSemiBold(),
      getMontserratMedium(),
      getMontserratSemiBold(),
    ]);
    fonts = [
      { name: "Cormorant Garamond", data: cormorant600, weight: 600, style: "normal" as const },
      { name: "Montserrat", data: montserrat500, weight: 500, style: "normal" as const },
      { name: "Montserrat", data: montserrat600, weight: 600, style: "normal" as const },
    ];
  } catch (err) {
    console.warn("Could not load Google Fonts for OG image, using system fallbacks:", err);
  }

  /* ── Layout measurements (1200 × 630) ── */
  const FOOTER_H = 185; // increased footer height for maximum contact legibility
  const WAVE_H = 180; // ultra-thick luxury curved gold ribbon transition height
  const NAVY_H = 445; // navy content zone

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          fontFamily: "'Montserrat', 'Inter', system-ui, sans-serif",
          backgroundColor: NAVY_BG,
        }}
      >
        {/* Background Image: bg-share-wp.jpeg */}
        {bgBase64 ? (
          <img
            src={bgBase64}
            width={1200}
            height={630}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "1200px",
              height: "630px",
              objectFit: "cover",
            }}
          />
        ) : null}

        {/* Deep navy vignette on left side for text clarity */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "820px",
            height: `${NAVY_H}px`,
            background:
              `linear-gradient(90deg, rgba(9,20,43,0.97) 0%, rgba(9,20,43,0.92) 55%, rgba(9,20,43,0.45) 82%, transparent 100%)`,
            display: "flex",
          }}
        />

        {/* ── Top-Left: Logo + "GRACE & GOODWILL" + strapline ── */}
        <div
          style={{
            position: "absolute",
            top: "22px",
            left: "64px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Logo icon */}
          {logoBase64 ? (
            <img
              src={logoBase64}
              width={82}
              height={82}
              style={{ objectFit: "contain", display: "flex" }}
            />
          ) : (
            <div
              style={{
                width: "82px",
                height: "82px",
                backgroundColor: `rgba(212,175,106,0.2)`,
                borderRadius: "12px",
                display: "flex",
              }}
            />
          )}

          {/* Company name centered under icon */}
          <div
            style={{
              fontSize: "28px",
              fontWeight: 600,
              color: GOLD_PRIMARY,
              letterSpacing: "5.5px",
              marginTop: "8px",
              display: "flex",
              fontFamily: "'Montserrat', sans-serif",
            }}
          >
            GRACE &amp; GOODWILL
          </div>

          {/* Strapline with gold divider lines */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginTop: "4px",
            }}
          >
            <div
              style={{
                width: "30px",
                height: "1px",
                backgroundColor: `rgba(212,175,106,0.6)`,
                display: "flex",
              }}
            />
            <span
              style={{
                fontSize: "13px",
                color: GOLD_LIGHT,
                letterSpacing: "3px",
                fontWeight: 500,
                display: "flex",
                fontFamily: "'Montserrat', sans-serif",
              }}
            >
              CARE DEFINED BY INTEGRITY
            </span>
            <div
              style={{
                width: "30px",
                height: "1px",
                backgroundColor: `rgba(212,175,106,0.6)`,
                display: "flex",
              }}
            />
          </div>
        </div>

        {/* ── Middle-Left: "CARE YOU CAN TRUST" + Carer name + role ── */}
        <div
          style={{
            position: "absolute",
            top: "188px",
            left: "64px",
            width: "600px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* "CARE YOU CAN TRUST" tagline (Client spec: 19–21 px, Montserrat SemiBold) */}
          <div
            style={{
              fontSize: "20px",
              color: GOLD_PRIMARY,
              letterSpacing: "4.5px",
              fontWeight: 600,
              marginBottom: "8px",
              display: "flex",
              fontFamily: "'Montserrat', sans-serif",
            }}
          >
            CARE YOU CAN TRUST
          </div>

          {/* Carer Name — large, elegant serif (Client spec: 65–72 px, Cormorant Garamond SemiBold) */}
          <div
            style={{
              fontSize: "70px",
              fontWeight: 600,
              color: "#FFFFFF",
              lineHeight: 1.05,
              marginBottom: "10px",
              display: "flex",
              fontFamily: "'Cormorant Garamond', Georgia, serif",
            }}
          >
            {safeName}
          </div>

          {/* Professional role (Client spec: 25–28 px, Montserrat Medium) */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: "26px",
              fontFamily: "'Montserrat', sans-serif",
              lineHeight: 1.25,
            }}
          >
            <span
              style={{
                color: "rgba(255, 255, 255, 0.92)",
                fontWeight: 500,
                display: "flex",
              }}
            >
              Professional Live-in Carer with
            </span>
            <span
              style={{
                color: GOLD_PRIMARY,
                fontWeight: 600,
                marginTop: "2px",
                display: "flex",
              }}
            >
              Grace &amp; Goodwill
            </span>
          </div>
        </div>

        {/* ── Right Side: Circular Carer Photo with Gold Border ── */}
        <div
          style={{
            position: "absolute",
            top: "35px",
            right: "75px",
            width: "360px",
            height: "360px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Outer glow ring */}
          <div
            style={{
              position: "absolute",
              width: "376px",
              height: "376px",
              borderRadius: "188px",
              border: `1.5px solid rgba(212,175,106,0.30)`,
              display: "flex",
            }}
          />

          {/* Portrait Container */}
          <div
            style={{
              width: "340px",
              height: "340px",
              borderRadius: "170px",
              overflow: "hidden",
              border: `6px solid ${GOLD_PRIMARY}`,
              boxShadow: `0 20px 50px rgba(0,0,0,0.6), 0 0 40px rgba(212,175,106,0.25)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#101D38",
            }}
          >
            {carerPhotoData ? (
              <img
                src={carerPhotoData}
                width={340}
                height={340}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: `rgba(212,175,106,0.15)`,
                }}
              >
                <span
                  style={{
                    fontSize: "120px",
                    color: GOLD_PRIMARY,
                    fontWeight: 600,
                    display: "flex",
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                  }}
                >
                  {initialLetter}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ── Ultra-Thick Luxury Curved Gold & Cream Separator Ribbon ── */}
        <div
          style={{
            position: "absolute",
            bottom: `${FOOTER_H - 15}px`,
            left: 0,
            width: "1200px",
            height: `${WAVE_H}px`,
            display: "flex",
          }}
        >
          <svg
            width="1200"
            height={WAVE_H}
            viewBox={`0 0 1200 ${WAVE_H}`}
            fill="none"
            style={{ width: "1200px", height: `${WAVE_H}px`, display: "flex" }}
          >
            {/* 1. Warm ivory foundation smoothly extending beneath all ribbons into footer */}
            <path
              d="M 0,105 C 220,118 420,112 620,90 C 760,70 880,48 980,48 C 1070,48 1140,64 1200,78 L 1200,180 L 0,180 Z"
              fill={CREAM_BG}
            />

            {/* 2. Secondary wide gold ribbon swoosh (sweeps boldly under portrait from center to right) */}
            <path
              d="M 480,108 C 650,92 820,74 980,74 C 1080,74 1140,90 1200,106 L 1200,165 C 1140,145 1070,128 980,128 C 820,128 650,146 480,156 Z"
              fill="#B99150"
            />
            {/* Secondary swoosh inner champagne highlight stroke */}
            <path
              d="M 480,114 C 650,98 820,80 980,80 C 1080,80 1140,96 1200,112"
              stroke="#E8D09A"
              strokeWidth="5"
              fill="none"
            />
            {/* Secondary swoosh bottom definition stroke */}
            <path
              d="M 480,156 C 650,146 820,128 980,128 C 1070,128 1140,145 1200,165"
              stroke="#8B6628"
              strokeWidth="4"
              fill="none"
            />

            {/* 3. Primary ultra-thick luxury gold ribbon body (spans entire 1200px width, 52px-55px thick) */}
            <path
              d="M 0,95 C 220,108 420,104 620,80 C 760,60 880,42 980,42 C 1070,42 1140,58 1200,72 L 1200,125 C 1140,108 1070,95 980,95 C 880,95 760,115 620,132 C 420,154 220,158 0,148 Z"
              fill={GOLD_PRIMARY}
            />

            {/* 4. Radiant champagne metallic highlight along primary ribbon crest */}
            <path
              d="M 0,95 C 220,108 420,104 620,80 C 760,60 880,42 980,42 C 1070,42 1140,58 1200,72"
              stroke="#FFF3D6"
              strokeWidth="6"
              fill="none"
            />

            {/* 5. Middle warm champagne luster accent inside primary ribbon */}
            <path
              d="M 0,118 C 220,130 420,126 620,102 C 760,82 880,65 980,65 C 1070,65 1140,80 1200,95"
              stroke="#E8D09A"
              strokeWidth="4.5"
              fill="none"
            />

            {/* 6. Lower warm gold luster accent inside primary ribbon */}
            <path
              d="M 0,132 C 220,142 420,138 620,116 C 760,98 880,80 980,80 C 1070,80 1140,94 1200,110"
              stroke="#F5DEAB"
              strokeWidth="3"
              fill="none"
            />

            {/* 7. Rich antique gold bottom contour line */}
            <path
              d="M 0,148 C 220,158 420,154 620,132 C 760,115 880,95 980,95 C 1070,95 1140,108 1200,125"
              stroke="#8E6726"
              strokeWidth="4"
              fill="none"
            />
          </svg>
        </div>

        {/* ── Bottom Contact Footer (Warm Ivory) ── */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "1200px",
            height: `${FOOTER_H}px`,
            backgroundColor: CREAM_BG,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 28px",
          }}
        >
          {/* Contact 1: Call our office */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              flex: 1,
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "82px",
                height: "82px",
                borderRadius: "41px",
                backgroundColor: "#EDE3CC",
                border: `3.5px solid ${GOLD_PRIMARY}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "16px",
                boxShadow: "0 4px 14px rgba(185, 145, 80, 0.22)",
              }}
            >
              <svg
                width="44"
                height="44"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#7A561E"
                strokeWidth="2.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  fontSize: "22px",
                  color: "#382F22",
                  fontWeight: 600,
                  display: "flex",
                  fontFamily: "'Montserrat', sans-serif",
                }}
              >
                Call our office
              </span>
              <span
                style={{
                  fontSize: "30px",
                  color: "#0A0806",
                  fontWeight: 700,
                  marginTop: "3px",
                  display: "flex",
                  fontFamily: "'Montserrat', sans-serif",
                }}
              >
                020 4524 0108
              </span>
            </div>
          </div>

          {/* Vertical gold divider */}
          <div
            style={{
              width: "2.5px",
              height: "92px",
              backgroundColor: GOLD_PRIMARY,
              opacity: 0.65,
              display: "flex",
            }}
          />

          {/* Contact 2: WhatsApp us */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              flex: 1,
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "82px",
                height: "82px",
                borderRadius: "41px",
                backgroundColor: "#EDE3CC",
                border: `3.5px solid ${GOLD_PRIMARY}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "16px",
                boxShadow: "0 4px 14px rgba(185, 145, 80, 0.22)",
              }}
            >
              <svg
                width="44"
                height="44"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#7A561E"
                strokeWidth="2.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  fontSize: "22px",
                  color: "#382F22",
                  fontWeight: 600,
                  display: "flex",
                  fontFamily: "'Montserrat', sans-serif",
                }}
              >
                WhatsApp us
              </span>
              <span
                style={{
                  fontSize: "30px",
                  color: "#0A0806",
                  fontWeight: 700,
                  marginTop: "3px",
                  display: "flex",
                  fontFamily: "'Montserrat', sans-serif",
                }}
              >
                +44 7462 931949
              </span>
            </div>
          </div>

          {/* Vertical gold divider */}
          <div
            style={{
              width: "2.5px",
              height: "92px",
              backgroundColor: GOLD_PRIMARY,
              opacity: 0.65,
              display: "flex",
            }}
          />

          {/* Contact 3: Visit our website */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              flex: 1,
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "82px",
                height: "82px",
                borderRadius: "41px",
                backgroundColor: "#EDE3CC",
                border: `3.5px solid ${GOLD_PRIMARY}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "16px",
                boxShadow: "0 4px 14px rgba(185, 145, 80, 0.22)",
              }}
            >
              <svg
                width="44"
                height="44"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#7A561E"
                strokeWidth="2.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  fontSize: "22px",
                  color: "#382F22",
                  fontWeight: 600,
                  display: "flex",
                  fontFamily: "'Montserrat', sans-serif",
                }}
              >
                Visit our website
              </span>
              <span
                style={{
                  fontSize: "26px",
                  color: "#0A0806",
                  fontWeight: 700,
                  marginTop: "3px",
                  display: "flex",
                  fontFamily: "'Montserrat', sans-serif",
                }}
              >
                graceandgoodwill.co.uk
              </span>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: fonts.length > 0 ? fonts : undefined,
    }
  );
}
