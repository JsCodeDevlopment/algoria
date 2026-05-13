"use client";

import { RotateCcw } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import type { ProblemsCatalogProblem } from "@/lib/catalog/problem-card-model";
import { loadProgressBlob } from "@/lib/progress/local-progress";
import { getProblemSlugsDueForReview } from "@/lib/progress/review";

const DAY_OPTIONS = [7, 14, 30] as const;

interface Props {
  problems: ProblemsCatalogProblem[];
}

export function CatalogReviewSection({ problems }: Props) {
  const [minDays, setMinDays] = useState<(typeof DAY_OPTIONS)[number]>(14);
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    const onProg = () => setRevision((x) => x + 1);
    window.addEventListener("algoria-progress", onProg);
    return () => window.removeEventListener("algoria-progress", onProg);
  }, []);

  const reviewItems = useMemo(() => {
    const blob = loadProgressBlob();
    const slugs = new Set(getProblemSlugsDueForReview(blob, minDays));
    return problems.filter((p) => slugs.has(p.slug));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- revision invalida quando `algoria-progress`
  }, [problems, minDays, revision]);

  if (reviewItems.length === 0) {
    return (
      <section className="mb-10 border border-dashed border-border bg-muted/20 px-4 py-6">
        <div className="flex items-start gap-3">
          <RotateCcw
            className="h-5 w-5 shrink-0 text-muted-foreground mt-0.5"
            aria-hidden
          />
          <div className="space-y-2 min-w-0">
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
              Modo revisão
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Quando marcares problemas como concluídos no teu perfil local,
              aparecem aqui sugestões para rever passados{" "}
              <span className="font-mono text-xs">{minDays}</span> dias ou mais.
              Escolhe o intervalo:
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {DAY_OPTIONS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setMinDays(d)}
                  className={
                    minDays === d
                      ? "rounded-md border-2 border-primary bg-primary/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wide"
                      : "rounded-md border border-border px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground hover:border-primary/40"
                  }
                >
                  {d} dias
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-10 border border-primary/35 bg-primary/5 px-4 py-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3 min-w-0">
          <RotateCcw
            className="h-5 w-5 shrink-0 text-primary mt-0.5"
            aria-hidden
          />
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-primary mb-1">
              Revisão sugerida
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Estes problemas foram marcados como concluídos há pelo menos{" "}
              <span className="font-mono text-primary">{minDays}</span> dias —
              vale refrescar o enunciado ou uma solução alternativa.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 shrink-0">
          {DAY_OPTIONS.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setMinDays(d)}
              className={
                minDays === d
                  ? "rounded-md border-2 border-primary bg-background px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide"
                  : "rounded-md border border-border bg-background/60 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground hover:border-primary/40"
              }
            >
              {d} d
            </button>
          ))}
        </div>
      </div>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {reviewItems.map((p) => (
          <li key={p.slug}>
            <Link
              href={`/problems/${p.slug}`}
              className="block rounded-lg border border-border bg-background px-3 py-2 text-sm font-semibold uppercase tracking-tight hover:border-primary/50 transition-colors"
            >
              {p.title}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
