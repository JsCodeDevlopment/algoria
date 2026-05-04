import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Clock } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { getAllInterviewEnglishSlugs, getInterviewEnglishTopic } from '@/lib/content/loader';
import type { InterviewEnglishTrack } from '@/lib/content/schemas';

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

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const topic = await getInterviewEnglishTopic(slug);
  if (!topic) return {};
  return {
    title: `${topic.meta.title} · Interview English`,
    description: topic.meta.summary,
  };
}

export default async function InterviewEnglishTopicPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const topic = await getInterviewEnglishTopic(slug);
  if (!topic) notFound();

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Link href="/interview-en" className="mb-6 inline-block text-sm text-muted-foreground hover:text-foreground">
        ← Interview English hub
      </Link>

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
    </div>
  );
}

export const dynamicParams = false;
