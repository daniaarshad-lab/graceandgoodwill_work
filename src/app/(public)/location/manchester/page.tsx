import type { Metadata } from "next";
import LocationPageTemplate from "@/components/location/LocationPageTemplate";

export const metadata: Metadata = {
  title: "Live-in Care in Manchester | Grace & Goodwill",
  description:
    "Expert live-in care across Greater Manchester. Grace & Goodwill matches families with trusted, vetted independent carers for compassionate home-based support in Manchester.",
  alternates: { canonical: "https://graceandgoodwill.co.uk/location/manchester" },
  openGraph: {
    type: "website",
    url: "https://graceandgoodwill.co.uk/location/manchester",
    siteName: "Grace & Goodwill",
    title: "Live-in Care in Manchester | Grace & Goodwill",
    description:
      "Professional live-in carers across all Greater Manchester boroughs. Compassionate, expert care in your own home.",
  },
};

const data = {
  city: "Manchester",
  region: "North West",
  slug: "manchester",
  headline: "Live-in Care in Manchester",
  intro: [
    "Manchester is one of the UK's most dynamic cities — and for its residents and their families, finding the right care at home matters enormously. Grace & Goodwill provides live-in care across all 10 Greater Manchester boroughs, matching people with skilled independent carers who deliver consistent, person-centred support.",
    "Our Manchester carers are experienced across a broad range of conditions — from dementia and Parkinson's to post-surgical recovery and complex physical needs. We manage every step of the matching and compliance process, so families can have confidence in the care their loved one receives.",
  ],
  stats: [
    { label: "GM Boroughs Covered", value: "10", sub: "Full Greater Manchester coverage" },
    { label: "Specialist Care Types", value: "12+", sub: "From dementia to palliative" },
    { label: "Trustpilot Rating", value: "4.9★", sub: "Rated excellent by families" },
  ],
  services: [
    "Dementia & Alzheimer's Care",
    "Parkinson's Care",
    "Stroke Recovery Support",
    "Post-Hospital Discharge Care",
    "Respite Live-in Care",
    "Long-term Live-in Care",
    "Complex Needs Care",
    "Palliative & End-of-Life Care",
    "Physical Disability Support",
    "Companionship Care",
    "Brain Injury Support",
    "Emergency Live-in Care",
  ],
  faqs: [
    {
      question: "Which areas of Greater Manchester do you cover?",
      answer:
        "We cover all 10 Greater Manchester boroughs: Manchester city centre, Salford, Trafford, Stockport, Tameside, Oldham, Rochdale, Bury, Bolton, and Wigan.",
    },
    {
      question: "How quickly can live-in care be arranged in Manchester?",
      answer:
        "In most cases we can arrange an introduction to a suitable carer within 24–48 hours. For urgent or emergency situations, we can often place a carer on the same day.",
    },
    {
      question: "What does live-in care in Manchester typically cost?",
      answer:
        "Live-in care in Manchester usually costs between £900 and £1,400 per week, depending on care complexity. This compares favourably to residential care home fees while providing dedicated, one-to-one support.",
    },
    {
      question: "Can your carers support someone with multiple conditions in Manchester?",
      answer:
        "Yes. Many of our carers have experience managing complex, co-existing conditions. We match carers specifically to the combination of needs presented by each client.",
    },
    {
      question: "How are carers in Manchester vetted by Grace & Goodwill?",
      answer:
        "Every carer in our network undergoes an enhanced DBS check, thorough reference verification, qualification review, and a detailed registration interview before being introduced to any client.",
    },
  ],
  nearbyAreas: [
    "Salford", "Trafford", "Stockport", "Tameside", "Oldham",
    "Rochdale", "Bury", "Bolton", "Wigan", "Didsbury",
    "Chorlton", "Withington", "Prestwich", "Eccles", "Stretford",
  ],
};

export default function ManchesterPage() {
  return <LocationPageTemplate data={data} />;
}
