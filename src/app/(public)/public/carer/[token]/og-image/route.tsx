import React from "react";
import { ImageResponse } from "next/og";
import fs from "fs";
import path from "path";
import sharp from "sharp";

export const runtime = "nodejs";

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

// In-memory cache for rendered image buffers (keyed by token)
const imageCache = new Map<
  string,
  { buffer: Buffer; expiresAt: number; contentType: string }
>();

export async function GET(request: Request, { params }: Props) {
  const { token } = await params;
  const { searchParams } = new URL(request.url);
  const isJpeg =
    searchParams.get("format") === "jpeg" ||
    searchParams.get("format") === "jpg" ||
    searchParams.get("ext") === ".jpg" ||
    searchParams.get("ext") === ".jpeg";
  const targetContentType = isJpeg ? "image/jpeg" : "image/png";
  const cacheKey = `${token}:${targetContentType}`;

  // Check in-memory cache for instant (<10ms) crawler response
  const now = Date.now();
  const cached = imageCache.get(cacheKey);
  if (cached && cached.expiresAt > now) {
    return new Response(new Uint8Array(cached.buffer), {
      status: 200,
      headers: {
        "Content-Type": cached.contentType,
        "Content-Length": String(cached.buffer.byteLength),
        "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400",
        "X-Cache": "HIT",
      },
    });
  }

  const size = { width: 1200, height: 630 };

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

  // Cache response for 1 day, unless photo was present but temporarily timed out
  const cacheControl =
    photoUrl && !carerPhotoData
      ? "no-cache, no-store, must-revalidate"
      : "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400";

  const responseHeaders = {
    "Content-Type": "image/png",
    "Cache-Control": cacheControl,
  };

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
  const FOOTER_H = 165; // taller footer for readable contacts
  const WAVE_H = 55; // curved gold transition height
  const NAVY_H = 630 - FOOTER_H; // 465px — navy content zone

  const imgResponse = new ImageResponse(
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
            top: "28px",
            left: "52px",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {/* Logo icon */}
          {logoBase64 ? (
            <img
              src={logoBase64}
              width={90}
              height={90}
              style={{ objectFit: "contain", display: "flex" }}
            />
          ) : (
            <div
              style={{
                width: "90px",
                height: "90px",
                backgroundColor: `rgba(212,175,106,0.2)`,
                borderRadius: "12px",
                display: "flex",
              }}
            />
          )}

          {/* Company name + strapline stacked to the right of icon */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginLeft: "16px",
            }}
          >
            <div
              style={{
                fontSize: "26px",
                fontWeight: 600,
                color: GOLD_PRIMARY,
                letterSpacing: "5px",
                display: "flex",
                fontFamily: "'Montserrat', sans-serif",
              }}
            >
              GRACE &amp; GOODWILL
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginTop: "5px",
              }}
            >
              <div
                style={{
                  width: "28px",
                  height: "1px",
                  backgroundColor: `rgba(212,175,106,0.6)`,
                  display: "flex",
                }}
              />
              <span
                style={{
                  fontSize: "12px",
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
                  width: "28px",
                  height: "1px",
                  backgroundColor: `rgba(212,175,106,0.6)`,
                  display: "flex",
                }}
              />
            </div>
          </div>
        </div>

        {/* ── Middle-Left: "CARE YOU CAN TRUST" + Carer name + role + description ── */}
        <div
          style={{
            position: "absolute",
            top: "142px",
            left: "52px",
            width: "650px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* "CARE YOU CAN TRUST" tagline */}
          <div
            style={{
              fontSize: "18px",
              color: GOLD_PRIMARY,
              letterSpacing: "5px",
              fontWeight: 600,
              marginBottom: "8px",
              display: "flex",
              fontFamily: "'Montserrat', sans-serif",
            }}
          >
            CARE YOU CAN TRUST
          </div>

          {/* Carer Name — large, elegant serif */}
          <div
            style={{
              fontSize: "66px",
              fontWeight: 600,
              color: "#FFFFFF",
              lineHeight: 1.05,
              marginBottom: "12px",
              display: "flex",
              fontFamily: "'Cormorant Garamond', Georgia, serif",
            }}
          >
            {safeName}
          </div>

          {/* Professional role with brand highlight */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              flexWrap: "wrap",
              fontSize: "23px",
              marginBottom: "12px",
              fontFamily: "'Montserrat', sans-serif",
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
                marginLeft: "8px",
                display: "flex",
              }}
            >
              Grace &amp; Goodwill
            </span>
          </div>

          {/* Description preview */}
          <div
            style={{
              fontSize: "17px",
              color: "rgba(255, 255, 255, 0.65)",
              lineHeight: 1.45,
              maxWidth: "560px",
              fontWeight: 500,
              display: "flex",
              fontFamily: "'Montserrat', sans-serif",
            }}
          >
            View experience, video, skills, spoken languages, availability and more.
          </div>
        </div>

        {/* ── Right Side: Circular Carer Photo with Gold Border ── */}
        <div
          style={{
            position: "absolute",
            top: "50px",
            right: "90px",
            width: "320px",
            height: "320px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Outer glow ring */}
          <div
            style={{
              position: "absolute",
              width: "340px",
              height: "340px",
              borderRadius: "170px",
              border: `1.5px solid rgba(212,175,106,0.30)`,
              display: "flex",
            }}
          />

          {/* Portrait Container */}
          <div
            style={{
              width: "310px",
              height: "310px",
              borderRadius: "155px",
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
                width={310}
                height={310}
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

        {/* ── Curved Gold & Cream Transition between navy and footer ── */}
        <div
          style={{
            position: "absolute",
            bottom: `${FOOTER_H - 8}px`,
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
            {/* Cream fill beneath the curve */}
            <path
              d={`M0,${WAVE_H} L0,30 Q200,8 480,28 Q760,48 1000,18 Q1100,10 1200,14 L1200,${WAVE_H} Z`}
              fill={CREAM_BG}
            />
            {/* Soft gold glow ribbon (wider, lower opacity) */}
            <path
              d="M0,34 Q200,12 480,32 Q760,52 1000,22 Q1100,14 1200,18"
              stroke={`rgba(185,145,80,0.30)`}
              strokeWidth="8"
              fill="none"
            />
            {/* Primary gold ribbon stroke */}
            <path
              d="M0,30 Q200,8 480,28 Q760,48 1000,18 Q1100,10 1200,14"
              stroke={GOLD_PRIMARY}
              strokeWidth="3.5"
              fill="none"
            />
            {/* Light champagne highlight above the gold */}
            <path
              d="M0,27 Q200,5 480,25 Q760,45 1000,15 Q1100,7 1200,11"
              stroke={`rgba(232,208,154,0.35)`}
              strokeWidth="1.5"
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
            justifyContent: "space-around",
            padding: "0 50px",
          }}
        >
          {/* Contact 1: Call our office */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: "58px",
                height: "58px",
                borderRadius: "29px",
                backgroundColor: "#EFE5D2",
                border: `2px solid ${GOLD_LIGHT}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "16px",
              }}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke={GOLD_DARK}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  fontSize: "18px",
                  color: "#6D6355",
                  fontWeight: 500,
                  display: "flex",
                  fontFamily: "'Montserrat', sans-serif",
                }}
              >
                Call our office
              </span>
              <span
                style={{
                  fontSize: "23px",
                  color: "#181512",
                  fontWeight: 600,
                  marginTop: "3px",
                  display: "flex",
                  fontFamily: "'Montserrat', sans-serif",
                }}
              >
                020 4524 0108
              </span>
            </div>
          </div>

          {/* Contact 2: WhatsApp us */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: "58px",
                height: "58px",
                borderRadius: "29px",
                backgroundColor: "#EFE5D2",
                border: `2px solid ${GOLD_LIGHT}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "16px",
              }}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke={GOLD_DARK}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  fontSize: "18px",
                  color: "#6D6355",
                  fontWeight: 500,
                  display: "flex",
                  fontFamily: "'Montserrat', sans-serif",
                }}
              >
                WhatsApp us
              </span>
              <span
                style={{
                  fontSize: "23px",
                  color: "#181512",
                  fontWeight: 600,
                  marginTop: "3px",
                  display: "flex",
                  fontFamily: "'Montserrat', sans-serif",
                }}
              >
                +44 7462 931949
              </span>
            </div>
          </div>

          {/* Contact 3: Visit our website */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: "58px",
                height: "58px",
                borderRadius: "29px",
                backgroundColor: "#EFE5D2",
                border: `2px solid ${GOLD_LIGHT}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "16px",
              }}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke={GOLD_DARK}
                strokeWidth="2"
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
                  fontSize: "18px",
                  color: "#6D6355",
                  fontWeight: 500,
                  display: "flex",
                  fontFamily: "'Montserrat', sans-serif",
                }}
              >
                Visit our website
              </span>
              <span
                style={{
                  fontSize: "21px",
                  color: "#181512",
                  fontWeight: 600,
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
      headers: responseHeaders,
      fonts: fonts.length > 0 ? fonts : undefined,
    }
  );

  const arrayBuffer = await imgResponse.arrayBuffer();
  const rawBuffer = Buffer.from(arrayBuffer);

  // Compress using sharp to keep payload well under WhatsApp's 300 KB limit (< 250 KB)
  let buffer: Buffer = rawBuffer;
  let finalContentType = "image/png";

  try {
    if (isJpeg) {
      buffer = await sharp(rawBuffer).jpeg({ quality: 90, mozjpeg: true }).toBuffer();
      finalContentType = "image/jpeg";
    } else {
      // 8-bit palette quantization shrinks 1200x630 PNG from ~639 KB down to ~135 KB while preserving crisp text & branding
      buffer = await sharp(rawBuffer)
        .png({ palette: true, quality: 90, compressionLevel: 9 })
        .toBuffer();
      finalContentType = "image/png";
    }
  } catch (err) {
    console.warn("Failed to compress OG image with sharp, serving raw buffer:", err);
  }

  // Store in in-memory cache for 1 hour
  if (carerPhotoData || !photoUrl) {
    imageCache.set(cacheKey, {
      buffer,
      expiresAt: now + 3600_000,
      contentType: finalContentType,
    });
  }

  return new Response(new Uint8Array(buffer), {
    status: 200,
    headers: {
      ...responseHeaders,
      "Content-Type": finalContentType,
      "Content-Length": String(buffer.byteLength),
      "X-Cache": "MISS",
    },
  });
}

export async function HEAD(request: Request, { params }: Props) {
  const getResponse = await GET(request, { params });
  return new Response(null, {
    status: getResponse.status,
    headers: getResponse.headers,
  });
}
