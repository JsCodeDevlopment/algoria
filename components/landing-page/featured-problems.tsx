import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DifficultyBadge } from "@/components/catalog/difficulty-badge";
import { SectionHeading } from "./shared";
import { getAllProblems } from "@/lib/content/loader";
import { sortCatalogProblems } from "@/lib/catalog/problem-filters";

export async function FeaturedProblems() {
  const problems = await getAllProblems();

  const indexed = problems.map((p) => ({
    problem: p,
    title: p.meta.title,
    difficulty: p.meta.difficulty,
    recommendedOrder: p.meta.recommendedOrder,
  }));

  const featured = sortCatalogProblems(indexed, "recommended")
    .slice(0, 3)
    .map((x) => x.problem);

  return (
    <section id="featured-problems" className="relative z-10 mx-auto max-w-7xl px-6 pb-20 md:pb-28">
      <div className="flex flex-col gap-8 border-t border-border pt-14 md:flex-row md:items-end md:justify-between">
        <SectionHeading
          kicker=""
          title="Desafios em destaque"
          subtitle="Pontos recomendados para começar agora mesmo."
          compact
        />
        <Link
          href="/problems"
          className="inline-flex shrink-0 items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary hover:underline"
        >
          Catálogo completo <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((p) => (
          <Link
            key={p.meta.slug}
            href={`/problems/${p.meta.slug}`}
            className="group relative"
          >
            <Card className="h-full border-border/60 bg-card/70 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/55 hover:shadow-xl hover:shadow-primary/10">
              <CardHeader>
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <DifficultyBadge difficulty={p.meta.difficulty} />
                  {p.meta.categories.slice(0, 1).map((c) => (
                    <Badge
                      key={c}
                      variant="secondary"
                      className="truncate py-0 text-[10px] capitalize"
                    >
                      {c.replace("-", " ")}
                    </Badge>
                  ))}
                </div>
                <CardTitle className="text-xl transition-colors group-hover:text-primary">
                  {p.meta.title}
                </CardTitle>
                <CardDescription className="mt-2 flex flex-wrap items-center gap-2 gap-y-1 text-xs">
                  <span>
                    {p.solutions.length}{" "}
                    {p.solutions.length === 1 ? "solução" : "soluções"}
                  </span>
                  <span className="opacity-40" aria-hidden>
                    •
                  </span>
                  <span className="whitespace-nowrap">
                    ~{p.meta.estimatedMinutes} min estimados
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                  {firstParagraph(p.descriptionHtml)}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}

function firstParagraph(html: string): string {
  const plain = html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return plain.length > 200 ? `${plain.slice(0, 200)}…` : plain;
}
