import type { MetadataRoute } from 'next';

import { listCourseSlugs, getCoursePackHydrated } from '@/lib/courses/hydrate-course-pack';
import { getAllProblems, getAllConceptSlugs, getAllInterviewEnglishSlugs, getAllEngineeringWorkSlugs } from '@/lib/content/loader';
import { getSiteOrigin } from '@/lib/seo/site';

export const revalidate = 3600;

const BASE_URL = getSiteOrigin();

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
    { url: `${BASE_URL}/curso`, lastModified: now, priority: 0.83, changeFrequency: 'weekly' },
  ];

  const [problems, conceptSlugs, interviewEnSlugs, engTrabalhoSlugs, courseSlugs] = await Promise.all([
    getAllProblems(),
    getAllConceptSlugs(),
    getAllInterviewEnglishSlugs(),
    getAllEngineeringWorkSlugs(),
    listCourseSlugs(),
  ]);

  const coursePackEntries: MetadataRoute.Sitemap = [];
  for (const cslug of courseSlugs) {
    coursePackEntries.push({
      url: `${BASE_URL}/curso/${encodeURIComponent(cslug)}`,
      lastModified: now,
      priority: 0.78,
      changeFrequency: 'weekly',
    });
    const pack = await getCoursePackHydrated(cslug);
    if (!pack) continue;
    for (const m of pack.modules) {
      coursePackEntries.push({
        url: `${BASE_URL}/curso/${encodeURIComponent(cslug)}/modulo/${encodeURIComponent(m.id)}`,
        lastModified: now,
        priority: 0.72,
        changeFrequency: 'weekly',
      });
      coursePackEntries.push({
        url: `${BASE_URL}/curso/${encodeURIComponent(cslug)}/modulo/${encodeURIComponent(m.id)}/certificado`,
        lastModified: now,
        priority: 0.55,
        changeFrequency: 'monthly',
      });
    }
  }

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

  return [...staticEntries, ...coursePackEntries, ...problemEntries, ...conceptEntries, ...interviewEnEntries, ...engTrabalhoEntries];
}
