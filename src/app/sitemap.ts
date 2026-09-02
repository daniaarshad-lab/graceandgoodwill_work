import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://graceandgoodwill.co.uk';

  // Core pages
  const corePages = [
    '',
    '/about',
    '/services',
    '/how-it-works',
    '/pricing',
    '/contact',
    '/faq',
    '/join-as-carer',
    '/live-in-care-costs',
    '/training',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Service pages
  const servicePages = [
    '/live-in-care',
    '/what-is-live-in-care',
    '/long-term-live-in-care',
    '/dementia-live-in-care',
    '/alzheimers-live-in-care',
    '/respite-live-in-care',
    '/disability-live-in-support',
    '/brain-injury-live-in-care',
    '/spinal-injury-live-in-care',
    '/multiple-sclerosis-live-in-care',
    '/parkinsons-live-in-care',
    '/complex-needs-live-in-care',
    '/live-in-companionship-care',
    '/live-in-companionship',
    '/young-adult-live-in-care',
    '/hospital-discharge-live-in-care',
    '/live-in-care-after-hospital-discharge',
    '/live-in-care-after-stroke',
    '/urgent-live-in-care',
    '/emergency-care',
    '/convalescent-care-at-home',
    '/funding-live-in-care',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.9, // Higher priority for service pages for SEO
  }));

  // Legal/Terms pages
  const legalPages = [
    '/privacy',
    '/terms',
    '/agency-introduction-terms',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'yearly' as const,
    priority: 0.3,
  }));

  // Location pages
  const locationPages = [
    '/location/birmingham',
    '/location/bristol',
    '/location/gateshead',
    '/location/leeds',
    '/location/liverpool',
    '/location/london',
    '/location/manchester',
    '/location/newcastle-upon-tyne',
    '/location/nottingham',
    '/location/sheffield',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...corePages, ...servicePages, ...legalPages, ...locationPages];
}
