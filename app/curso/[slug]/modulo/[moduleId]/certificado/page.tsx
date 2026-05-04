import { notFound } from 'next/navigation';

import { ModuleCertificateView } from '@/components/course/module-certificate-view';
import { getCoursePackHydrated, listCourseSlugs } from '@/lib/courses/hydrate-course-pack';
import { FUNDAMENTOS_FASE_1_PACK } from '@/lib/courses/fundamentos-fase1-seed';

interface Params {
  slug: string;
  moduleId: string;
}

export const dynamicParams = false;

export async function generateStaticParams(): Promise<Params[]> {
  const base = await listCourseSlugs();
  const combos: Params[] = [];
  for (const slug of base) {
    if (slug === FUNDAMENTOS_FASE_1_PACK.slug) {
      for (const m of FUNDAMENTOS_FASE_1_PACK.modules) {
        combos.push({ slug, moduleId: m.id });
      }
    }
  }
  return combos;
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug, moduleId } = await params;
  const pack = await getCoursePackHydrated(slug);
  const mod = pack?.modules.find((m) => m.id === moduleId);
  if (!mod) return {};
  return { title: `${mod.certificateTitle} · certificado` };
}

export default async function ModuleCertificatePage({ params }: { params: Promise<Params> }) {
  const { slug, moduleId } = await params;
  const pack = await getCoursePackHydrated(slug);
  if (!pack) notFound();
  const moduleHydrated = pack.modules.find((m) => m.id === moduleId);
  if (!moduleHydrated) notFound();
  return <ModuleCertificateView courseSlug={slug} module={moduleHydrated} />;
}
