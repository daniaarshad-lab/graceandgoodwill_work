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

export default async function Image({ params }: Props) {
  const { token } = await params;

  // Read local assets synchronously for 100% reliability
  let bgBase64 = "";
  let logoBase64 = "";
  try {
    const bgBuffer = fs.readFileSync(path.join(process.cwd(), "public", "bg-share-wp.jpeg"));
    bgBase64 = `data:image/jpeg;base64,${bgBuffer.toString("base64")}`;
  } catch (err) {
    console.error("Failed to load bg-share-wp.jpeg:", err);
  }

  try {
    const logoBuffer = fs.readFileSync(path.join(process.cwd(), "public", "website_logo.png"));
    logoBase64 = `data:image/png;base64,${logoBuffer.toString("base64")}`;
  } catch (err) {
    console.error("Failed to load website_logo.png:", err);
  }

  let displayName = "Our Carer";
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

    const res = await fetch(`${apiBase}/api/public/carer/${token}`, {
      signal: AbortSignal.timeout(4000),
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
  const nameParts = displayName ? displayName.split(/\s+/).filter(Boolean) : [];
  const firstName = nameParts.length > 0 ? nameParts[0] : "Our Carer";
  const lastInitial = nameParts.length > 1 ? nameParts[nameParts.length - 1].charAt(0).toUpperCase() : "";
  const safeName = lastInitial && !firstName.endsWith(".") ? `${firstName} ${lastInitial}.` : firstName;
  const initialLetter = safeName.charAt(0).toUpperCase() || "C";

  // Pre-fetch carer photo if available
  let carerPhotoData: string | null = null;
  if (photoUrl) {
    try {
      const photoRes = await fetch(photoUrl, { signal: AbortSignal.timeout(4000) });
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
          backgroundColor: "#070E20",
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
            height: "515px",
            background:
              "linear-gradient(90deg, rgba(6, 13, 30, 0.96) 0%, rgba(6, 13, 30, 0.90) 50%, rgba(6, 13, 30, 0.40) 80%, transparent 100%)",
            display: "flex",
          }}
        />

        {/* Top-Left: Grace & Goodwill Brand Logo + Centered Strapline */}
        <div
          style={{
            position: "absolute",
            top: "32px",
            left: "60px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {logoBase64 ? (
            <img
              src={logoBase64}
              width={62}
              height={62}
              style={{ objectFit: "contain", display: "flex" }}
            />
          ) : (
            <div
              style={{
                width: "62px",
                height: "62px",
                backgroundColor: "rgba(212,175,55,0.2)",
                borderRadius: "12px",
                display: "flex",
              }}
            />
          )}

          <div
            style={{
              fontSize: "22px",
              fontWeight: "bold",
              color: "#E2BA55",
              letterSpacing: "4px",
              marginTop: "8px",
              display: "flex",
            }}
          >
            GRACE &amp; GOODWILL
          </div>

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
                backgroundColor: "rgba(226, 186, 85, 0.65)",
                display: "flex",
              }}
            />
            <span
              style={{
                fontSize: "10px",
                color: "#E2BA55",
                letterSpacing: "2.5px",
                fontWeight: "600",
                display: "flex",
              }}
            >
              CARE DEFINED BY INTEGRITY
            </span>
            <div
              style={{
                width: "24px",
                height: "1px",
                backgroundColor: "rgba(226, 186, 85, 0.65)",
                display: "flex",
              }}
            />
          </div>
        </div>

        {/* Middle-Left: Carer Details */}
        <div
          style={{
            position: "absolute",
            top: "192px",
            left: "60px",
            width: "660px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Discreet Tagline */}
          <div
            style={{
              fontSize: "15px",
              color: "#D4AF37",
              letterSpacing: "4.5px",
              fontWeight: "600",
              marginBottom: "8px",
              display: "flex",
            }}
          >
            CARE YOU CAN TRUST
          </div>

          {/* Carer Name */}
          <div
            style={{
              fontSize: "68px",
              fontWeight: "bold",
              color: "#FFFFFF",
              lineHeight: 1.05,
              marginBottom: "12px",
              display: "flex",
            }}
          >
            {safeName}
          </div>

          {/* Role with Brand */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: "22px",
              marginBottom: "14px",
            }}
          >
            <span
              style={{
                color: "rgba(255, 255, 255, 0.88)",
                display: "flex",
              }}
            >
              Professional Live-in Carer with
            </span>
            <span
              style={{
                color: "#E2BA55",
                fontWeight: "bold",
                marginLeft: "8px",
                display: "flex",
              }}
            >
              Grace &amp; Goodwill
            </span>
          </div>

          {/* Subtle description preview */}
          <div
            style={{
              fontSize: "16px",
              color: "rgba(255, 255, 255, 0.55)",
              lineHeight: 1.45,
              maxWidth: "560px",
              display: "flex",
            }}
          >
            View experience, video, skills, spoken languages, availability and more.
          </div>
        </div>

        {/* Right Side: Circular Carer Photo with Rich Gold Border */}
        <div
          style={{
            position: "absolute",
            top: "65px",
            right: "110px",
            width: "310px",
            height: "310px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Outer glow ring */}
          <div
            style={{
              position: "absolute",
              width: "330px",
              height: "330px",
              borderRadius: "165px",
              border: "1px solid rgba(226, 186, 85, 0.25)",
              display: "flex",
            }}
          />

          {/* Portrait Container */}
          <div
            style={{
              width: "300px",
              height: "300px",
              borderRadius: "150px",
              overflow: "hidden",
              border: "6px solid #D4AF37",
              boxShadow: "0 20px 50px rgba(0,0,0,0.6), 0 0 40px rgba(212,175,55,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#101D38",
            }}
          >
            {carerPhotoData ? (
              <img
                src={carerPhotoData}
                width={300}
                height={300}
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
                  backgroundColor: "rgba(226, 186, 85, 0.15)",
                }}
              >
                <span
                  style={{
                    fontSize: "110px",
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

        {/* Golden Wave Transition Ribbon above bottom bar */}
        <div
          style={{
            position: "absolute",
            bottom: "118px",
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
              fill="#FAF7F2"
            />
            {/* Lower golden accent glow ribbon */}
            <path
              d="M0,28 Q320,10 660,30 T1200,14"
              stroke="rgba(212, 175, 55, 0.35)"
              strokeWidth="6"
              fill="none"
            />
            {/* Primary Golden swoosh ribbon stroke */}
            <path
              d="M0,24 Q320,6 660,26 T1200,10"
              stroke="#D4AF37"
              strokeWidth="3.5"
              fill="none"
            />
          </svg>
        </div>

        {/* Bottom Contact Bar (Off-white / Warm Cream #FAF7F2) */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "1200px",
            height: "120px",
            backgroundColor: "#FAF7F2",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
            padding: "0 60px",
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
                marginRight: "16px",
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
                  fontSize: "13px",
                  color: "#6D6355",
                  fontWeight: 500,
                  display: "flex",
                }}
              >
                Call our office
              </span>
              <span
                style={{
                  fontSize: "19px",
                  color: "#181512",
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
                marginRight: "16px",
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
                  fontSize: "13px",
                  color: "#6D6355",
                  fontWeight: 500,
                  display: "flex",
                }}
              >
                WhatsApp us
              </span>
              <span
                style={{
                  fontSize: "19px",
                  color: "#181512",
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
                marginRight: "16px",
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
                  fontSize: "13px",
                  color: "#6D6355",
                  fontWeight: 500,
                  display: "flex",
                }}
              >
                Visit our website
              </span>
              <span
                style={{
                  fontSize: "19px",
                  color: "#181512",
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
