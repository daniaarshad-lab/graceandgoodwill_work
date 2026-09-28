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
  
  try {
    const profile = await shareableProfileService.getPublicProfile(token);
    
    const title = `${profile.displayName} | Professional Live-In Carer Profile`;
    
    const firstName = profile.displayName ? profile.displayName.split(" ")[0] : "our carer";
    const description = `View ${firstName}'s experience, video, care skills, interests, languages and current availability.`;
    
    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      "https://graceandgoodwill.co.uk";

    const canonicalUrl = `${appUrl}/carer/${token}`;

    // Do NOT manually set images here — Next.js automatically uses the
    // co-located opengraph-image.tsx with the correct hashed route URL.
    // Manually specifying the URL causes 404 because Next.js appends a
    // build hash to the actual route (e.g. opengraph-image-1cczym).
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: canonicalUrl,
        siteName: profile.brandName || "Grace & Goodwill",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
      },
    };
  } catch (error) {
    // If token is invalid or expired, do not expose any user info
    return {
      title: "Link Expired | Grace & Goodwill",
      description: "This shareable professional profile link is no longer active. Please contact Grace & Goodwill for more information.",
      openGraph: {
        title: "Link Expired | Grace & Goodwill",
        description: "This shareable professional profile link is no longer active. Please contact Grace & Goodwill for more information.",
        images: [
          {
            url: "/website_logo.png",
            width: 800,
            height: 800,
            alt: "Grace & Goodwill",
          }
        ],
        type: "website",
      },
      twitter: {
        card: "summary",
        title: "Link Expired | Grace & Goodwill",
        description: "This shareable professional profile link is no longer active. Please contact Grace & Goodwill for more information.",
      },
    };
  }
}

export default async function PublicCarerProfilePage({ params }: Props) {
  const { token } = await params;
  return <PublicProfileClient token={token} />;
}
