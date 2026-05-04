import { notFound } from 'next/navigation';
import Link from 'next/link';

import { CourseModuleRunner } from '@/components/course/course-module-runner';
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
  return { title: mod.certificateTitle.replace(/^Certificado — /, '') };
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

  return (
    <div className="pb-16">
      <div className="mx-auto max-w-3xl px-6 pt-6 print:hidden">
        <Link href={`/curso/${encodeURIComponent(slug)}`} className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors">
          ← Índice do programa
        </Link>
      </div>
      <CourseModuleRunner pack={pack} module={moduleHydrated} previousModuleCertificateTitle={prevCert} />
    </div>
  );
}
