import { ArrowRight, ChevronLeft, Clock, GraduationCap } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getContentRepository } from "@/lib/content/content-repository";
import { buildPublicMetadata } from "@/lib/seo/build-metadata";
import { cn } from "@/lib/utils";

import { TestsFilters } from "./_components/tests-filters";

interface Params {
  track: string;
}

interface SearchParams {
  level?: string;
  topic?: string;
  difficulty?: string;
  q?: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { track } = await params;
  const title = track.charAt(0).toUpperCase() + track.slice(1);

  return buildPublicMetadata({
    title: `Simulados ${title} · Testes Técnicos`,
    description: `Lista de testes técnicos práticos para a trilha de ${title}.`,
    pathname: `/tests/${track}`,
  });
}

export default async function TrackTestsPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
}) {
  const { track } = await params;
  const { level, topic, difficulty, q } = await searchParams;
  const repo = getContentRepository();
  const validTracks = ["frontend", "backend", "devops"];

  if (!validTracks.includes(track)) {
    notFound();
  }

  const allTrackTests = await repo.getTechnicalTestsByTrack(track);

  // Extract unique values BEFORE filtering to populate dropdowns correctly
  const availableLevels = Array.from(
    new Set(allTrackTests.map((t) => t.level)),
  );
  const availableTopics = Array.from(
    new Set(allTrackTests.map((t) => t.topic)),
  );
  const availableDifficulties = Array.from(
    new Set(allTrackTests.map((t) => t.difficulty)),
  );

  let tests = [...allTrackTests];

  // Filter tests based on searchParams
  if (level) {
    tests = tests.filter((t) => t.level === level);
  }
  if (topic) {
    tests = tests.filter((t) => t.topic === topic);
  }
  if (difficulty) {
    tests = tests.filter((t) => t.difficulty === difficulty);
  }
  if (q) {
    const searchLower = q.toLowerCase();
    tests = tests.filter(
      (t) =>
        t.title.toLowerCase().includes(searchLower) ||
        t.description.toLowerCase().includes(searchLower) ||
        t.topic.toLowerCase().includes(searchLower),
    );
  }

  const trackTitle = track.charAt(0).toUpperCase() + track.slice(1);

  return (
    <div className="relative bg-grid-pattern flex flex-col flex-1">
      <div className="mx-auto w-full max-w-7xl px-6 py-12 md:py-24 flex-1">
        <div className="mb-10">
          <Button variant="outline" size="sm" asChild className="rounded-none">
            <Link href="/tests">
              <ChevronLeft className="mr-2 h-4 w-4" /> Voltar para Trilhas
            </Link>
          </Button>
        </div>

        <header className="mb-14 space-y-4">
          <h1 className="text-4xl font-black uppercase tracking-tight md:text-5xl">
            Simulados <span className="text-primary">{trackTitle}</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl leading-relaxed">
            Explora a nossa coleção de testes técnicos para {trackTitle}. Cada
            simulado foca-se em áreas específicas da engenharia moderna para
            garantir uma avaliação completa.
          </p>
        </header>

        <TestsFilters
          track={track}
          availableLevels={availableLevels}
          availableTopics={availableTopics}
          availableDifficulties={availableDifficulties}
        />

        {tests.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tests.map((test) => (
              <div
                key={test.id}
                className="group relative flex flex-col justify-between border-2 border-border bg-background p-6 transition-all hover:border-primary/50 shadow-sm"
              >
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex gap-2">
                      <Badge
                        variant="outline"
                        className="rounded-none text-[10px] uppercase font-black tracking-widest border-primary/30 text-primary"
                      >
                        {test.level}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className={cn(
                          "rounded-none text-[10px] uppercase font-black tracking-widest border-none",
                          test.difficulty === "fácil" &&
                            "bg-emerald-500/10 text-emerald-600",
                          test.difficulty === "médio" &&
                            "bg-amber-500/10 text-amber-600",
                          test.difficulty === "difícil" &&
                            "bg-destructive/10 text-destructive",
                        )}
                      >
                        {test.difficulty}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      <Clock className="h-3 w-3" /> {test.timeLimitMinutes}m
                    </div>
                  </div>

                  <h3 className="text-xl font-black tracking-tight text-foreground mb-2 group-hover:text-primary transition-colors">
                    {test.title}
                  </h3>

                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-muted text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-4">
                    <GraduationCap className="h-3 w-3" /> Tópico: {test.topic}
                  </div>

                  <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3 mb-8">
                    {test.description}
                  </p>
                </div>

                <Button
                  asChild
                  className="w-full rounded-none font-black uppercase tracking-widest gap-2 cursor-pointer"
                >
                  <Link href={`/tests/${track}/${test.slug}`}>
                    Iniciar Simulado <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="border-2 border-dashed border-border p-12 text-center bg-muted/5">
            <h3 className="text-lg font-bold uppercase tracking-widest text-muted-foreground mb-2">
              Nenhum simulado encontrado
            </h3>
            <p className="text-sm text-muted-foreground">
              Tenta ajustar os teus filtros para encontrar o que procuras.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
