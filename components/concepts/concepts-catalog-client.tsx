"use client";

import { Clock } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { DifficultyBadge } from "@/components/catalog/difficulty-badge";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DIFFICULTY_LABEL_PT } from "@/lib/catalog/problem-filters";
import type { ContentAccess, Difficulty } from "@/lib/content/schemas";

export interface ConceptCatalogItem {
  slug: string;
  title: string;
  summary: string;
  category: string;
  estimatedMinutes: number;
  difficulty: Difficulty;
  access: ContentAccess;
}

type SortMode = "title_az" | "difficulty_asc";

const SORT_LABEL: Record<SortMode, string> = {
  title_az: "Título (A–Z)",
  difficulty_asc: "Dificuldade (fácil → difícil)",
};

interface Props {
  concepts: ConceptCatalogItem[];
}

export function ConceptsCatalogClient({ concepts }: Props) {
  const [q, setQ] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | "all">(
    "all",
  );
  const [sortMode, setSortMode] = useState<SortMode>("title_az");

  const filteredSorted = useMemo(() => {
    const query = q.trim().toLowerCase();
    const difficultyRank: Record<Difficulty, number> = {
      easy: 0,
      medium: 1,
      hard: 2,
    };

    let list = concepts.filter((c) => {
      if (difficultyFilter !== "all" && c.difficulty !== difficultyFilter)
        return false;
      if (!query) return true;
      return (
        c.title.toLowerCase().includes(query) ||
        c.summary.toLowerCase().includes(query) ||
        c.category.toLowerCase().includes(query)
      );
    });

    list = [...list];
    switch (sortMode) {
      case "difficulty_asc":
        list.sort(
          (a, b) =>
            difficultyRank[a.difficulty] - difficultyRank[b.difficulty] ||
            a.title.localeCompare(b.title),
        );
        break;
      case "title_az":
      default:
        list.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }
    return list;
  }, [concepts, q, difficultyFilter, sortMode]);

  return (
    <>
      <div className="mb-10 flex flex-col gap-4 rounded-xl border border-border bg-card/40 p-4 backdrop-blur-sm lg:flex-row lg:flex-wrap lg:items-end">
        <div className="min-w-[12rem] flex-1">
          <label
            htmlFor="concepts-search"
            className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground"
          >
            Pesquisar
          </label>
          <Input
            id="concepts-search"
            placeholder="Título, resumo ou categoria…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            autoComplete="off"
          />
        </div>
        <div className="w-full min-w-[10rem] sm:w-auto">
          <label
            htmlFor="concepts-difficulty"
            className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground"
          >
            Dificuldade
          </label>
          <select
            id="concepts-difficulty"
            value={difficultyFilter}
            onChange={(e) =>
              setDifficultyFilter(e.target.value as Difficulty | "all")
            }
            className="flex h-9 w-full min-w-[10rem] rounded-md border border-input bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
          >
            {(["all", "easy", "medium", "hard"] as const).map((d) => (
              <option key={d} value={d}>
                {DIFFICULTY_LABEL_PT[d]}
              </option>
            ))}
          </select>
        </div>
        <div className="w-full min-w-[12rem] sm:w-auto lg:ml-auto">
          <label
            htmlFor="concepts-sort"
            className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground"
          >
            Ordenar
          </label>
          <select
            id="concepts-sort"
            value={sortMode}
            onChange={(e) => setSortMode(e.target.value as SortMode)}
            className="flex h-9 w-full min-w-[12rem] rounded-md border border-input bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
          >
            {(Object.keys(SORT_LABEL) as SortMode[]).map((m) => (
              <option key={m} value={m}>
                {SORT_LABEL[m]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredSorted.length === 0 ? (
        <p className="border border-dashed border-border px-6 py-12 text-center text-sm text-muted-foreground">
          Nenhum conceito corresponde aos filtros. Limpa a pesquisa ou escolhe
          outra dificuldade.
        </p>
      ) : (
        <div className="grid gap-0 border border-border sm:grid-cols-2">
          {filteredSorted.map((c) => (
            <Link
              key={c.slug}
              href={`/concepts/${c.slug}`}
              className="group relative border border-border p-px hover:z-10"
            >
              <Card className="h-full rounded-none border-none bg-background transition-all duration-200 group-hover:bg-muted/50">
                <CardHeader className="px-6 pt-6">
                  <div className="mb-6 flex flex-wrap items-center gap-2">
                    <DifficultyBadge difficulty={c.difficulty} />
                    {c.access === "pro" ? (
                      <Badge
                        variant="outline"
                        className="rounded-none border-primary font-mono text-[9px] uppercase text-primary"
                      >
                        Pro
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="rounded-none font-mono text-[9px] uppercase"
                      >
                        Free
                      </Badge>
                    )}
                    <Badge
                      variant="secondary"
                      className="rounded-none bg-primary/10 px-1.5 py-0 font-mono text-[9px] uppercase text-primary"
                    >
                      {c.category.replace("-", "_")}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-black uppercase tracking-tight transition-colors group-hover:text-primary">
                    {c.title}
                  </CardTitle>
                  <CardDescription className="mt-2 flex items-center gap-2 font-mono text-[10px] uppercase">
                    <Clock className="h-3 w-3" aria-hidden />{" "}
                    {c.estimatedMinutes}m Reading
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {c.summary}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
