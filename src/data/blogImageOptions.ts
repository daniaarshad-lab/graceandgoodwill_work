/**
 * Featured-image options offered by the admin picker.
 *
 * These are landscape assets that already ship in /public. They exist so the
 * blog can be demonstrated before an upload endpoint exists — the admin can
 * also paste any external https URL, which next.config.js already permits.
 *
 * TODO(backend): once `POST /blog/uploads` exists, this list becomes a
 * "recently uploaded" gallery fed by the API and this file can be deleted.
 */
export interface BlogImageOption {
  url: string;
  label: string;
}

export const blogImageOptions: BlogImageOption[] = [
  { url: "/login_option1.jpg", label: "Carer and client at home" },
  { url: "/login_option2.jpg", label: "Companionship in the living room" },
  { url: "/login_option3.png", label: "Morning routine support" },
  { url: "/happy_senior_couple.png", label: "Senior couple together" },
  { url: "/sample.png", label: "Care conversation" },
  { url: "/website_logo.jpeg", label: "Grace & Goodwill brand" },
];
