import { notFound } from 'next/navigation';

import { CourseProgramsIndex } from '@/components/course/course-programs-index';
import { getCoursePackHydrated, listCourseSlugs } from '@/lib/courses/hydrate-course-pack';

interface Params {
  slug: string;
}

export const dynamicParams = false;

export async function generateStaticParams(): Promise<Params[]> {
  const slugs = await listCourseSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const pack = await getCoursePackHydrated(slug);
  if (!pack) return {};
  return { title: pack.title };
}

export default async function CourseDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const pack = await getCoursePackHydrated(slug);
  if (!pack) notFound();
  return <CourseProgramsIndex pack={pack} />;
}
