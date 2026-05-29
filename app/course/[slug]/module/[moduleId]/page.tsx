import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { CourseModuleRunner } from '@/components/course/course-module-runner';
import { Button } from '@/components/ui/button';
import { JsonLdScript } from '@/components/seo/json-ld';
import { RequireAuth } from '@/components/auth/require-auth';
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
  const tabTitle = mod.certificateTitle.replace(/^Certificado — /, '');
  const description =
    [mod.conceptSummary, mod.certificateTagline].filter(Boolean).join(' · ') || pack.subtitle;
  return buildPublicMetadata({
    title: `${tabTitle} · ${pack.title}`,
    description,
    pathname: `/course/${slug}/module/${moduleId}`,
    keywords: [tabTitle, pack.title, mod.linkedConceptSlug, 'módulo curso Algoria', 'exercícios fundamentos'],
    openGraphType: 'article',
  });
}

export default async function CourseModulePage({ params }: { params: Promise<Params> }) {
  const { slug, moduleId } = await params;
  const pack = await getCoursePackHydrated(slug);
  if (!pack) notFound();
  const moduleHydrated = pack.modules.find((m) => m.id === moduleId);
  if (!moduleHydrated) notFound();
  const idx = pack.modules.findIndex((m) => m.id === moduleId);
  const prevCert =
    idx > 0 ? pack.modules[idx - 1]?.certificateTitle : undefined;

  const tabTitle = moduleHydrated.certificateTitle.replace(/^Certificado — /, '');
  const ldDescription =
    [moduleHydrated.conceptSummary, moduleHydrated.certificateTagline].filter(Boolean).join(' · ') ||
    pack.subtitle;

  return (
    <RequireAuth>
      <div className="pb-16">
        <JsonLdScript
        data={learningResourceJsonLd({
          name: `${tabTitle} · ${pack.title}`,
          description: ldDescription,
          pathname: `/course/${slug}/module/${moduleId}`,
        })}
      />
      <div className="mx-auto max-w-7xl px-6 pt-6 print:hidden">
        <Button asChild variant="outline" size="sm" className="rounded-none gap-2 text-xs font-bold uppercase tracking-wide print:hidden">
          <Link href={`/course/${encodeURIComponent(slug)}`}><ArrowLeft className="h-3.5 w-3.5" /> Índice do programa</Link>
        </Button>
      </div>
        <CourseModuleRunner pack={pack} module={moduleHydrated} previousModuleCertificateTitle={prevCert} />
      </div>
    </RequireAuth>
  );
}
