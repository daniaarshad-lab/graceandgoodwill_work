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
    
    // Construct a short, privacy-safe description based on available data
    let descriptionParts = ["View my verified professional live-in carer profile"];
    if (profile.experienceYears) {
      descriptionParts.push(`with ${profile.experienceYears}+ years of experience`);
    }
    const description = `${descriptionParts.join(" ")}. Profile includes my introduction video, care skills, languages, and availability.`;
    
    const ogImage = profile.photoUrl || "/website_logo.png";
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://portal.graceandgoodwill.co.uk";
    
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `${appUrl}/public/carer/${token}`,
        siteName: profile.brandName || "Grace & Goodwill",
        images: [
          {
            url: ogImage.startsWith("http") ? ogImage : `${appUrl}${ogImage}`,
            width: 800,
            height: 800,
            alt: `${profile.displayName}'s Profile Picture`,
          },
        ],
        type: "profile",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [ogImage.startsWith("http") ? ogImage : `${appUrl}${ogImage}`],
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
