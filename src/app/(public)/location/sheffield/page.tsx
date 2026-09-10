import type { Metadata } from "next";
import LocationPageTemplate from "@/components/location/LocationPageTemplate";

export const metadata: Metadata = {
  title: "Live-in Care in Sheffield | Grace & Goodwill",
  description:
    "Trusted live-in care across Sheffield and South Yorkshire. Grace & Goodwill matches families with vetted, compassionate independent carers for expert home-based support.",
  alternates: { canonical: "https://graceandgoodwill.co.uk/location/sheffield" },
  openGraph: {
    type: "website",
    url: "https://graceandgoodwill.co.uk/location/sheffield",
    siteName: "Grace & Goodwill",
    title: "Live-in Care in Sheffield | Grace & Goodwill",
    description:
      "Expert independent carers across Sheffield and South Yorkshire. Compassionate, person-centred live-in care.",
  },
};

const data = {
  city: "Sheffield",
  region: "Yorkshire",
  slug: "sheffield",
  headline: "Live-in Care in Sheffield",
  intro: [
    "Sheffield — the Steel City — has a reputation for grit, community and care for its own. When a family member needs support, Grace & Goodwill is here to help them remain at home with dignity and independence. We provide live-in care across Sheffield and the wider South Yorkshire region, connecting families with experienced, vetted independent carers.",
    "Our Sheffield carers are skilled across a broad range of conditions and care types, from specialist dementia and Parkinson's support to post-surgical recovery and complex care needs. We take time to match each client with the right carer — ensuring compatibility, trust, and continuity of care from day one.",
  ],
  stats: [
    { label: "South Yorkshire Coverage", value: "Full", sub: "All Sheffield areas served" },
    { label: "Care Specialisms", value: "10+", sub: "Specialist & everyday care" },
    { label: "Client Satisfaction", value: "4.9★", sub: "Rated excellent on Trustpilot" },
  ],
  services: [
    "Dementia & Alzheimer's Care",
    "Parkinson's Care",
    "Stroke Recovery Support",
    "Post-Hospital Discharge Care",
    "Respite Live-in Care",
    "Long-term Live-in Care",
    "Palliative Care",
    "Complex Needs Support",
    "Physical Disability Care",
    "Companionship Care",
    "Multiple Sclerosis Care",
    "Emergency Live-in Care",
  ],
  faqs: [
    {
      question: "How does live-in care work in Sheffield?",
      answer:
        "A vetted independent carer moves into your Sheffield home and provides one-to-one, round-the-clock support. This includes personal care, medication management, meal preparation, household tasks, and meaningful daily companionship.",
    },
    {
      question: "Which areas of Sheffield does Grace & Goodwill cover?",
      answer:
        "We cover all areas of Sheffield including the city centre, Broomhill, Fulwood, Hillsborough, Walkley, Ecclesall, Nether Edge, Sharrow, Crookes, Dore, Totley, Chapeltown, and surrounding South Yorkshire communities.",
    },
    {
      question: "How quickly can live-in care be arranged in Sheffield?",
      answer:
        "In most cases we can arrange a carer introduction within 48 hours. For emergency situations we can often place a carer within the same day.",
    },
    {
      question: "What does live-in care cost in Sheffield?",
      answer:
        "Live-in care in Sheffield typically costs between £875 and £1,350 per week, depending on the level of care required. This provides dedicated one-to-one care throughout the day and night.",
    },
    {
      question: "Can live-in care in Sheffield support someone recovering from a stroke?",
      answer:
        "Yes. We have carers with specific experience supporting stroke recovery — including mobility assistance, speech support activities, medication management, and encouraging rehabilitation exercises alongside NHS or therapy team input.",
    },
  ],
  nearbyAreas: [
    "Broomhill", "Fulwood", "Hillsborough", "Walkley", "Ecclesall",
    "Nether Edge", "Sharrow", "Crookes", "Dore", "Totley",
    "Chapeltown", "Mosborough", "Handsworth", "Gleadless", "Woodseats",
  ],
};

export default function SheffieldPage() {
  return <LocationPageTemplate data={data} />;
}
