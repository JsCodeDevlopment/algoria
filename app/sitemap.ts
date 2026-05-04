import type { MetadataRoute } from 'next';

import { getAllProblems, getAllConceptSlugs, getAllInterviewEnglishSlugs, getAllEngineeringWorkSlugs } from '@/lib/content/loader';

export const revalidate = 3600;

const RAW_DOMAIN = process.env.NEXT_PUBLIC_APP_DOMAIN?.trim() || 'algoria.app';
const BASE_URL = `https://${RAW_DOMAIN.replace(/^https?:\/\//, '').replace(/\/$/, '')}`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const isProduction = process.env.NEXT_PUBLIC_ENVIRONMENT === 'production' && process.env.NODE_ENV === 'production';
  if (!isProduction) return [];

  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}`, lastModified: now, priority: 1.0, changeFrequency: 'weekly' },
    { url: `${BASE_URL}/problems`, lastModified: now, priority: 0.9, changeFrequency: 'daily' },
    { url: `${BASE_URL}/concepts`, lastModified: now, priority: 0.85, changeFrequency: 'weekly' },
    { url: `${BASE_URL}/interview-en`, lastModified: now, priority: 0.82, changeFrequency: 'weekly' },
    { url: `${BASE_URL}/engenharia-trabalho`, lastModified: now, priority: 0.81, changeFrequency: 'weekly' },
  ];

  const [problems, conceptSlugs, interviewEnSlugs, engTrabalhoSlugs] = await Promise.all([
    getAllProblems(),
    getAllConceptSlugs(),
    getAllInterviewEnglishSlugs(),
    getAllEngineeringWorkSlugs(),
  ]);

  const problemEntries: MetadataRoute.Sitemap = problems.flatMap((p) => [
    {
      url: `${BASE_URL}/problems/${p.meta.slug}`,
      lastModified: now,
      priority: 0.8,
      changeFrequency: 'weekly' as const,
    },
    ...p.solutions.map((s) => ({
      url: `${BASE_URL}/problems/${p.meta.slug}/${s.meta.slug}`,
      lastModified: now,
      priority: 0.7,
      changeFrequency: 'weekly' as const,
    })),
  ]);

  const conceptEntries: MetadataRoute.Sitemap = conceptSlugs.map((slug) => ({
    url: `${BASE_URL}/concepts/${slug}`,
    lastModified: now,
    priority: 0.7,
    changeFrequency: 'monthly',
  }));

  const interviewEnEntries: MetadataRoute.Sitemap = interviewEnSlugs.map((slug) => ({
    url: `${BASE_URL}/interview-en/${slug}`,
    lastModified: now,
    priority: 0.68,
    changeFrequency: 'monthly',
  }));

  const engTrabalhoEntries: MetadataRoute.Sitemap = engTrabalhoSlugs.map((slug) => ({
    url: `${BASE_URL}/engenharia-trabalho/${slug}`,
    lastModified: now,
    priority: 0.67,
    changeFrequency: 'monthly',
  }));

  return [...staticEntries, ...problemEntries, ...conceptEntries, ...interviewEnEntries, ...engTrabalhoEntries];
}
