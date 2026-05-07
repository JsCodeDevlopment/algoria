import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowLeft, Clock } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EngineeringGuideArticle } from '@/components/engenharia-trabalho/engineering-guide-article';
import { ContentNavigation } from '@/components/layout/content-navigation';
import { JsonLdScript } from '@/components/seo/json-ld';
import { getAllEngineeringWorkSlugs, getEngineeringWorkGuide, getAdjacentEngineeringWork } from '@/lib/content/loader';
import type { EngineeringWorkPillar } from '@/lib/content/schemas';
import { buildPublicMetadata } from '@/lib/seo/build-metadata';
import { articleJsonLd } from '@/lib/seo/structured-data';

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

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = await getEngineeringWorkGuide(slug);
  if (!guide) return {};
  const pillar = PILLAR_LABEL[guide.meta.pillar];
  return buildPublicMetadata({
    title: `${guide.meta.title} · Engenharia no trabalho`,
    description: guide.meta.summary,
    pathname: `/engineering-work/${slug}`,
    keywords: [guide.meta.title, pillar, 'engenharia software', 'boas práticas produção', 'Algoria guia'],
    openGraphType: 'article',
  });
}

export default async function EngineeringWorkGuidePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const guide = await getEngineeringWorkGuide(slug);
  if (!guide) notFound();
  const adjacent = await getAdjacentEngineeringWork(slug);

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <JsonLdScript
        data={articleJsonLd({
          headline: guide.meta.title,
          description: guide.meta.summary,
          pathname: `/engineering-work/${slug}`,
        })}
      />
      <Button asChild variant="outline" size="sm" className="mb-6 rounded-none gap-2 text-xs font-bold uppercase tracking-wide">
        <Link href="/engineering-work"><ArrowLeft className="h-3.5 w-3.5" /> Engenharia no trabalho</Link>
      </Button>

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

      <EngineeringGuideArticle html={guide.bodyHtml} />

      <ContentNavigation
        sectionLabel="Mais guias de engenharia"
        prev={adjacent.prev ? { slug: adjacent.prev.slug, title: adjacent.prev.title, href: `/engineering-work/${adjacent.prev.slug}` } : null}
        next={adjacent.next ? { slug: adjacent.next.slug, title: adjacent.next.title, href: `/engineering-work/${adjacent.next.slug}` } : null}
      />
    </div>
  );
}

export const dynamicParams = true;
