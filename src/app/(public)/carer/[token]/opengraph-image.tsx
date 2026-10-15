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

  /* ------------------------------------------------------------------ */
  /*  Brand colour palette (from spec §7.1)                             */
  /*  Gold:  #D4AF6A (primary) / #B99150 (dark) / #E8D09A (light)      */
  /*  Navy:  #09142B                                                     */
  /*  Ivory: #F8F5EE                                                     */
  /* ------------------------------------------------------------------ */

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          fontFamily: "Georgia, serif",
          backgroundColor: "#09142B",
        }}
      >
        {/* Background Image – shifted right to reduce blank navy on left */}
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

        {/* Navy overlay – lighter, covering only the left content area */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "700px",
            height: "490px",
            background:
              "linear-gradient(90deg, rgba(9,20,43,0.95) 0%, rgba(9,20,43,0.88) 55%, rgba(9,20,43,0.35) 85%, transparent 100%)",
            display: "flex",
          }}
        />

        {/* ============================================================ */}
        {/*  TOP-LEFT: Logo + brand name + strapline                     */}
        {/* ============================================================ */}
        <div
          style={{
            position: "absolute",
            top: "28px",
            left: "48px",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {/* Original G&G gold knot logo – larger for legibility */}
          {logoBase64 ? (
            <img
              src={logoBase64}
              width={72}
              height={72}
              style={{ objectFit: "contain", display: "flex" }}
            />
          ) : (
            <div
              style={{
                width: "72px",
                height: "72px",
                backgroundColor: "rgba(212,175,55,0.2)",
                borderRadius: "12px",
                display: "flex",
              }}
            />
          )}

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginLeft: "16px",
            }}
          >
            {/* Brand name */}
            <div
              style={{
                fontSize: "24px",
                fontWeight: 700,
                color: "#D4AF6A",
                letterSpacing: "4px",
                display: "flex",
              }}
            >
              GRACE &amp; GOODWILL
            </div>

            {/* Strapline – larger and more readable */}
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
                  width: "24px",
                  height: "1px",
                  backgroundColor: "rgba(212,175,106,0.5)",
                  display: "flex",
                }}
              />
              <span
                style={{
                  fontSize: "12px",
                  color: "#E8D09A",
                  letterSpacing: "3px",
                  fontWeight: 500,
                  display: "flex",
                }}
              >
                CARE DEFINED BY INTEGRITY
              </span>
              <div
                style={{
                  width: "24px",
                  height: "1px",
                  backgroundColor: "rgba(212,175,106,0.5)",
                  display: "flex",
                }}
              />
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/*  LEFT CONTENT: Trust line  +  Carer Name  +  Description     */}
        {/* ============================================================ */}
        <div
          style={{
            position: "absolute",
            top: "145px",
            left: "52px",
            width: "580px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* "CARE YOU CAN TRUST" — prominent trust line (spec: 19–21px) */}
          <div
            style={{
              fontSize: "20px",
              color: "#D4AF6A",
              letterSpacing: "5px",
              fontWeight: 700,
              marginBottom: "12px",
              display: "flex",
            }}
          >
            CARE YOU CAN TRUST
          </div>

          {/* Carer Name — large and bold (spec: 65–72px) */}
          <div
            style={{
              fontSize: "68px",
              fontWeight: 700,
              color: "#FFFFFF",
              lineHeight: 1.08,
              marginBottom: "14px",
              display: "flex",
            }}
          >
            {safeName}
          </div>

          {/* Professional description (spec: 25–28px) */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              lineHeight: 1.3,
            }}
          >
            <span
              style={{
                fontSize: "26px",
                color: "rgba(255,255,255,0.92)",
                fontWeight: 500,
                display: "flex",
              }}
            >
              Professional Live-in Carer with
            </span>
            <span
              style={{
                fontSize: "26px",
                color: "#D4AF6A",
                fontWeight: 700,
                marginTop: "4px",
                display: "flex",
              }}
            >
              Grace &amp; Goodwill
            </span>
          </div>
        </div>

        {/* ============================================================ */}
        {/*  RIGHT: Circular Carer Portrait with gold border             */}
        {/* ============================================================ */}
        <div
          style={{
            position: "absolute",
            top: "50px",
            right: "70px",
            width: "340px",
            height: "340px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Outer glow ring */}
          <div
            style={{
              position: "absolute",
              width: "356px",
              height: "356px",
              borderRadius: "178px",
              border: "1.5px solid rgba(212,175,106,0.25)",
              display: "flex",
            }}
          />

          {/* Portrait container – gold border */}
          <div
            style={{
              width: "320px",
              height: "320px",
              borderRadius: "160px",
              overflow: "hidden",
              border: "5px solid #D4AF6A",
              boxShadow: "0 16px 44px rgba(0,0,0,0.55), 0 0 30px rgba(212,175,106,0.20)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#101D38",
            }}
          >
            {carerPhotoData ? (
              <img
                src={carerPhotoData}
                width={320}
                height={320}
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
                  backgroundColor: "rgba(226,186,85,0.15)",
                }}
              >
                <span
                  style={{
                    fontSize: "100px",
                    color: "#E2BA55",
                    fontWeight: "bold",
                    display: "flex",
                  }}
                >
                  {initialLetter}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ============================================================ */}
        {/*  Curved gold / cream separator ribbon                        */}
        {/* ============================================================ */}
        <div
          style={{
            position: "absolute",
            bottom: "138px",
            left: 0,
            width: "1200px",
            height: "44px",
            display: "flex",
          }}
        >
          <svg
            width="1200"
            height="44"
            viewBox="0 0 1200 44"
            fill="none"
            style={{ width: "1200px", height: "44px", display: "flex" }}
          >
            {/* Smooth curved cream background layer */}
            <path
              d="M0,44 L0,24 Q320,6 660,26 T1200,10 L1200,44 Z"
              fill="#F8F5EE"
            />
            {/* Lower golden accent glow ribbon */}
            <path
              d="M0,28 Q320,10 660,30 T1200,14"
              stroke="rgba(212,175,55,0.35)"
              strokeWidth="6"
              fill="none"
            />
            {/* Primary golden swoosh stroke */}
            <path
              d="M0,24 Q320,6 660,26 T1200,10"
              stroke="#D4AF37"
              strokeWidth="3.5"
              fill="none"
            />
          </svg>
        </div>

        {/* ============================================================ */}
        {/*  Bottom Contact Bar – taller ivory bar with bigger text      */}
        {/*  (spec: labels 17–19px, numbers 22–24px, website 20–22px)   */}
        {/* ============================================================ */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "1200px",
            height: "142px",
            backgroundColor: "#F8F5EE",
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
                width: "52px",
                height: "52px",
                borderRadius: "26px",
                backgroundColor: "#EFE5D2",
                border: "1.5px solid #DECBB1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "14px",
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#7A5619"
                strokeWidth="2.2"
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
                }}
              >
                Call our office
              </span>
              <span
                style={{
                  fontSize: "23px",
                  color: "#09142B",
                  fontWeight: "bold",
                  marginTop: "2px",
                  display: "flex",
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
                width: "52px",
                height: "52px",
                borderRadius: "26px",
                backgroundColor: "#EFE5D2",
                border: "1.5px solid #DECBB1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "14px",
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#7A5619"
                strokeWidth="2.2"
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
                }}
              >
                WhatsApp us
              </span>
              <span
                style={{
                  fontSize: "23px",
                  color: "#09142B",
                  fontWeight: "bold",
                  marginTop: "2px",
                  display: "flex",
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
                width: "52px",
                height: "52px",
                borderRadius: "26px",
                backgroundColor: "#EFE5D2",
                border: "1.5px solid #DECBB1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "14px",
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#7A5619"
                strokeWidth="2.2"
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
                }}
              >
                Visit our website
              </span>
              <span
                style={{
                  fontSize: "22px",
                  color: "#09142B",
                  fontWeight: "bold",
                  marginTop: "2px",
                  display: "flex",
                }}
              >
                graceandgoodwill.co.uk
              </span>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
