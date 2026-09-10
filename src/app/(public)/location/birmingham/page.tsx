import type { Metadata } from "next";
import LocationPageTemplate from "@/components/location/LocationPageTemplate";

export const metadata: Metadata = {
  title: "Live-in Care in Birmingham | Grace & Goodwill",
  description:
    "Professional live-in care throughout Birmingham and the West Midlands. Grace & Goodwill matches families with expert, vetted independent carers for home-based support.",
  alternates: { canonical: "https://graceandgoodwill.co.uk/location/birmingham" },
  openGraph: {
    type: "website",
    url: "https://graceandgoodwill.co.uk/location/birmingham",
    siteName: "Grace & Goodwill",
    title: "Live-in Care in Birmingham | Grace & Goodwill",
    description:
      "Trusted live-in carers across Birmingham city and the wider West Midlands region.",
  },
};

const data = {
  city: "Birmingham",
  region: "West Midlands",
  slug: "birmingham",
  headline: "Live-in Care in Birmingham",
  intro: [
    "Birmingham is the UK's second city — a diverse, bustling metropolis where the demand for high-quality, person-centred home care is growing rapidly. Grace & Goodwill provides live-in care throughout Birmingham, matching families with experienced, vetted independent carers who deliver compassionate support in the comfort of the home.",
    "Our Birmingham carers are trained and experienced across a wide range of conditions and care needs. Whether your loved one requires specialist dementia support, post-surgical care, or simply day-to-day companionship and assistance, we have a carer suited to their individual needs and personality.",
  ],
  stats: [
    { label: "City-wide Coverage", value: "Full", sub: "All Birmingham postcodes" },
    { label: "Care Specialisms", value: "12+", sub: "From complex needs to respite" },
    { label: "Client Rating", value: "4.9★", sub: "Excellent on Trustpilot" },
  ],
  services: [
    "Dementia & Alzheimer's Care",
    "Parkinson's Disease Care",
    "Stroke Recovery Care",
    "Post-Hospital Discharge Care",
    "Respite Live-in Care",
    "Long-term Live-in Care",
    "Palliative & End-of-Life Care",
    "Complex Needs Support",
    "Physical Disability Care",
    "Multiple Sclerosis Care",
    "Companionship Care",
    "Emergency Live-in Care",
  ],
  faqs: [
    {
      question: "How does live-in care work in Birmingham?",
      answer:
        "A professionally vetted independent carer moves into your Birmingham home and provides full-time support. This includes personal care, meal preparation, medication management, household tasks, companionship and social engagement — all tailored to your loved one's routine.",
    },
    {
      question: "Which areas of Birmingham do you cover?",
      answer:
        "We cover the full city of Birmingham including Edgbaston, Moseley, Kings Heath, Harborne, Sutton Coldfield, Erdington, Handsworth, Selly Oak, Northfield, Solihull, and all surrounding districts.",
    },
    {
      question: "Is live-in care cheaper than a care home in Birmingham?",
      answer:
        "Live-in care is often comparable in cost to a good residential care home in Birmingham, but provides dedicated one-to-one attention 24 hours a day, rather than shared staff time. Many families find the level of care is significantly better.",
    },
    {
      question: "Can you arrange emergency live-in care in Birmingham?",
      answer:
        "Yes. We can often arrange same-day or next-day emergency live-in care in Birmingham. Call our team on 020 4524 0108 to discuss your urgent requirements.",
    },
    {
      question: "Do your carers in Birmingham have specialist dementia training?",
      answer:
        "Many of our Birmingham carers have specialist experience in dementia and Alzheimer's care. We match carers to clients based on care needs, conditions, and personality to ensure the best possible fit.",
    },
  ],
  nearbyAreas: [
    "Edgbaston", "Moseley", "Kings Heath", "Harborne", "Sutton Coldfield",
    "Erdington", "Handsworth", "Selly Oak", "Northfield", "Solihull",
    "Walsall", "Wolverhampton", "West Bromwich", "Dudley", "Smethwick",
  ],
};

export default function BirminghamPage() {
  return <LocationPageTemplate data={data} />;
}
