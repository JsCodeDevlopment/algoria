import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Clock } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { getAllEngineeringWorkSlugs, getEngineeringWorkGuide } from '@/lib/content/loader';
import type { EngineeringWorkPillar } from '@/lib/content/schemas';

interface Params {
  slug: string;
}

const PILLAR_LABEL: Record<EngineeringWorkPillar, string> = {
  frontend: 'Frontend e produto',
  backend: 'Backend e APIs',
  devops: 'DevOps e sistema',
};

export async function generateStaticParams(): Promise<Params[]> {
  const slugs = await getAllEngineeringWorkSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const guide = await getEngineeringWorkGuide(slug);
  if (!guide) return {};
  return {
    title: `${guide.meta.title} · Engenharia no trabalho`,
    description: guide.meta.summary,
  };
}

export default async function EngenhariaTrabalhoGuidePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const guide = await getEngineeringWorkGuide(slug);
  if (!guide) notFound();

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Link href="/engenharia-trabalho" className="mb-6 inline-block text-sm text-muted-foreground hover:text-foreground">
        ← Engenharia no trabalho
      </Link>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Badge variant="outline" className="rounded-none text-[10px] uppercase">
          {PILLAR_LABEL[guide.meta.pillar]}
        </Badge>
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" aria-hidden /> ~{guide.meta.estimatedMinutes} min
        </span>
      </div>

      <h1 className="mb-3 text-3xl font-semibold tracking-tight md:text-4xl">{guide.meta.title}</h1>
      <p className="mb-10 text-lg leading-relaxed text-muted-foreground">{guide.meta.summary}</p>

      <article
        className="prose prose-zinc max-w-none dark:prose-invert
                   prose-h2:mt-10 prose-h2:text-2xl prose-h2:font-semibold prose-h2:tracking-tight
                   prose-h3:text-lg prose-h3:font-semibold
                   prose-code:text-blue-600 dark:prose-code:text-blue-400
                   prose-code:before:content-none prose-code:after:content-none
                   prose-ul:my-4 prose-li:my-1
                   prose-table:text-sm"
        dangerouslySetInnerHTML={{ __html: guide.bodyHtml }}
      />
    </div>
  );
}

export const dynamicParams = false;
