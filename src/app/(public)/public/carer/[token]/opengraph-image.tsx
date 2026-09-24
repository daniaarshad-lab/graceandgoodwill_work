import { ImageResponse } from "next/og";
import shareableProfileService from "@/services/carer/shareableProfile.service";

export const runtime = "nodejs";
export const revalidate = 3600; // cache for 1 hour

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface Props {
  params: Promise<{ token: string }>;
}

export default async function Image({ params }: Props) {
  const { token } = await params;

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://graceandgoodwill.co.uk";

  /* ── Fetch carer data ── */
  let displayName = "";
  let photoUrl: string | null = null;
  let experienceYears: number | null = null;
  let isValid = false;

  try {
    const profile = await shareableProfileService.getPublicProfile(token);
    displayName = profile.displayName;
    photoUrl = profile.photoUrl || null;
    experienceYears = profile.experienceYears ?? null;
    isValid = true;
  } catch {
    isValid = false;
  }

  /* ── Expired / Invalid Link Card ── */
  if (!isValid) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "1200px",
            height: "630px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #0a0f1e 0%, #0d1a35 50%, #0a1228 100%)",
            fontFamily: "Georgia, serif",
          }}
        >
          {/* Gold border frame */}
          <div
            style={{
              position: "absolute",
              inset: "24px",
              border: "1.5px solid rgba(212,159,71,0.4)",
              borderRadius: "16px",
              display: "flex",
            }}
          />
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
            <div style={{ fontSize: "52px", color: "#D4A043", fontWeight: "bold", letterSpacing: "6px" }}>
              GRACE & GOODWILL
            </div>
            <div style={{ fontSize: "18px", color: "rgba(212,159,71,0.6)", letterSpacing: "4px", textTransform: "uppercase" }}>
              Care Defined by Integrity
            </div>
            <div style={{ width: "80px", height: "1px", background: "rgba(212,159,71,0.4)", margin: "8px 0" }} />
            <div style={{ fontSize: "28px", color: "#ffffff", opacity: 0.6 }}>
              This profile link has expired
            </div>
            <div style={{ fontSize: "18px", color: "rgba(255,255,255,0.4)", marginTop: "8px" }}>
              graceandgoodwill.co.uk
            </div>
          </div>
        </div>
      ),
      { ...size }
    );
  }

  /* ── Fetch carer photo as ArrayBuffer for embedding ── */
  let carerPhotoData: string | null = null;
  if (photoUrl) {
    try {
      const res = await fetch(photoUrl, { signal: AbortSignal.timeout(4000) });
      if (res.ok) {
        const buffer = await res.arrayBuffer();
        const base64 = Buffer.from(buffer).toString("base64");
        const mime = res.headers.get("content-type") || "image/jpeg";
        carerPhotoData = `data:${mime};base64,${base64}`;
      }
    } catch {
      carerPhotoData = null;
    }
  }

  /* ── Build experience label ── */
  const expLabel = experienceYears ? `${experienceYears}+ Years Experience` : "Professional Live-In Carer";

  /* ── Main Banner Card ── */
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          fontFamily: "Georgia, 'Times New Roman', serif",
          background: "linear-gradient(135deg, #071020 0%, #0c1a35 40%, #0e2040 70%, #071528 100%)",
        }}
      >
        {/* ── Background texture dots ── */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(circle, rgba(212,159,71,0.06) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            display: "flex",
          }}
        />

        {/* ── Gold border frame ── */}
        <div
          style={{
            position: "absolute",
            inset: "20px",
            border: "1.5px solid rgba(212,159,71,0.5)",
            borderRadius: "16px",
            display: "flex",
          }}
        />

        {/* ── Top gold accent bar ── */}
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "20px",
            right: "20px",
            height: "4px",
            background: "linear-gradient(90deg, transparent, #D4A043, #F8E090, #D4A043, transparent)",
            borderRadius: "2px",
            display: "flex",
          }}
        />

        {/* ── Left content area ── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "52px 48px 52px 52px",
            flex: 1,
            zIndex: 2,
          }}
        >
          {/* Grace & Goodwill branding */}
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <div
              style={{
                fontSize: "34px",
                fontWeight: "bold",
                color: "#D4A043",
                letterSpacing: "3px",
                textTransform: "uppercase",
                display: "flex",
              }}
            >
              GRACE & GOODWILL
            </div>
            <div
              style={{
                fontSize: "13px",
                color: "rgba(212,159,71,0.65)",
                letterSpacing: "3.5px",
                textTransform: "uppercase",
                display: "flex",
              }}
            >
              CARE DEFINED BY INTEGRITY
            </div>
          </div>

          {/* Main headline */}
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div
              style={{
                fontSize: "62px",
                fontWeight: "bold",
                color: "#ffffff",
                lineHeight: 1.1,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <span>CARE YOU</span>
              <span>CAN TRUST</span>
            </div>
            <div
              style={{
                fontSize: "20px",
                color: "rgba(255,255,255,0.6)",
                letterSpacing: "1px",
                display: "flex",
              }}
            >
              Live-in Care Matching Across the UK
            </div>
          </div>

          {/* Carer info strip */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {/* Gold divider */}
            <div
              style={{
                width: "60px",
                height: "2px",
                background: "linear-gradient(90deg, #D4A043, transparent)",
                display: "flex",
                marginBottom: "4px",
              }}
            />
            <div
              style={{
                fontSize: "26px",
                fontWeight: "bold",
                color: "#F8E090",
                display: "flex",
              }}
            >
              {displayName}
            </div>
            <div
              style={{
                fontSize: "16px",
                color: "rgba(255,255,255,0.55)",
                display: "flex",
              }}
            >
              {expLabel} · graceandgoodwill.co.uk
            </div>
          </div>
        </div>

        {/* ── Right: Carer photo ── */}
        <div
          style={{
            width: "340px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 48px 40px 0",
            zIndex: 2,
          }}
        >
          {carerPhotoData ? (
            <div
              style={{
                width: "260px",
                height: "260px",
                borderRadius: "50%",
                overflow: "hidden",
                border: "4px solid #D4A043",
                boxShadow: "0 0 40px rgba(212,159,71,0.35), 0 0 80px rgba(212,159,71,0.15)",
                display: "flex",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={carerPhotoData}
                alt={displayName}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          ) : (
            /* Placeholder circle when no photo */
            <div
              style={{
                width: "260px",
                height: "260px",
                borderRadius: "50%",
                border: "4px solid rgba(212,159,71,0.5)",
                background: "rgba(212,159,71,0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div style={{ fontSize: "80px", display: "flex" }}>👤</div>
            </div>
          )}
        </div>

        {/* ── Bottom gold accent bar ── */}
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            left: "20px",
            right: "20px",
            height: "4px",
            background: "linear-gradient(90deg, transparent, #D4A043, #F8E090, #D4A043, transparent)",
            borderRadius: "2px",
            display: "flex",
          }}
        />

        {/* ── Subtle right-side gradient fade for photo blending ── */}
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: "180px",
            background: "linear-gradient(to right, transparent, rgba(7,16,32,0.4))",
            display: "flex",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
