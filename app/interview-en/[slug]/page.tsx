import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowLeft, Clock } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ContentNavigation } from '@/components/layout/content-navigation';
import { JsonLdScript } from '@/components/seo/json-ld';
import { RequireAuth } from '@/components/auth/require-auth';
import { getAllInterviewEnglishSlugs, getInterviewEnglishTopic, getAdjacentInterviewEnglish } from '@/lib/content/loader';
import type { InterviewEnglishTrack } from '@/lib/content/schemas';
import { buildPublicMetadata } from '@/lib/seo/build-metadata';
import { learningResourceJsonLd } from '@/lib/seo/structured-data';
import { auth } from '@/lib/auth';
import { userHasPro } from '@/lib/billing/entitlements';
import { isContentUnlockedForUser } from '@/lib/billing/tiering';
import { UpgradePrompt } from '@/components/billing/upgrade-prompt';
import { headers } from 'next/headers';

interface Params {
  slug: string;
}

const TRACK_LABEL: Record<InterviewEnglishTrack, string> = {
  vocabulary: 'Vocabulary',
  communication: 'Live coding talk track',
  behavioral: 'Behavioral',
  'system-design': 'System design',
};

export async function generateStaticParams(): Promise<Params[]> {
  const slugs = await getAllInterviewEnglishSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const topic = await getInterviewEnglishTopic(slug);
  if (!topic) return {};
  const track = TRACK_LABEL[topic.meta.track];
  return buildPublicMetadata({
    title: `${topic.meta.title} · Interview English`,
    description: topic.meta.summary,
    pathname: `/interview-en/${slug}`,
    keywords: [
      topic.meta.title,
      track,
      'technical English',
      'coding interview',
      'software interview',
      'Algoria',
    ],
    openGraphLocale: 'en_US',
    openGraphType: 'article',
  });
}

export default async function InterviewEnglishTopicPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams?: Promise<{ course?: string; module?: string; curso?: string; modulo?: string }>;
}) {
  const { slug } = await params;
  const topic = await getInterviewEnglishTopic(slug);
  if (!topic) notFound();
  
  const session = await auth.api.getSession({ headers: await headers() });
  const hasPro = await userHasPro(session?.user?.id);
  const isLocked = !isContentUnlockedForUser(topic.meta.access || 'pro', hasPro);

  const q = (await searchParams) ?? {};
  const courseSlug = q.course ?? q.curso;
  const moduleId = q.module ?? q.modulo;

  const adjacent = await getAdjacentInterviewEnglish(slug);

  return (
    <RequireAuth>
      <div className="mx-auto max-w-7xl px-6 py-12">
        <JsonLdScript
        data={learningResourceJsonLd({
          name: topic.meta.title,
          description: topic.meta.summary,
          pathname: `/interview-en/${slug}`,
          inLanguage: 'en',
        })}
      />
      <Button asChild variant="outline" size="sm" className="mb-6 rounded-none gap-2 text-xs font-bold uppercase tracking-wide">
        <Link href="/interview-en"><ArrowLeft className="h-3.5 w-3.5" /> Interview English hub</Link>
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

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Badge variant="outline" className="rounded-none text-[10px] uppercase">
          {TRACK_LABEL[topic.meta.track]}
        </Badge>
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" aria-hidden /> {topic.meta.estimatedMinutes} min study block
        </span>
      </div>

      <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.25em] text-primary">English-only lesson</p>
      <h1 className="mb-3 text-3xl font-semibold tracking-tight md:text-4xl">{topic.meta.title}</h1>
      <p className="mb-10 text-lg leading-relaxed text-muted-foreground">{topic.meta.summary}</p>

      {isLocked ? (
        <div className="py-12 border-y border-dashed border-zinc-200 dark:border-zinc-800 my-10 bg-zinc-50/50 dark:bg-zinc-900/20">
          <UpgradePrompt hideLogin={!!session} />
        </div>
      ) : (
        <article
          className="prose prose-zinc max-w-none dark:prose-invert
                     prose-h2:mt-10 prose-h2:text-2xl prose-h2:font-semibold prose-h2:tracking-tight
                     prose-h3:text-lg prose-h3:font-semibold
                     prose-code:text-blue-600 dark:prose-code:text-blue-400
                     prose-code:before:content-none prose-code:after:content-none
                     prose-pre:bg-zinc-900 prose-pre:text-zinc-100
                     prose-table:text-sm"
          dangerouslySetInnerHTML={{ __html: topic.bodyHtml }}
        />
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
        sectionLabel="Mais conteúdo de inglês"
        prev={adjacent.prev ? { slug: adjacent.prev.slug, title: adjacent.prev.title, href: `/interview-en/${adjacent.prev.slug}` } : null}
        next={adjacent.next ? { slug: adjacent.next.slug, title: adjacent.next.title, href: `/interview-en/${adjacent.next.slug}` } : null}
      />
    </div>
    </RequireAuth>
  );
}

export const dynamicParams = false;
