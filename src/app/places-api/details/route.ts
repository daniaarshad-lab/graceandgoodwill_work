import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const placeId = searchParams.get("placeId");

  if (!placeId) {
    return NextResponse.json(
      { error: "placeId is required" },
      { status: 400 }
    );
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
    const cleanId = placeId.replace("places/", "");
    const response = await fetch(
      `https://places.googleapis.com/v1/places/${encodeURIComponent(cleanId)}`,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask":
            "id,displayName,formattedAddress,addressComponents,location",
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[Places Details API] Error response:", errorText);
      return NextResponse.json(
        { error: "Failed to fetch place details", details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    const components = data.addressComponents || [];

    const getComponent = (types: string[], useShort = false): string => {
      const item = components.find((comp: any) =>
        types.some((t) => comp.types.includes(t))
      );
      if (!item) return "";
      return useShort
        ? item.shortText || item.longText || ""
        : item.longText || item.shortText || "";
    };

    const premise = getComponent(["premise", "subpremise"]);
    const streetNumber = getComponent(["street_number"]);
    const route = getComponent(["route"]);

    // Build street address: "Flat 2, 10 Downing Street"
    const streetParts: string[] = [];
    if (premise) streetParts.push(premise);
    if (streetNumber && route) {
      streetParts.push(`${streetNumber} ${route}`);
    } else if (route) {
      streetParts.push(route);
    } else if (streetNumber) {
      streetParts.push(streetNumber);
    }

    const streetAddress =
      streetParts.join(", ") || data.displayName?.text || "";

    // City: In the UK, "postal_town" is official town/city; otherwise locality
    const city =
      getComponent(["postal_town"]) ||
      getComponent(["locality"]) ||
      getComponent(["sublocality_level_1"]) ||
      getComponent(["sublocality"]) ||
      "";

    // State / County
    const county = getComponent(["administrative_area_level_2"]);
    const region = getComponent(["administrative_area_level_1"]);
    const state = county || region || "";

    // Postcode
    const postcode = getComponent(["postal_code"]);

    // Country
    const country = getComponent(["country"]) || "United Kingdom";

    const parsed = {
      formattedAddress: data.formattedAddress || streetAddress || "",
      streetAddress,
      city,
      state,
      postcode,
      country,
      lat: data.location?.latitude,
      lng: data.location?.longitude,
      placeId: data.id,
    };

    return NextResponse.json({ place: parsed });
  } catch (error: any) {
    console.error("[Places Details API] Network/Server Error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
