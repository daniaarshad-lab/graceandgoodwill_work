/**
 * Shared cookie consent state.
 *
 * CookieConsentBanner is the only writer. Consumers (currently Google
 * Analytics) read the stored preferences and subscribe to changes so they can
 * react without requiring a page reload.
 */

export interface CookiePreferences {
  strictlyNecessary: true; // always true
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

export const CONSENT_STORAGE_KEY = "gg_cookie_consent_v2";

/** Dispatched on `window` whenever the stored preferences change in this tab. */
export const CONSENT_CHANGED_EVENT = "gg:cookie-consent-changed";

export const DEFAULT_PREFERENCES: CookiePreferences = {
  strictlyNecessary: true,
  functional: false,
  analytics: false,
  marketing: false,
};

export const ALL_ACCEPTED: CookiePreferences = {
  strictlyNecessary: true,
  functional: true,
  analytics: true,
  marketing: true,
};

/** Returns the stored preferences, or null if the visitor has not chosen yet. */
export function loadConsent(): CookiePreferences | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CookiePreferences;
  } catch {
    return null;
  }
}

export function saveConsent(prefs: CookiePreferences) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(prefs));
  window.dispatchEvent(
    new CustomEvent<CookiePreferences>(CONSENT_CHANGED_EVENT, {
      detail: prefs,
    }),
  );
}

/**
 * Subscribes to consent changes made in this tab or in another tab.
 * Returns an unsubscribe function.
 */
export function subscribeToConsent(
  onChange: (prefs: CookiePreferences | null) => void,
): () => void {
  if (typeof window === "undefined") return () => {};

  const handleLocalChange = (event: Event) => {
    onChange((event as CustomEvent<CookiePreferences>).detail);
  };
  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === CONSENT_STORAGE_KEY) onChange(loadConsent());
  };

  window.addEventListener(CONSENT_CHANGED_EVENT, handleLocalChange);
  window.addEventListener("storage", handleStorageChange);

  return () => {
    window.removeEventListener(CONSENT_CHANGED_EVENT, handleLocalChange);
    window.removeEventListener("storage", handleStorageChange);
  };
}
