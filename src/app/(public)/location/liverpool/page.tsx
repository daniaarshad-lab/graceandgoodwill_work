import type { Metadata } from "next";
import LocationPageTemplate from "@/components/location/LocationPageTemplate";

export const metadata: Metadata = {
  title: "Live-in Care in Liverpool | Grace & Goodwill",
  description:
    "Compassionate live-in care across Liverpool and Merseyside. Grace & Goodwill connects families with trusted, vetted independent carers for expert home-based support.",
  alternates: { canonical: "https://graceandgoodwill.co.uk/location/liverpool" },
  openGraph: {
    type: "website",
    url: "https://graceandgoodwill.co.uk/location/liverpool",
    siteName: "Grace & Goodwill",
    title: "Live-in Care in Liverpool | Grace & Goodwill",
    description:
      "Expert live-in carers across Liverpool and the wider Merseyside area. Compassionate, person-centred care at home.",
  },
};

const data = {
  city: "Liverpool",
  region: "North West",
  slug: "liverpool",
  headline: "Live-in Care in Liverpool",
  intro: [
    "Liverpool is a city defined by warmth, community, and deep family bonds. When a loved one needs care, keeping them at home — in their own environment, close to family and the life they know — is often the most meaningful choice. Grace & Goodwill provides expert live-in care throughout Liverpool and the wider Merseyside area.",
    "Our independent carers are experienced across a wide range of conditions including dementia, stroke recovery, Parkinson's care, and post-hospital support. We match each Liverpool client with a carer who fits their personality, preferences and care needs — creating a relationship built on trust and continuity.",
  ],
  stats: [
    { label: "Merseyside Coverage", value: "Full", sub: "All Liverpool areas covered" },
    { label: "Care Specialisms", value: "10+", sub: "Specialist & everyday support" },
    { label: "Match Time", value: "48h", sub: "Or same-day for emergencies" },
  ],
  services: [
    "Dementia & Alzheimer's Care",
    "Parkinson's Care",
    "Stroke Recovery Care",
    "Post-Hospital Discharge Care",
    "Respite Live-in Care",
    "Long-term Live-in Care",
    "Palliative Care",
    "Complex Needs Support",
    "Physical Disability Care",
    "Companionship Care",
    "Brain Injury Support",
    "Emergency Live-in Care",
  ],
  faqs: [
    {
      question: "What is live-in care and how does it work in Liverpool?",
      answer:
        "A live-in carer moves into your Liverpool home and provides around-the-clock, one-to-one support. This covers personal care, medication management, meal preparation, household tasks, and companionship.",
    },
    {
      question: "Which parts of Liverpool and Merseyside do you cover?",
      answer:
        "We cover all areas of Liverpool and Merseyside including the city centre, Aigburth, Crosby, Waterloo, Bootle, Huyton, Garston, Allerton, Wavertree, West Derby, Woolton, Southport, and across the Wirral.",
    },
    {
      question: "How do I start the process of arranging live-in care in Liverpool?",
      answer:
        "Contact us by phone on 020 4524 0108 or via our online form. A care advisor will listen to your needs, answer your questions, and guide you through the matching process — with no obligation.",
    },
    {
      question: "What does live-in care in Liverpool typically cost?",
      answer:
        "Live-in care in Liverpool typically ranges from £875 to £1,350 per week, depending on care complexity and requirements. This provides dedicated one-to-one care and is often comparable to residential care home costs in the Merseyside area.",
    },
    {
      question: "Can your carers support someone with Parkinson's disease in Liverpool?",
      answer:
        "Yes. A number of our carers have specialist experience in Parkinson's disease care. Live-in care is particularly beneficial for Parkinson's, as it ensures consistent support with mobility, medication timing, and daily routines.",
    },
  ],
  nearbyAreas: [
    "Aigburth", "Crosby", "Waterloo", "Bootle", "Huyton",
    "Garston", "Allerton", "Wavertree", "West Derby", "Woolton",
    "Southport", "Birkenhead", "Wallasey", "Bebington", "Heswall",
  ],
};

export default function LiverpoolPage() {
  return <LocationPageTemplate data={data} />;
}
