import { ImageResponse } from "next/og";

export const runtime = "nodejs";

export const revalidate = 86400; // cache for 24 hours

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface Props {
  params: Promise<{ token: string }>;
}

export default async function Image({ params }: Props) {
  try {
    const { token } = await params;

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

    let profileRes: Response | undefined;
    let logoRes: Response | undefined;
    
    // Parallelize fetch of profile and logo
    await Promise.allSettled([
      fetch(`${apiBase}/api/public/carer/${token}`, { signal: AbortSignal.timeout(5000) })
        .then(res => { profileRes = res; }),
      fetch(`${appUrl}/website_logo.png`, { signal: AbortSignal.timeout(5000) })
        .then(res => { logoRes = res; })
    ]);

    let isValid = false;
    let displayName = "";
    let photoUrl: string | null = null;
    let experienceYears: number | null = null;

    if (profileRes && profileRes.ok) {
      const profile = await profileRes.json();
      displayName = profile.displayName || "";
      photoUrl = profile.photoUrl || null;
      experienceYears = profile.experienceYears ?? null;
      isValid = true;
    }

    let logoData: string | null = null;
    if (logoRes && logoRes.ok) {
      const buffer = await logoRes.arrayBuffer();
      const base64 = Buffer.from(buffer).toString("base64");
      logoData = `data:image/png;base64,${base64}`;
    }

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
              backgroundColor: "#0d1a35",
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
              <div style={{ width: "80px", height: "1px", backgroundColor: "rgba(212,159,71,0.4)", margin: "8px 0" }} />
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

    let carerPhotoData: string | null = null;
    if (photoUrl) {
      try {
        const res = await fetch(photoUrl, { signal: AbortSignal.timeout(4000) });
        if (res.ok) {
          const buffer = await res.arrayBuffer();
          const base64 = Buffer.from(buffer).toString("base64");
          const type = res.headers.get("content-type") || "image/jpeg";
          carerPhotoData = `data:${type};base64,${base64}`;
        }
      } catch (err) {
        // ignore
      }
    }

    const firstName = displayName.split(" ")[0] || "Carer";
    const formalName = displayName || "Professional Carer";

    return new ImageResponse(
      (
        <div
          style={{
            width: "1200px",
            height: "630px",
            display: "flex",
            backgroundColor: "#0d1a35",
          }}
        >
          {/* Subtle overlay gradients */}
          <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0, backgroundImage: "linear-gradient(to bottom, rgba(13,26,53,1), rgba(10,15,30,1))" }} />
          
          <div style={{ position: "absolute", top: "24px", left: "24px", right: "24px", bottom: "24px", border: "1px solid rgba(212,159,71,0.3)", borderRadius: "16px", display: "flex" }} />
          
          <div style={{ position: "absolute", top: "52px", left: "56px", right: "56px", bottom: "52px", display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
            
            <div style={{ display: "flex", flexDirection: "column", width: "700px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                {logoData ? (
                  <img src={logoData} width={52} height={52} style={{ objectFit: "contain" }} />
                ) : (
                  <div style={{ width: "52px", height: "52px", backgroundColor: "rgba(226,189,110,0.2)", borderRadius: "8px" }} />
                )}
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div style={{ fontSize: "24px", color: "#D4A043", fontWeight: "bold", letterSpacing: "4px" }}>
                    GRACE & GOODWILL
                  </div>
                  <div style={{ fontSize: "14px", color: "rgba(212,159,71,0.7)", letterSpacing: "3px", textTransform: "uppercase" }}>
                    Care Defined by Integrity
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", marginTop: "100px" }}>
                <div style={{ fontSize: "32px", color: "rgba(255,255,255,0.7)", marginBottom: "12px" }}>
                  Professional Live-In Carer Profile
                </div>
                <div style={{ fontSize: "72px", color: "#ffffff", fontWeight: "bold", lineHeight: 1.1, textShadow: "0 4px 12px rgba(0,0,0,0.3)" }}>
                  {formalName}
                </div>
                
                {experienceYears && (
                  <div style={{ display: "flex", alignItems: "center", marginTop: "32px" }}>
                    <div style={{ padding: "8px 16px", backgroundColor: "rgba(212,159,71,0.15)", border: "1px solid rgba(212,159,71,0.4)", borderRadius: "100px", color: "#D4A043", fontSize: "20px", fontWeight: "600" }}>
                      {experienceYears}+ Years Experience
                    </div>
                  </div>
                )}

                <div style={{ fontSize: "24px", color: "rgba(255,255,255,0.6)", marginTop: "40px", lineHeight: 1.4, maxWidth: "600px" }}>
                  View {firstName}&apos;s experience, introductory video, core care skills, interests, and current availability.
                </div>
              </div>

              <div style={{ position: "absolute", bottom: 0, display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ fontSize: "20px", color: "#D4A043" }}>graceandgoodwill.co.uk</div>
              </div>
            </div>

            <div style={{ display: "flex", width: "340px", height: "100%", justifyContent: "center", alignItems: "center" }}>
              <div style={{ position: "absolute", width: "420px", height: "420px", backgroundColor: "rgba(212,159,71,0.05)", borderRadius: "50%" }} />
              <div style={{ position: "absolute", width: "360px", height: "360px", backgroundColor: "rgba(212,159,71,0.1)", borderRadius: "50%", border: "1px solid rgba(212,159,71,0.2)" }} />
              
              <div style={{ width: "300px", height: "300px", borderRadius: "50%", overflow: "hidden", display: "flex", justifyContent: "center", alignItems: "center", border: "4px solid #D4A043", backgroundColor: "rgba(255,255,255,0.05)", boxShadow: "0 20px 40px rgba(0,0,0,0.4)" }}>
                {carerPhotoData ? (
                  <img src={carerPhotoData} width={300} height={300} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
                ) : (
                  <svg width="140" height="140" viewBox="0 0 24 24" fill="none" stroke="rgba(212,159,71,0.5)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 20a6 6 0 0 0-12 0" />
                    <circle cx="12" cy="10" r="4" />
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                )}
              </div>
            </div>
          </div>
        </div>
      ),
      { ...size }
    );
  } catch (err: any) {
    console.error("OG Image Error:", err);
    return new Response(err.stack || "Internal Server Error", { status: 500 });
  }
}
