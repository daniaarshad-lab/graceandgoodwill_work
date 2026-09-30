import { Metadata, ResolvingMetadata } from "next";
import PublicProfileClient from "@/app/(public)/carer/[token]/PublicProfileClient";
import shareableProfileService from "@/services/carer/shareableProfile.service";

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
  
  const canonicalUrl = `${appUrl}/public/carer/${token}`;

  try {
    const profile = await shareableProfileService.getPublicProfile(token);

    const title = `${profile.displayName} | Professional Live-In Carer Profile`;

    const firstName = profile.displayName ? profile.displayName.split(" ")[0] : "our carer";
    const description = `View ${firstName}'s experience, video, care skills, interests, languages and current availability.`;

    const ogImageUrl = `${appUrl}/api/og/carer/${token}`;

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
  } catch {
    // Token is invalid or expired — do NOT expose any carer info
    return {
      title: "Link Expired | Grace & Goodwill",
      description:
        "This shareable professional profile link is no longer active. Please contact Grace & Goodwill for more information.",
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
