"use client";

import Script from "next/script";
import { useEffect } from "react";
import { loadConsent, subscribeToConsent, CookiePreferences } from "@/lib/cookie-consent";

const GA_MEASUREMENT_ID = "G-4TWKC889TR";

export default function GoogleAnalytics() {
  useEffect(() => {
    // Only run the consent logic if we are in production
    if (process.env.NODE_ENV !== "production") return;

    const updateConsent = (prefs: CookiePreferences | null) => {
      if (typeof window !== "undefined" && typeof window.gtag === "function") {
        window.gtag("consent", "update", {
          analytics_storage: prefs?.analytics ? "granted" : "denied",
        });
      }
    };

    // Apply the current consent state on mount
    updateConsent(loadConsent());

    // Subscribe to any future consent changes (e.g. user interacting with the banner)
    return subscribeToConsent(updateConsent);
  }, []);

  // Do not load any Google Analytics scripts in the local development environment
  if (process.env.NODE_ENV !== "production") {
    return null;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            // Default state: Deny analytics cookies until user explicitly accepts them via the banner
            gtag('consent', 'default', {
              'analytics_storage': 'denied'
            });

            gtag('config', '${GA_MEASUREMENT_ID}');
          `,
        }}
      />
    </>
  );
}
