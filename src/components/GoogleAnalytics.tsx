"use client";

import React, { useEffect, useState } from "react";
import Script from "next/script";

import {
  loadConsent,
  subscribeToConsent,
  type CookiePreferences,
} from "@/lib/cookie-consent";

/**
 * GA4 measurement ID. Hard-coded on purpose: this project only uses env vars
 * for values that genuinely differ per environment (NEXT_PUBLIC_API_URL), and
 * this property is the same for every deployment of the site.
 */
export const GA_MEASUREMENT_ID = "G-4TWKC889TR";

/** gtag.js honours this global as a kill switch, even after it has loaded. */
const GA_DISABLE_KEY = `ga-disable-${GA_MEASUREMENT_ID}` as const;

type ConsentState = "granted" | "denied";

const signal = (allowed: boolean): ConsentState =>
  allowed ? "granted" : "denied";

/** Nothing is permitted until the visitor's stored choice says otherwise. */
const DENIED_BY_DEFAULT: Record<string, ConsentState> = {
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
  analytics_storage: "denied",
  functionality_storage: "denied",
  personalization_storage: "denied",
  security_storage: "granted",
};

/** Maps the banner's four categories onto Google Consent Mode v2 signals. */
function consentSignals(
  prefs: CookiePreferences,
): Record<string, ConsentState> {
  return {
    ad_storage: signal(prefs.marketing),
    ad_user_data: signal(prefs.marketing),
    ad_personalization: signal(prefs.marketing),
    analytics_storage: signal(prefs.analytics),
    functionality_storage: signal(prefs.functional),
    personalization_storage: signal(prefs.functional),
    security_storage: "granted",
  };
}

/**
 * Loads the GA4 tag, but only once the visitor has accepted analytics cookies
 * via the existing consent banner. No page_view tracking is sent from here —
 * gtag's own configuration covers the initial view and GA4's enhanced
 * measurement covers App Router client-side navigations, so adding our own
 * would double-count.
 */
export default function GoogleAnalytics() {
  const [prefs, setPrefs] = useState<CookiePreferences | null>(null);

  /* Read the stored choice after mount so the server and first client render
     agree, then follow any later change made here or in another tab. */
  useEffect(() => {
    setPrefs(loadConsent());
    return subscribeToConsent(setPrefs);
  }, []);

  const analyticsAllowed = prefs?.analytics === true;

  /* gtag.js cannot be unloaded once injected, so a withdrawal of consent is
     handled by its kill switch and a consent update rather than by removing
     the script element. */
  useEffect(() => {
    window[GA_DISABLE_KEY] = !analyticsAllowed;
    if (prefs && typeof window.gtag === "function") {
      window.gtag("consent", "update", consentSignals(prefs));
    }
  }, [analyticsAllowed, prefs]);

  if (!prefs || !analyticsAllowed) return null;

  return (
    <>
      <Script
        id="ga4-script"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('consent', 'default', ${JSON.stringify(DENIED_BY_DEFAULT)});
          gtag('consent', 'update', ${JSON.stringify(consentSignals(prefs))});
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  );
}
