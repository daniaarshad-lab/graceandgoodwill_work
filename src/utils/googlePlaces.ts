export interface ParsedAddress {
  formattedAddress: string;
  streetAddress: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  lat?: number;
  lng?: number;
  placeId?: string;
}

declare global {
  interface Window {
    google?: any;
    __googlePlacesScriptPromise?: Promise<void>;
  }
}

/**
 * Loads the Google Places API JavaScript library via a singleton promise.
 * Resolves immediately if window.google.maps.places is already loaded.
 */
export function loadGooglePlacesScript(apiKey?: string): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Window is not defined"));
  }

  // If already loaded
  if (window.google?.maps?.places) {
    return Promise.resolve();
  }


  const key = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY 
  if (!key) {
    return Promise.reject(
      new Error("NEXT_PUBLIC_GOOGLE_PLACES_API_KEY is not defined in environment variables")
    );
  }

  if (window.__googlePlacesScriptPromise) {
    return window.__googlePlacesScriptPromise;
  }

  window.__googlePlacesScriptPromise = new Promise<void>((resolve, reject) => {
    // Check if script tag already exists
    const existingScript = document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]');
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve());
      existingScript.addEventListener("error", (e) => reject(e));
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(
      key
    )}&libraries=places&loading=async`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google?.maps?.places) {
        resolve();
      } else {
        // Short poll if places library is initializing
        const interval = setInterval(() => {
          if (window.google?.maps?.places) {
            clearInterval(interval);
            resolve();
          }
        }, 50);
        setTimeout(() => {
          clearInterval(interval);
          resolve();
        }, 2000);
      }
    };
    script.onerror = (err) => {
      reject(err);
    };

    document.head.appendChild(script);
  });

  return window.__googlePlacesScriptPromise;
}

/**
 * Parses a Google Places PlaceResult object into structured fields:
 * - streetAddress (subpremise/premise + street_number + route)
 * - city (postal_town || locality || sublocality)
 * - state/county (administrative_area_level_2 || administrative_area_level_1)
 * - postcode (postal_code)
 * - country
 */
export function parseGooglePlace(place: any): ParsedAddress {
  const components = place.address_components || [];

  const getComponent = (types: string[], useShort = false): string => {
    const item = components.find((comp: any) =>
      types.some((t) => comp.types.includes(t))
    );
    if (!item) return "";
    return useShort ? item.short_name : item.long_name;
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

  const streetAddress = streetParts.join(", ") || place.name || "";

  // City: in the UK, "postal_town" is official town/city; otherwise locality
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

  // Coordinates
  const lat = place.geometry?.location?.lat
    ? typeof place.geometry.location.lat === "function"
      ? place.geometry.location.lat()
      : place.geometry.location.lat
    : undefined;

  const lng = place.geometry?.location?.lng
    ? typeof place.geometry.location.lng === "function"
      ? place.geometry.location.lng()
      : place.geometry.location.lng
    : undefined;

  return {
    formattedAddress: place.formatted_address || streetAddress || "",
    streetAddress,
    city,
    state,
    postcode,
    country,
    lat,
    lng,
    placeId: place.place_id,
  };
}
