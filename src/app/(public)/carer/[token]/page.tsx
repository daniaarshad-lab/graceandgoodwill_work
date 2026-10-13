import { Metadata, ResolvingMetadata } from "next";
import PublicProfileClient from "./PublicProfileClient";
import shareableProfileService from "@/services/carer/shareableProfile.service";

interface Props {
  params: Promise<{ token: string }>;
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { token } = await params;
  
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://graceandgoodwill.co.uk";

  try {
    const profile = await shareableProfileService.getPublicProfile(token);
    
    // Privacy Logic: only First Name + Last Initial
    const nameParts = profile.displayName ? profile.displayName.split(/\s+/).filter(Boolean) : [];
    const firstName = nameParts.length > 0 ? nameParts[0] : "Our Carer";
    const lastInitial = nameParts.length > 1 ? nameParts[nameParts.length - 1].charAt(0).toUpperCase() : "";
    const safeName = lastInitial && !firstName.endsWith(".") ? `${firstName} ${lastInitial}.` : firstName;

    const title = `${safeName} | Professional Live-In Carer Profile`;
    const description = `View ${firstName}'s experience, video, care skills, interests, languages and current availability.`;

    // Canonical URL for this profile is /public/carer/{id}
    const canonicalUrl = `${appUrl}/public/carer/${token}`;

    // Point to the custom route handler that generates the PNG image
    const ogImageUrl = `${appUrl}/public/carer/${token}/og-image?ext=.png`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: canonicalUrl,
        siteName: profile.brandName || "Grace & Goodwill",
        type: "website",
        images: [
          {
            url: ogImageUrl,
            secureUrl: ogImageUrl,
            width: 1200,
            height: 630,
            alt: title,
            type: "image/png",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [ogImageUrl],
      },
    };
  } catch (error) {
    const ogImageUrl = `${appUrl}/public/carer/${token}/og-image?ext=.png`;
    const fallbackTitle = "Professional Live-In Carer Profile | Grace & Goodwill";
    const fallbackDescription =
      "View professional live-in carer experience, introductory video, care skills, languages and current availability through Grace & Goodwill.";

    return {
      title: fallbackTitle,
      description: fallbackDescription,
      openGraph: {
        title: fallbackTitle,
        description: fallbackDescription,
        siteName: "Grace & Goodwill",
        images: [
          {
            url: ogImageUrl,
            secureUrl: ogImageUrl,
            width: 1200,
            height: 630,
            alt: fallbackTitle,
            type: "image/png",
          }
        ],
        type: "profile",
      },
      twitter: {
        card: "summary_large_image",
        title: fallbackTitle,
        description: fallbackDescription,
        images: [ogImageUrl],
      },
    };
  }
}

export default async function PublicCarerProfilePage({ params }: Props) {
  const { token } = await params;
  return <PublicProfileClient token={token} />;
}
