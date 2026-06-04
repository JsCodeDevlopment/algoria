import { ArrowLeft, Clock } from 'lucide-react';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { RequireAuth } from '@/components/auth/require-auth';
import { UpgradePrompt } from '@/components/billing/upgrade-prompt';
import { DifficultyBadge } from '@/components/catalog/difficulty-badge';
import { ConceptVisitTracker } from '@/components/concepts/concept-visit-tracker';
import { ContentNavigation } from '@/components/layout/content-navigation';
import { JsonLdScript } from '@/components/seo/json-ld';
import { MarkdownArticle } from '@/components/markdown/markdown-article';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MermaidRenderer } from '@/components/markdown/mermaid-renderer';
import { auth } from '@/lib/auth';
import { userHasPro } from '@/lib/billing/entitlements';
import { getConceptAccess, isContentUnlockedForUser } from '@/lib/billing/tiering';
import { getAdjacentConcepts, getAllConceptSlugs, getConcept } from '@/lib/content/loader';
import { buildPublicMetadata } from '@/lib/seo/build-metadata';
import { learningResourceJsonLd } from '@/lib/seo/structured-data';

interface Params {
  slug: string;
}

export async function generateStaticParams(): Promise<Params[]> {
  const slugs = await getAllConceptSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const c = await getConcept(slug);
  if (!c) return {};
  const difficultyPt =
    c.meta.difficulty === 'easy' ? 'nível fácil' : c.meta.difficulty === 'medium' ? 'nível médio' : 'nível difícil';
  return buildPublicMetadata({
    title: c.meta.title,
    description: c.meta.summary,
    pathname: `/concepts/${slug}`,
    keywords: [
      c.meta.title,
      c.meta.category.replace('-', ' '),
      difficultyPt,
      'conceitos algoritmos',
      'fundamentos',
      'Acite',
    ],
    openGraphType: 'article',
  });
}

export default async function ConceptPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams?: Promise<{ course?: string; module?: string; curso?: string; modulo?: string }>;
}) {
  const { slug } = await params;
  const concept = await getConcept(slug);
  if (!concept) notFound();

  const session = await auth.api.getSession({ headers: await headers() });
  const hasPro = await userHasPro(session?.user?.id);
  const access = getConceptAccess(concept.meta);
  const isLocked = !isContentUnlockedForUser(access, hasPro);

  const q = (await searchParams) ?? {};
  const courseSlug = q.course ?? q.curso;
  const moduleId = q.module ?? q.modulo;
  const adjacent = await getAdjacentConcepts(slug);

  return (
    <RequireAuth>
      <div className="mx-auto max-w-7xl px-6 py-12">
        <JsonLdScript
        data={learningResourceJsonLd({
          name: concept.meta.title,
          description: concept.meta.summary,
          pathname: `/concepts/${slug}`,
        })}
      />
      <ConceptVisitTracker slug={slug} />

      <Button asChild variant="outline" size="sm" className="mb-6 rounded-none gap-2 text-xs font-bold uppercase tracking-wide">
        <Link href="/concepts"><ArrowLeft className="h-3.5 w-3.5" /> Todos os conceitos</Link>
      </Button>

      {courseSlug && moduleId ? (
        <div className="mb-8 rounded-none border border-primary/40 bg-primary/5 px-4 py-3 text-sm text-zinc-700 dark:text-zinc-200 leading-relaxed flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <span>
            Estás dentro do <strong>curso guiado</strong>. Quando terminares a página, volta ao módulo atual para marcar a
            leitura e continuar os exercícios.
          </span>
          <Link
            href={`/course/${encodeURIComponent(courseSlug)}/module/${encodeURIComponent(moduleId)}`}
            className="shrink-0 text-center text-xs font-semibold uppercase tracking-widest px-3 py-2 rounded-none bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Voltar ao módulo
          </Link>
        </div>
      ) : null}

      <div className="flex items-center gap-2 flex-wrap mb-3">
        <DifficultyBadge difficulty={concept.meta.difficulty} />
        <Badge variant="outline" className="capitalize">
          {concept.meta.category.replace('-', ' ')}
        </Badge>
        <span className="text-xs text-zinc-500 inline-flex items-center gap-1">
          <Clock className="h-3 w-3" /> {concept.meta.estimatedMinutes} min de leitura
        </span>
      </div>

      <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-3">{concept.meta.title}</h1>
      <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-10 leading-relaxed">{concept.meta.summary}</p>

      {isLocked ? (
        <div className="py-12 border-y border-dashed border-zinc-200 dark:border-zinc-800 my-10 bg-zinc-50/50 dark:bg-zinc-900/20">
          <UpgradePrompt conceptSlug={slug} hideLogin={!!session} />
        </div>
      ) : (
        <>
          <MermaidRenderer containerId={`concept-article-${slug}`} />
          <article
            id={`concept-article-${slug}`}
            className="prose prose-zinc dark:prose-invert max-w-none
                       prose-h2:text-2xl prose-h2:font-semibold prose-h2:tracking-tight prose-h2:mt-10
                       prose-h3:text-lg prose-h3:font-semibold
                       prose-code:text-blue-600 dark:prose-code:text-blue-400
                       prose-code:before:content-none prose-code:after:content-none
                       prose-pre:bg-zinc-900 prose-pre:text-zinc-100"
            dangerouslySetInnerHTML={{ __html: concept.bodyHtml }}
          />
        </>
      )}

      {courseSlug && moduleId ? (
        <div className="mt-12 mb-8 rounded-none border border-primary/40 bg-primary/5 px-4 py-3 text-sm text-zinc-700 dark:text-zinc-200 leading-relaxed flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <span>
            Estás dentro do <strong>curso guiado</strong>. Quando terminares a página, volta ao módulo atual para marcar a
            leitura e continuar os exercícios.
          </span>
          <Link
            href={`/course/${encodeURIComponent(courseSlug)}/module/${encodeURIComponent(moduleId)}`}
            className="shrink-0 text-center text-xs font-semibold uppercase tracking-widest px-3 py-2 rounded-none bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Voltar ao módulo
          </Link>
        </div>
      ) : null}

      <ContentNavigation
        sectionLabel="Navegar conceitos"
        prev={adjacent.prev ? { slug: adjacent.prev.slug, title: adjacent.prev.title, href: `/concepts/${adjacent.prev.slug}` } : null}
        next={adjacent.next ? { slug: adjacent.next.slug, title: adjacent.next.title, href: `/concepts/${adjacent.next.slug}` } : null}
      />
    </div>
    </RequireAuth>
  );
}

export const dynamicParams = false;
