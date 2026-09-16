import type { Metadata } from "next";
import TownPageClient from "./TownPageClient";
import { regions } from "@/data/locationsData";

interface Props {
  params: Promise<{ county: string; town: string }>;
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
  const { county, town } = await params;
  const townName = unslugify(town);
  const countyName = unslugify(county);
  return {
    title: `Live-in Care in ${townName}, ${countyName} | Grace & Goodwill`,
    description: `Find trusted live-in carers in ${townName}, ${countyName} with Grace & Goodwill. Get personalised one-to-one care at home from experienced, DBS-checked carers.`,
    alternates: { canonical: `/location/${slugify(county)}/${slugify(town)}` },
  };
}

export async function generateStaticParams() {
  const params: { county: string; town: string }[] = [];
  for (const region of regions) {
    for (const county of region.counties) {
      for (const town of county.towns) {
        params.push({ county: slugify(county.name), town: slugify(town) });
      }
    }
  }
  return params;
}

export default async function TownPage({ params }: Props) {
  const { county, town } = await params;

  // Find the matching region, county, and town name from data
  let regionName = "";
  let countyName = "";
  let townName = "";

  outer: for (const region of regions) {
    for (const c of region.counties) {
      if (slugify(c.name) === county) {
        for (const t of c.towns) {
          if (slugify(t) === town) {
            regionName = region.name;
            countyName = c.name;
            townName = t;
            break outer;
          }
        }
      }
    }
  }

  // Fallback: prettify slug if not found in data
  if (!townName) townName = unslugify(town);
  if (!countyName) countyName = unslugify(county);

  return <TownPageClient townName={townName} countyName={countyName} regionName={regionName} countySlug={county} />;
}
