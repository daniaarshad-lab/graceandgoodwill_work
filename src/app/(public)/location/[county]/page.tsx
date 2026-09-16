import type { Metadata } from "next";
import CountyPageClient from "./CountyPageClient";
import { regions } from "@/data/locationsData";

interface Props {
  params: Promise<{ county: string }>;
}

function unslugify(slug: string) {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { county } = await params;
  
  let countyName = "";
  for (const region of regions) {
    for (const c of region.counties) {
      if (slugify(c.name) === county) {
        countyName = c.name;
        break;
      }
    }
  }
  if (!countyName) countyName = unslugify(county);

  return {
    title: `Live-in Care in ${countyName} | Grace & Goodwill`,
    description: `Find trusted live-in carers across ${countyName} with Grace & Goodwill. Get personalised one-to-one care at home from experienced, DBS-checked carers.`,
    alternates: { canonical: `/location/${slugify(county)}` },
  };
}

export async function generateStaticParams() {
  const params: { county: string }[] = [];
  for (const region of regions) {
    for (const county of region.counties) {
      params.push({ county: slugify(county.name) });
    }
  }
  return params;
}

export default async function CountyPage({ params }: Props) {
  const { county } = await params;

  let regionName = "";
  let countyName = "";
  let towns: string[] = [];

  outer: for (const region of regions) {
    for (const c of region.counties) {
      if (slugify(c.name) === county) {
        regionName = region.name;
        countyName = c.name;
        towns = c.towns;
        break outer;
      }
    }
  }

  if (!countyName) countyName = unslugify(county);

  return (
    <CountyPageClient
      countyName={countyName}
      regionName={regionName}
      countySlug={county}
      towns={towns}
    />
  );
}
