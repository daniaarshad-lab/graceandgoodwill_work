import type { BlogCategory } from "@/types/blog.types";

/**
 * Initial category set. Replaced by `blogService.listCategories()` output once
 * the backend owns categories — nothing imports this array directly except the
 * mock service, so the swap is contained.
 */
export const blogCategories: BlogCategory[] = [
  {
    slug: "care-and-support",
    label: "Care & Support",
    description:
      "Practical guidance on arranging, funding and reviewing live-in care.",
  },
  {
    slug: "family-care",
    label: "Family Care",
    description:
      "Support for families navigating care decisions for someone they love.",
  },
  {
    slug: "carer-advice",
    label: "Carer Advice",
    description:
      "Guidance for professional carers on practice, wellbeing and development.",
  },
  {
    slug: "health-and-wellbeing",
    label: "Health & Wellbeing",
    description:
      "Everyday health, nutrition, mobility and mental wellbeing at home.",
  },
  {
    slug: "living-well",
    label: "Living Well",
    description:
      "Independence, companionship and quality of life in later years.",
  },
  {
    slug: "grace-and-goodwill-news",
    label: "Grace & Goodwill News",
    description: "Announcements, milestones and press from our team.",
  },
];

export function getCategoryLabel(slug: string): string {
  return blogCategories.find((c) => c.slug === slug)?.label ?? slug;
}
