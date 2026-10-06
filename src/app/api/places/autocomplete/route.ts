import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const input = searchParams.get("input") || "";
  const country = searchParams.get("country") || "gb";

  if (!input || input.trim().length < 2) {
    return NextResponse.json({ suggestions: [] });
  }

  const rawKey =
    process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY ||
    process.env.GOOGLE_PLACES_API_KEY ||
    "";
  const apiKey = rawKey.replace(/^["']|["']$/g, "").trim();

  if (!apiKey) {
    return NextResponse.json(
      { error: "Google Places API key is not configured" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      "https://places.googleapis.com/v1/places:autocomplete",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
        },
        body: JSON.stringify({
          input: input.trim(),
          includedRegionCodes: country ? [country.toLowerCase()] : ["gb"],
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[Places Autocomplete API] Error response:", errorText);
      return NextResponse.json(
        { error: "Failed to fetch autocomplete suggestions", details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    const rawSuggestions = data.suggestions || [];

    const suggestions = rawSuggestions
      .map((s: any) => {
        const pred = s.placePrediction;
        if (!pred) return null;

        return {
          placeId: pred.placeId || pred.place?.replace("places/", ""),
          mainText: pred.structuredFormat?.mainText?.text || pred.text?.text || "",
          secondaryText: pred.structuredFormat?.secondaryText?.text || "",
          fullText: pred.text?.text || "",
          types: pred.types || [],
        };
      })
      .filter(Boolean);

    return NextResponse.json({ suggestions });
  } catch (error: any) {
    console.error("[Places Autocomplete API] Network/Server Error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
