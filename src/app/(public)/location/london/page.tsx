import type { Metadata } from "next";
import LocationPageTemplate from "@/components/location/LocationPageTemplate";

export const metadata: Metadata = {
  title: "Live-in Care in London | Grace & Goodwill",
  description:
    "Professional live-in care across all London boroughs. Grace & Goodwill matches you with trusted, vetted independent carers who provide compassionate support in your own home.",
  alternates: { canonical: "https://graceandgoodwill.co.uk/location/london" },
  openGraph: {
    type: "website",
    url: "https://graceandgoodwill.co.uk/location/london",
    siteName: "Grace & Goodwill",
    title: "Live-in Care in London | Grace & Goodwill",
    description:
      "Trusted live-in care across all 32 London boroughs. Expert independent carers matched to your needs.",
  },
};

const data = {
  city: "London",
  region: "South East",
  slug: "london",
  headline: "Live-in Care in London",
  intro: [
    "London is the most diverse city in the UK, and its families deserve equally diverse, personalised care. Grace & Goodwill connects Londoners with skilled independent carers who provide one-to-one live-in support — allowing you or your loved one to remain at home, in familiar surroundings, close to community and family.",
    "Whether you're in Kensington, Greenwich, Hackney or Enfield, our network of experienced carers covers all 32 London boroughs. We manage the matching, compliance, and ongoing support, so your family can focus on what matters most.",
  ],
  stats: [
    { label: "London Boroughs Covered", value: "32", sub: "Full Greater London coverage" },
    { label: "Years of Care Experience", value: "10+", sub: "Trusted by London families" },
    { label: "Average Carer Match Time", value: "48h", sub: "Fast, expert matching" },
  ],
  services: [
    "Dementia & Alzheimer's Care",
    "Parkinson's Care",
    "Post-Hospital Discharge",
    "Respite Live-in Care",
    "Palliative & End-of-Life Care",
    "Complex Needs Care",
    "Stroke Recovery Care",
    "Long-term Live-in Care",
    "Physical Disability Support",
    "Companionship Care",
    "Overnight Care",
    "Emergency Live-in Care",
  ],
  faqs: [
    {
      question: "How quickly can I get a live-in carer in London?",
      answer:
        "In most cases we can introduce a suitable carer within 24–48 hours, and for emergency situations we have carers available for same-day placement across Greater London.",
    },
    {
      question: "Do your carers cover all areas of London?",
      answer:
        "Yes. Our network of independent carers covers all 32 London boroughs — from Central London and the City to outer boroughs like Bromley, Hillingdon, and Havering.",
    },
    {
      question: "What does live-in care cost in London?",
      answer:
        "Live-in care costs in London typically range from £900 to £1,500 per week depending on the level of care required. This is often comparable to — or less than — a residential care home placement, while providing dedicated one-to-one attention.",
    },
    {
      question: "Is Grace & Goodwill regulated?",
      answer:
        "Grace & Goodwill operates as an introductory agency. We introduce you to independent carers who are self-employed. All carers are thoroughly vetted, DBS checked, and reference verified before being introduced to clients.",
    },
    {
      question: "Can live-in care support people with dementia in London?",
      answer:
        "Absolutely. Many of our carers specialise in dementia and Alzheimer's care. Live-in care is widely regarded as one of the best care options for people with dementia, as it preserves routine, familiarity and independence in the person's own home.",
    },
  ],
  nearbyAreas: [
    "Westminster", "Kensington", "Camden", "Islington", "Hackney",
    "Tower Hamlets", "Greenwich", "Lewisham", "Southwark", "Lambeth",
    "Wandsworth", "Richmond", "Kingston", "Bromley", "Croydon",
    "Enfield", "Haringey", "Barnet", "Ealing", "Hounslow",
  ],
};

export default function LondonPage() {
  return <LocationPageTemplate data={data} />;
}
