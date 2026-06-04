import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { CourseProgramsIndex } from '@/components/course/course-programs-index';
import { JsonLdScript } from '@/components/seo/json-ld';
import { getCoursePackHydrated, listCourseSlugs } from '@/lib/courses/hydrate-course-pack';
import { buildPublicMetadata } from '@/lib/seo/build-metadata';
import { learningResourceJsonLd } from '@/lib/seo/structured-data';

interface Params {
  slug: string;
}

export const dynamicParams = false;

export async function generateStaticParams(): Promise<Params[]> {
  const slugs = await listCourseSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const pack = await getCoursePackHydrated(slug);
  if (!pack) return {};
  return buildPublicMetadata({
    title: pack.title,
    description: pack.subtitle,
    pathname: `/course/${slug}`,
    keywords: [pack.title, 'curso guiado algoritmos', 'certificado módulo', 'Acite curso', ...pack.modules.map((m) => m.certificateTitle)],
    openGraphType: 'article',
  });
}

export default async function CourseDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const pack = await getCoursePackHydrated(slug);
  if (!pack) notFound();
  return (
    <>
      <JsonLdScript
        data={learningResourceJsonLd({
          name: pack.title,
          description: pack.subtitle,
          pathname: `/course/${slug}`,
        })}
      />
      <CourseProgramsIndex pack={pack} />
    </>
  );
}
