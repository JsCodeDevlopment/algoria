import type { Metadata } from "next";

import { InterviewCatalogClient } from "@/components/interview-en/interview-catalog-client";
import { Badge } from "@/components/ui/badge";
import { getAllInterviewEnglishTopics } from "@/lib/content/loader";
import {
  INTERVIEW_EN_TRACKS,
  type InterviewEnglishTrack,
} from "@/lib/content/schemas";
import { buildPublicMetadata } from "@/lib/seo/build-metadata";

export const metadata: Metadata = buildPublicMetadata({
  title: "Technical English for interviews — hub Acite",
  description:
    "English-only hub: vocabulary for data structures & algorithms, live coding talk tracks, behavioral STAR answers and system design phrases for hiring loops.",
  pathname: "/interview-en",
  keywords: [
    "technical English interviews",
    "coding interview English",
    "live coding phrases",
    "STAR method behavioral",
    "system design vocabulary",
    "FAANG interview English",
    "Acite",
  ],
  openGraphLocale: "en_US",
});

const TRACK_ORDER = new Map<InterviewEnglishTrack, number>(
  INTERVIEW_EN_TRACKS.map((t, i) => [t, i]),
);

export default async function InterviewEnglishIndexPage() {
  const topics = await getAllInterviewEnglishTopics();
  topics.sort((a, b) => {
    const td =
      (TRACK_ORDER.get(a.meta.track) ?? 99) -
      (TRACK_ORDER.get(b.meta.track) ?? 99);
    if (td !== 0) return td;
    return a.meta.title.localeCompare(b.meta.title);
  });

  return (
    <div className="relative bg-grid-pattern min-h-screen flex flex-col">
      <div className="mx-auto max-w-7xl px-6 py-24 flex-1">
        <header className="mb-16 border-l-4 border-primary pl-8">
          <Badge
            variant="secondary"
            className="mb-4 rounded-none bg-primary/10 px-1.5 py-0 font-mono text-[10px] uppercase text-primary"
          >
            Inglês Técnico
          </Badge>
          <h1 className="mb-4 text-4xl font-black uppercase tracking-tighter md:text-6xl">
            Inglês Técnico para Entrevistas
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed tracking-tight text-muted-foreground">
            Vocabulário, modelos de narração, histórias STAR e frases de
            orientação — tudo escrito para conversas de contratação, não para o
            inglês genérico de livros didáticos.
          </p>
        </header>

        <InterviewCatalogClient
          topics={topics.map((t) => ({
            slug: t.meta.slug,
            title: t.meta.title,
            summary: t.meta.summary,
            track: t.meta.track,
            estimatedMinutes: t.meta.estimatedMinutes,
            difficulty: t.meta.difficulty,
          }))}
        />
      </div>
    </div>
  );
}
