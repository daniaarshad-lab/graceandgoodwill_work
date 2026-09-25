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
          background: "linear-gradient(145deg, #061410 0%, #091c13 30%, #0c2418 55%, #0e2d1e 75%, #071812 100%)",
        }}
      >
        {/* ── Subtle dot texture ── */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(circle, rgba(212,159,71,0.05) 1px, transparent 1px)",
            backgroundSize: "30px 30px",
            display: "flex",
          }}
        />

        {/* ── London skyline silhouette ── */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "220px",
            display: "flex",
            opacity: 0.12,
          }}
        >
          <svg width="1200" height="220" viewBox="0 0 1200 220" xmlns="http://www.w3.org/2000/svg">
            {/* Big Ben tower */}
            <rect x="148" y="18" width="36" height="202" fill="#D4A043"/>
            <rect x="140" y="12" width="52" height="18" fill="#D4A043"/>
            <polygon points="166,0 140,12 192,12" fill="#D4A043"/>
            <rect x="152" y="30" width="28" height="28" fill="#0c2418"/>
            <circle cx="166" cy="44" r="10" fill="none" stroke="#D4A043" strokeWidth="2"/>
            {/* Westminster */}
            <rect x="95" y="90" width="110" height="130" fill="#D4A043"/>
            <rect x="88" y="82" width="124" height="14" fill="#D4A043"/>
            {/* Buildings left */}
            <rect x="30" y="130" width="58" height="90" fill="#D4A043"/>
            <rect x="24" y="124" width="70" height="10" fill="#D4A043"/>
            <rect x="220" y="110" width="72" height="110" fill="#D4A043"/>
            <rect x="305" y="135" width="55" height="85" fill="#D4A043"/>
            {/* Shard-like */}
            <polygon points="400,60 415,220 385,220" fill="#D4A043"/>
            <rect x="430" y="100" width="65" height="120" fill="#D4A043"/>
            <rect x="505" y="125" width="48" height="95" fill="#D4A043"/>
            <rect x="560" y="140" width="75" height="80" fill="#D4A043"/>
            {/* Gherkin shape */}
            <rect x="645" y="80" width="44" height="140" fill="#D4A043"/>
            <ellipse cx="667" cy="80" rx="22" ry="14" fill="#D4A043"/>
            <rect x="700" y="115" width="60" height="105" fill="#D4A043"/>
            <rect x="770" y="130" width="52" height="90" fill="#D4A043"/>
            <rect x="832" y="100" width="68" height="120" fill="#D4A043"/>
            <rect x="910" y="120" width="55" height="100" fill="#D4A043"/>
            <rect x="975" y="95" width="45" height="125" fill="#D4A043"/>
            <rect x="1030" y="115" width="80" height="105" fill="#D4A043"/>
            <rect x="1120" y="135" width="80" height="85" fill="#D4A043"/>
          </svg>
        </div>

        {/* ── Diagonal gold stripe accent ── */}
        <div
          style={{
            position: "absolute",
            top: "290px",
            left: "-80px",
            width: "1360px",
            height: "2.5px",
            background: "linear-gradient(90deg, transparent, rgba(212,159,71,0.35), rgba(248,224,144,0.55), rgba(212,159,71,0.35), transparent)",
            transform: "rotate(-7deg)",
            display: "flex",
          }}
        />

        {/* ── Teal radial glow center-right ── */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse at 75% 50%, rgba(10,60,35,0.45) 0%, transparent 65%)",
            display: "flex",
          }}
        />

        {/* ── Gold border frame ── */}
        <div
          style={{
            position: "absolute",
            inset: "20px",
            border: "1.5px solid rgba(212,159,71,0.45)",
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
              GRACE &amp; GOODWILL
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
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div
              style={{
                fontSize: "66px",
                fontWeight: "bold",
                color: "#ffffff",
                lineHeight: 1.05,
                display: "flex",
                flexDirection: "column",
                textShadow: "0 2px 24px rgba(0,0,0,0.6)",
              }}
            >
              <span style={{ display: "flex" }}>CARE YOU</span>
              <span style={{ display: "flex" }}>CAN TRUST</span>
            </div>
            <div
              style={{
                fontSize: "19px",
                color: "rgba(255,255,255,0.55)",
                letterSpacing: "0.8px",
                display: "flex",
              }}
            >
              Live-in Care Matching Across the UK
            </div>
          </div>

          {/* Carer info strip */}
          <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
            <div
              style={{
                width: "60px",
                height: "2px",
                background: "linear-gradient(90deg, #D4A043, transparent)",
                display: "flex",
                marginBottom: "3px",
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
                fontSize: "15px",
                color: "rgba(255,255,255,0.5)",
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
                width: "265px",
                height: "265px",
                borderRadius: "50%",
                overflow: "hidden",
                border: "4px solid #D4A043",
                boxShadow: "0 0 50px rgba(212,159,71,0.45), 0 0 100px rgba(212,159,71,0.18), 0 0 0 8px rgba(212,159,71,0.12)",
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
            <div
              style={{
                width: "265px",
                height: "265px",
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

        {/* ── Right edge fade ── */}
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: "160px",
            background: "linear-gradient(to right, transparent, rgba(6,20,16,0.5))",
            display: "flex",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
