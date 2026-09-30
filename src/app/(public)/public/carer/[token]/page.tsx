import { Metadata, ResolvingMetadata } from "next";
import { unstable_cache } from "next/cache";
import PublicProfileClient from "@/app/(public)/carer/[token]/PublicProfileClient";
import shareableProfileService from "@/services/carer/shareableProfile.service";

const getCachedProfile = unstable_cache(
  async (token: string) => shareableProfileService.getPublicProfile(token),
  ["public-carer-profile"],
  { revalidate: 3600, tags: ["public-carer"] }
);

interface Props {
  params: Promise<{ token: string }>;
}

export async function generateMetadata(
  { params }: Props,
  _parent: ResolvingMetadata
): Promise<Metadata> {
  const { token } = await params;

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://graceandgoodwill.co.uk";
  
  const metadataBase = new URL(appUrl);
  const canonicalUrl = `${appUrl}/public/carer/${token}`;

  try {
    const profile = await getCachedProfile(token);
    
    // Privacy Logic: only First Name + Last Initial
    const nameParts = profile.displayName ? profile.displayName.split(/\s+/).filter(Boolean) : [];
    const firstName = nameParts.length > 0 ? nameParts[0] : "Our Carer";
    const lastInitial = nameParts.length > 1 ? nameParts[nameParts.length - 1].charAt(0).toUpperCase() : "";
    const safeName = lastInitial && !firstName.endsWith(".") ? `${firstName} ${lastInitial}.` : firstName;

    const title = `${safeName} | Professional Live-In Carer Profile`;
    const description = `View ${firstName}'s experience, video, care skills, interests, languages and current availability.`;
    const ogImageUrl = `${appUrl}/public/carer/${token}/og-image?ext=.png`;

    return {
      metadataBase,
      title,
      description,
      robots: { index: false, follow: false },
      openGraph: {
        title,
        description,
        url: canonicalUrl,
        siteName: profile.brandName || "Grace & Goodwill",
        type: "profile",
        images: [
          {
            url: ogImageUrl,
            width: 1200,
            height: 630,
            alt: title,
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
  } catch {
    // Token is invalid or expired — do NOT expose any carer info
    return {
      metadataBase,
      title: "Link Expired | Grace & Goodwill",
      description:
        "This shareable professional profile link is no longer active. Please contact Grace & Goodwill for more information.",
      robots: { index: false, follow: false },
      openGraph: {
        title: "Link Expired | Grace & Goodwill",
        description:
          "This shareable professional profile link is no longer active. Please contact Grace & Goodwill for more information.",
        url: canonicalUrl,
        type: "website",
      },
      twitter: {
        card: "summary",
        title: "Link Expired | Grace & Goodwill",
        description:
          "This shareable professional profile link is no longer active. Please contact Grace & Goodwill for more information.",
      },
    };
  }
}

export default async function PublicCarerAliasPage({ params }: Props) {
  const { token } = await params;
  return <PublicProfileClient token={token} />;
}
