import type { Metadata } from "next";

import { buildPublicMetadata } from "@/lib/seo/build-metadata";

import { getCoursePackHydrated, listCourseSlugs } from "./hydrate-course-pack";

export interface CertificateParams {
  slug: string;
  moduleId: string;
}

export async function getCertificateContext(slug: string, moduleId: string) {
  const pack = await getCoursePackHydrated(slug);
  const moduleHydrated = pack?.modules.find((m) => m.id === moduleId);

  if (!pack || !moduleHydrated) return null;

  const description = [
    moduleHydrated.certificateTagline,
    moduleHydrated.conceptSummary,
    `Certificado modular do curso «${pack.title}».`,
  ]
    .filter(Boolean)
    .join(" ");

  return {
    pack,
    moduleHydrated,
    description,
  };
}

export async function buildCertificateMetadata(
  params: CertificateParams
): Promise<Metadata> {
  const ctx = await getCertificateContext(params.slug, params.moduleId);
  if (!ctx) return {};

  return buildPublicMetadata({
    title: `${ctx.moduleHydrated.certificateTitle} · certificado`,
    description: ctx.description,
    pathname: `/course/${params.slug}/module/${params.moduleId}/certificate`,
    keywords: [
      ctx.moduleHydrated.certificateTitle,
      ctx.pack.title,
      "certificado curso",
      "Algoria",
    ],
    openGraphType: "article",
  });
}

export async function listCertificateParams(): Promise<CertificateParams[]> {
  const base = await listCourseSlugs();
  const combos: CertificateParams[] = [];
  for (const slug of base) {
    const pack = await getCoursePackHydrated(slug);
    if (!pack) continue;
    for (const m of pack.modules) {
      combos.push({ slug, moduleId: m.id });
    }
  }
  return combos;
}
