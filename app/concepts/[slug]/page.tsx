import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Clock } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { DifficultyBadge } from '@/components/catalog/difficulty-badge';
import { ConceptVisitTracker } from '@/components/concepts/concept-visit-tracker';
import { JsonLdScript } from '@/components/seo/json-ld';
import { getAllConceptSlugs, getConcept } from '@/lib/content/loader';
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
      'Algoria',
    ],
    openGraphType: 'article',
  });
}

export default async function ConceptPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams?: Promise<{ curso?: string; modulo?: string }>;
}) {
  const { slug } = await params;
  const concept = await getConcept(slug);
  if (!concept) notFound();
  const q = (await searchParams) ?? {};

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <JsonLdScript
        data={learningResourceJsonLd({
          name: concept.meta.title,
          description: concept.meta.summary,
          pathname: `/concepts/${slug}`,
        })}
      />
      <ConceptVisitTracker slug={slug} />

      <Link href="/concepts" className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 inline-block mb-6">
        ← Todos os conceitos
      </Link>

      {q.curso && q.modulo ? (
        <div className="mb-8 rounded-lg border border-primary/40 bg-primary/5 px-4 py-3 text-sm text-zinc-700 dark:text-zinc-200 leading-relaxed flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <span>
            Estás dentro do <strong>curso guiado</strong>. Quando terminares a página, volta ao módulo atual para marcar a
            leitura e continuar os exercícios.
          </span>
          <Link
            href={`/curso/${encodeURIComponent(q.curso)}/modulo/${encodeURIComponent(q.modulo)}`}
            className="shrink-0 text-center text-xs font-semibold uppercase tracking-widest px-3 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
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

      <article
        className="prose prose-zinc dark:prose-invert max-w-none
                   prose-h2:text-2xl prose-h2:font-semibold prose-h2:tracking-tight prose-h2:mt-10
                   prose-h3:text-lg prose-h3:font-semibold
                   prose-code:text-blue-600 dark:prose-code:text-blue-400
                   prose-code:before:content-none prose-code:after:content-none
                   prose-pre:bg-zinc-900 prose-pre:text-zinc-100"
        dangerouslySetInnerHTML={{ __html: concept.bodyHtml }}
      />
    </div>
  );
}

export const dynamicParams = false;
