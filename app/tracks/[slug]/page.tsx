import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowLeft, Clock } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DifficultyBadge } from '@/components/catalog/difficulty-badge';
import { ProblemStatusBadge } from '@/components/catalog/problem-status-badge';
import { Button } from '@/components/ui/button';
import { catalogModelsFromProblems } from '@/lib/catalog/problem-card-model';
import { categoryLabelPt } from '@/lib/catalog/category-labels';
import { getAllProblems } from '@/lib/content/loader';
import { getStudyTrack, getStudyTrackSlugs, orderProblemsForTrack } from '@/lib/content/track-loader';
import { buildPublicMetadata } from '@/lib/seo/build-metadata';
import type { Category } from '@/lib/content/schemas';

interface Params {
  slug: string;
}

export async function generateStaticParams(): Promise<Params[]> {
  const trackSlugs = await getStudyTrackSlugs();
  return trackSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const track = await getStudyTrack(slug);
  if (!track) return {};
  return buildPublicMetadata({
    title: `${track.title} · Trilho`,
    description: track.summary,
    pathname: `/tracks/${slug}`,
    keywords: ['trilho', track.title, 'Acite'],
    openGraphType: 'article',
  });
}

export default async function TrackDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const track = await getStudyTrack(slug);
  if (!track) notFound();

  const problems = await getAllProblems();
  const ordered = orderProblemsForTrack(track, problems);
  const cards = catalogModelsFromProblems(ordered);

  return (
    <div className="relative bg-grid-pattern">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <Button asChild variant="outline" size="sm" className="mb-6 rounded-none gap-2 text-xs font-bold uppercase tracking-wide">
          <Link href="/tracks"><ArrowLeft className="h-3.5 w-3.5" /> Trilhos</Link>
        </Button>

        <header className="mb-10 border-l-4 border-primary pl-8">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-3 uppercase">{track.title}</h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">{track.summary}</p>
          <p className="mt-4 text-xs font-mono text-muted-foreground uppercase tracking-tight">
            {cards.length} problema{cards.length === 1 ? '' : 's'} neste trilho
          </p>
        </header>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-0 border border-border">
          {cards.map((p, idx) => (
            <Link key={p.slug} href={`/problems/${p.slug}`} className="group relative border border-border p-px hover:z-10" prefetch={false}>
              <Card className="h-full rounded-none border-none bg-background transition-all duration-200 group-hover:bg-muted/50">
                <CardHeader className="px-6 pt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-[10px] text-muted-foreground tabular-nums">#{idx + 1}</span>
                    <DifficultyBadge difficulty={p.difficulty} />
                    <ProblemStatusBadge problemSlug={p.slug} solutionCount={p.solutionCount} />
                  </div>
                  <CardTitle className="text-xl font-black uppercase tracking-tight group-hover:text-primary transition-colors">
                    {p.title}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-2 font-mono text-[10px] uppercase">
                    <span>{p.solutionCount} soluções</span>
                    <span className="h-1 w-1 bg-primary" />
                    <Clock className="h-3 w-3" /> {p.estimatedMinutes}m
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <div className="flex flex-wrap gap-1 mb-3">
                    {p.categories.slice(0, 3).map((c) => (
                      <Badge key={c} variant="secondary" className="font-mono text-[9px] px-1.5 py-0 rounded-none bg-primary/10 text-primary">
                        {categoryLabelPt(c as Category).replace(/\s+/g, '_').toUpperCase()}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{p.excerpt}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {cards.length === 0 ? (
          <p className="mt-12 text-center text-sm text-muted-foreground">
            Nenhum problema encontrado para esta trilho — verifica <code>content/tracks/{slug}.json</code>.
          </p>
        ) : null}
      </div>
    </div>
  );
}

export const dynamicParams = false;
