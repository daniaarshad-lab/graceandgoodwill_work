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

  try {
    const profile = await shareableProfileService.getPublicProfile(token);

    const title = `${profile.displayName} | Professional Live-In Carer Profile`;

    let descriptionParts = [`View ${profile.displayName}'s verified professional live-in carer profile`];
    if (profile.experienceYears) {
      descriptionParts.push(`with ${profile.experienceYears}+ years of experience`);
    }
    const description =
      `${descriptionParts.join(" ")}. View their introduction video, care skills, languages and current availability.`;

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      "https://graceandgoodwill.co.uk";

    const ogImage = profile.photoUrl || `${appUrl}/website_logo.png`;
    const absoluteOgImage = ogImage.startsWith("http") ? ogImage : `${appUrl}${ogImage}`;
    const canonicalUrl = `${appUrl}/public/carer/${token}`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: canonicalUrl,
        siteName: profile.brandName || "Grace & Goodwill",
        images: [
          {
            url: absoluteOgImage,
            width: 800,
            height: 800,
            alt: `${profile.displayName} – Professional Live-In Carer`,
          },
        ],
        type: "profile",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [absoluteOgImage],
      },
    };
  } catch {
    // Token is invalid or expired — do NOT expose any carer info
    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      "https://graceandgoodwill.co.uk";

    return {
      title: "Link Expired | Grace & Goodwill",
      description:
        "This shareable professional profile link is no longer active. Please contact Grace & Goodwill for more information.",
      openGraph: {
        title: "Link Expired | Grace & Goodwill",
        description:
          "This shareable professional profile link is no longer active. Please contact Grace & Goodwill for more information.",
        images: [
          {
            url: `${appUrl}/website_logo.png`,
            width: 800,
            height: 800,
            alt: "Grace & Goodwill",
          },
        ],
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
