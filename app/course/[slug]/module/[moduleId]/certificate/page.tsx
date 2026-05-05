import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ModuleCertificateView } from '@/components/course/module-certificate-view';
import { JsonLdScript } from '@/components/seo/json-ld';
import { getCoursePackHydrated, listCourseSlugs } from '@/lib/courses/hydrate-course-pack';
import { buildPublicMetadata } from '@/lib/seo/build-metadata';
import { learningResourceJsonLd } from '@/lib/seo/structured-data';

interface Params {
  slug: string;
  moduleId: string;
}

export const dynamicParams = false;

export async function generateStaticParams(): Promise<Params[]> {
  const base = await listCourseSlugs();
  const combos: Params[] = [];
  for (const slug of base) {
    const pack = await getCoursePackHydrated(slug);
    if (!pack) continue;
    for (const m of pack.modules) {
      combos.push({ slug, moduleId: m.id });
    }
  }
  return combos;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug, moduleId } = await params;
  const pack = await getCoursePackHydrated(slug);
  const mod = pack?.modules.find((m) => m.id === moduleId);
  if (!mod || !pack) return {};
  const description =
    [mod.certificateTagline, mod.conceptSummary, `Certificado modular do curso «${pack.title}».`]
      .filter(Boolean)
      .join(' ');
  return buildPublicMetadata({
    title: `${mod.certificateTitle} · certificado`,
    description,
    pathname: `/course/${slug}/module/${moduleId}/certificate`,
    keywords: [mod.certificateTitle, pack.title, 'certificado curso', 'Algoria'],
    openGraphType: 'article',
  });
}

export default async function ModuleCertificatePage({ params }: { params: Promise<Params> }) {
  const { slug, moduleId } = await params;
  const pack = await getCoursePackHydrated(slug);
  if (!pack) notFound();
  const moduleHydrated = pack.modules.find((m) => m.id === moduleId);
  if (!moduleHydrated) notFound();
  const ldDescription =
    [moduleHydrated.certificateTagline, moduleHydrated.conceptSummary, `Certificado modular do curso «${pack.title}».`]
      .filter(Boolean)
      .join(' ');
  return (
    <>
      <JsonLdScript
        data={learningResourceJsonLd({
          name: moduleHydrated.certificateTitle,
          description: ldDescription,
          pathname: `/course/${slug}/module/${moduleId}/certificate`,
        })}
      />
      <ModuleCertificateView courseSlug={slug} module={moduleHydrated} />
    </>
  );
}
