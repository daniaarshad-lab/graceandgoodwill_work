import { Metadata } from "next";
import PublicProfileClient from "@/app/(public)/carer/[token]/PublicProfileClient";

interface Props {
  params: Promise<{ token: string }>;
}

export const metadata: Metadata = {
  title: "Carer Profile | Grace & Goodwill",
  description: "View a compliance-checked professional carer from Grace & Goodwill Private Care.",
};

export default async function PublicCarerAliasPage({ params }: Props) {
  const { token } = await params;
  return <PublicProfileClient token={token} />;
}
