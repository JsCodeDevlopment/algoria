import Link from 'next/link';
import type { Metadata } from 'next';
import { Clock, Languages } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { INTERVIEW_EN_TRACKS, type InterviewEnglishTrack } from '@/lib/content/schemas';
import { getAllInterviewEnglishTopics } from '@/lib/content/loader';
import { buildPublicMetadata } from '@/lib/seo/build-metadata';

export const metadata: Metadata = buildPublicMetadata({
  title: 'Technical English for interviews — hub Algoria',
  description:
    'English-only hub: vocabulary for data structures & algorithms, live coding talk tracks, behavioral STAR answers and system design phrases for hiring loops.',
  pathname: '/interview-en',
  keywords: [
    'technical English interviews',
    'coding interview English',
    'live coding phrases',
    'STAR method behavioral',
    'system design vocabulary',
    'FAANG interview English',
    'Algoria',
  ],
  openGraphLocale: 'en_US',
});

const TRACK_ORDER = new Map<InterviewEnglishTrack, number>(
  INTERVIEW_EN_TRACKS.map((t, i) => [t, i]),
);

const TRACK_BADGE: Record<InterviewEnglishTrack, string> = {
  vocabulary: 'Vocabulary',
  communication: 'Live coding talk track',
  behavioral: 'Behavioral',
  'system-design': 'System design',
};

export default async function InterviewEnglishIndexPage() {
  const topics = await getAllInterviewEnglishTopics();
  topics.sort((a, b) => {
    const td = (TRACK_ORDER.get(a.meta.track) ?? 99) - (TRACK_ORDER.get(b.meta.track) ?? 99);
    if (td !== 0) return td;
    return a.meta.title.localeCompare(b.meta.title);
  });

  return (
    <div className="relative bg-grid-pattern">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <header className="mb-14 rounded-xl border border-primary/35 bg-background/95 p-6 md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center border-2 border-primary text-primary">
                <Languages className="h-6 w-6" aria-hidden />
              </div>
              <div className="space-y-3 max-w-2xl">
                <p className="text-[10px] font-black uppercase tracking-[0.35em] text-primary">Nova área · conteúdo 100% EN</p>
                <h1 className="text-2xl font-black uppercase tracking-tight md:text-3xl">Technical English for interviews</h1>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Toda a matéria das páginas abaixo está em inglês: vocabulário típico de entrevistas, scripts para pensar em voz alta,
                  respostas behavioral e linguagem para system design. Usa isto como repetição activa antes de rounds reais.
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="mb-16 border-l-4 border-primary pl-8">
          <Badge variant="secondary" className="mb-4 rounded-none bg-primary/10 px-1.5 py-0 font-mono text-[10px] uppercase text-primary">
            Interview.EN
          </Badge>
          <h2 className="mb-4 text-4xl font-black uppercase tracking-tighter md:text-6xl">Speak like you are on the call</h2>
          <p className="max-w-2xl text-lg font-medium uppercase leading-relaxed tracking-tight text-muted-foreground">
            Vocabulary, narration templates, STAR stories, and framing phrases — everything below is written for hiring conversations,
            not generic textbook English.
          </p>
        </div>

        <div className="grid gap-0 border border-border sm:grid-cols-2">
          {topics.map((t) => (
            <Link key={t.meta.slug} href={`/interview-en/${t.meta.slug}`} className="group relative border border-border p-px hover:z-10">
              <Card className="h-full rounded-none border-none bg-background transition-all duration-200 group-hover:bg-muted/50">
                <CardHeader className="px-6 pt-6">
                  <div className="mb-6 flex items-center gap-2">
                    <Badge variant="secondary" className="rounded-none bg-primary/10 px-1.5 py-0 font-mono text-[9px] uppercase text-primary">
                      {TRACK_BADGE[t.meta.track]}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-black uppercase tracking-tight transition-colors group-hover:text-primary">
                    {t.meta.title}
                  </CardTitle>
                  <CardDescription className="mt-2 flex items-center gap-2 font-mono text-[10px] uppercase">
                    <Clock className="h-3 w-3" aria-hidden /> {t.meta.estimatedMinutes}m study block
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <p className="text-sm leading-relaxed text-muted-foreground">{t.meta.summary}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
