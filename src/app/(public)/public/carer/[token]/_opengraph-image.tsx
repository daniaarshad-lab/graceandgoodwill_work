import { ImageResponse } from "next/og";

export const runtime = "edge";

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

  /* ── Fetch carer data directly (edge-compatible) ── */
  let displayName = "";
  let photoUrl: string | null = null;
  let experienceYears: number | null = null;
  let isValid = false;

  try {
    const apiBase = (
      process.env.NEXT_PUBLIC_API_URL ||
      `${appUrl}/api`
    )
      .replace(/\/+$/, "")
      .replace(/\/api\/?$/, "");
    const res = await fetch(`${apiBase}/api/public/carer/${token}`, {
      signal: AbortSignal.timeout(5000),
    });
    if (res.ok) {
      const profile = await res.json();
      displayName = profile.displayName || "";
      photoUrl = profile.photoUrl || null;
      experienceYears = profile.experienceYears ?? null;
      isValid = true;
    }
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

  /* ── Fetch carer photo as base64 for embedding ── */
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

  /* ── Main Banner Card (1200x630 Large Hero Format for WhatsApp) ── */
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
          background: "linear-gradient(135deg, #050b14 0%, #091722 35%, #0c201e 70%, #061017 100%)",
        }}
      >
        {/* ── London skyline silhouette with illuminated Big Ben ── */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "240px",
            display: "flex",
            opacity: 0.18,
          }}
        >
          <svg width="1200" height="240" viewBox="0 0 1200 360" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="skylineGold" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F5D384" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#7A5212" stopOpacity="0.2" />
              </linearGradient>
            </defs>

            <rect x="20" y="240" width="70" height="120" fill="url(#skylineGold)" />
            <rect x="105" y="210" width="85" height="150" fill="url(#skylineGold)" />
            <polygon points="147,160 105,210 190,210" fill="url(#skylineGold)" />
            <rect x="205" y="250" width="60" height="110" fill="url(#skylineGold)" />
            <rect x="280" y="220" width="90" height="140" fill="url(#skylineGold)" />
            <polygon points="325,185 280,220 370,220" fill="url(#skylineGold)" />

            <rect x="385" y="235" width="130" height="125" fill="url(#skylineGold)" />
            <polygon points="410,210 395,235 425,235" fill="url(#skylineGold)" />
            <polygon points="450,205 435,235 465,235" fill="url(#skylineGold)" />
            <polygon points="490,210 475,235 505,235" fill="url(#skylineGold)" />

            {/* Big Ben Tower */}
            <rect x="525" y="70" width="56" height="290" fill="url(#skylineGold)" />
            <rect x="515" y="60" width="76" height="18" fill="url(#skylineGold)" />
            <polygon points="553,8 515,60 591,60" fill="url(#skylineGold)" />
            <circle cx="553" cy="98" r="16" fill="#FFF4D0" />
            <circle cx="553" cy="98" r="14" fill="#E2BD6E" />
            <circle cx="553" cy="98" r="3" fill="#3D2905" />

            <rect x="595" y="225" width="120" height="135" fill="url(#skylineGold)" />
            <polygon points="625,195 605,225 645,225" fill="url(#skylineGold)" />
            <polygon points="685,195 665,225 705,225" fill="url(#skylineGold)" />

            <rect x="940" y="85" width="48" height="275" fill="url(#skylineGold)" />
            <polygon points="964,28 935,85 993,85" fill="url(#skylineGold)" />
            <circle cx="964" cy="112" r="12" fill="#FFF4D0" />

            <rect x="1005" y="210" width="80" height="150" fill="url(#skylineGold)" />
            <rect x="1100" y="240" width="80" height="120" fill="url(#skylineGold)" />
          </svg>
        </div>

        {/* ── Glowing golden swoosh curve ── */}
        <div
          style={{
            position: "absolute",
            bottom: "82px",
            left: "-40px",
            width: "1280px",
            height: "2.5px",
            background: "linear-gradient(90deg, transparent 0%, rgba(226,189,110,0.2) 15%, #F5D384 60%, rgba(226,189,110,0.6) 85%, transparent 100%)",
            transform: "rotate(-1.2deg)",
            display: "flex",
          }}
        />

        {/* ── Outer gold frame ── */}
        <div
          style={{
            position: "absolute",
            inset: "20px",
            border: "1.5px solid rgba(226, 189, 110, 0.45)",
            borderRadius: "16px",
            display: "flex",
          }}
        />

        {/* ── Top gold gradient accent bar ── */}
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "20px",
            right: "20px",
            height: "3px",
            background: "linear-gradient(90deg, transparent, #E2BD6E, #FFF2D6, #E2BD6E, transparent)",
            borderRadius: "2px",
            display: "flex",
          }}
        />

        {/* ── Bottom gold gradient accent bar ── */}
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            left: "20px",
            right: "20px",
            height: "3px",
            background: "linear-gradient(90deg, transparent, #E2BD6E, #FFF2D6, #E2BD6E, transparent)",
            borderRadius: "2px",
            display: "flex",
          }}
        />

        {/* ── Left Content: Branding + Headline + Carer strip ── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "50px 40px 50px 52px",
            flex: 1,
            zIndex: 2,
          }}
        >
          {/* Logo Knot + Brand Name & Strapline */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <svg width="48" height="48" viewBox="0 0 100 100" fill="none">
              <defs>
                <linearGradient id="goldKnot" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#FFF2D6" />
                  <stop offset="40%" stopColor="#E2BD6E" />
                  <stop offset="80%" stopColor="#C8963E" />
                  <stop offset="100%" stopColor="#8C6219" />
                </linearGradient>
              </defs>
              <rect
                x="18"
                y="33"
                width="64"
                height="34"
                rx="17"
                stroke="url(#goldKnot)"
                strokeWidth="8.5"
                fill="none"
                transform="rotate(-28 50 50)"
              />
              <rect
                x="18"
                y="33"
                width="64"
                height="34"
                rx="17"
                stroke="url(#goldKnot)"
                strokeWidth="8.5"
                fill="none"
                transform="rotate(62 50 50)"
              />
            </svg>

            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <div
                style={{
                  fontSize: "26px",
                  fontWeight: "bold",
                  color: "#E2BD6E",
                  letterSpacing: "4px",
                  textTransform: "uppercase",
                  display: "flex",
                }}
              >
                GRACE &amp; GOODWILL
              </div>
              <div
                style={{
                  fontSize: "11.5px",
                  color: "rgba(226, 189, 110, 0.75)",
                  letterSpacing: "3.5px",
                  textTransform: "uppercase",
                  display: "flex",
                }}
              >
                CARE DEFINED BY INTEGRITY
              </div>
            </div>
          </div>

          {/* Main Headline */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "24px" }}>
            <div
              style={{
                fontSize: "64px",
                fontWeight: "bold",
                color: "#ffffff",
                lineHeight: 1.08,
                display: "flex",
                flexDirection: "column",
                textShadow: "0 2px 6px rgba(0,0,0,0.9)",
                fontFamily: "Georgia, serif",
              }}
            >
              <span style={{ display: "flex", letterSpacing: "1px" }}>CARE YOU</span>
              <span style={{ display: "flex", letterSpacing: "1px" }}>CAN TRUST</span>
            </div>
            <div
              style={{
                fontSize: "20px",
                color: "#E2BD6E",
                letterSpacing: "0.6px",
                display: "flex",
              }}
            >
              Live-in Care Matching Across the UK
            </div>
          </div>

          {/* Carer details */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <div
              style={{
                width: "60px",
                height: "2px",
                background: "linear-gradient(90deg, #E2BD6E, transparent)",
                display: "flex",
                marginBottom: "4px",
              }}
            />
            <div
              style={{
                fontSize: "26px",
                fontWeight: "bold",
                color: "#FFF2D6",
                display: "flex",
              }}
            >
              {displayName}
            </div>
            <div
              style={{
                fontSize: "15px",
                color: "rgba(255,255,255,0.6)",
                display: "flex",
              }}
            >
              {expLabel} · graceandgoodwill.co.uk
            </div>
          </div>
        </div>

        {/* ── Right: Carer photo + script strapline ── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 60px 40px 0",
            zIndex: 3,
          }}
        >
          {/* Circular carer photo with golden ring */}
          <div
            style={{
              width: "270px",
              height: "270px",
              borderRadius: "50%",
              overflow: "hidden",
              border: "5px solid #F3CF7A",
              boxShadow: "0 0 16px rgba(226, 189, 110, 0.5)",
              display: "flex",
              background: "#08131d",
            }}
          >
            {carerPhotoData ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={carerPhotoData}
                alt={displayName}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "88px",
                }}
              >
                👤
              </div>
            )}
          </div>

          {/* Cursive script strapline matching mockup */}
          <div
            style={{
              marginTop: "16px",
              fontSize: "23px",
              fontFamily: "cursive, Georgia, serif",
              fontStyle: "italic",
              color: "#F6D688",
              letterSpacing: "0.5px",
              textShadow: "0 2px 4px rgba(0,0,0,0.9)",
              display: "flex",
            }}
          >
            People Make Brighter Tomorrows
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
