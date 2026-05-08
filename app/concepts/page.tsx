import type { Metadata } from "next";
import Link from "next/link";

import { ConceptsCatalogClient } from "@/components/concepts/concepts-catalog-client";
import { Badge } from "@/components/ui/badge";
import { getAllConcepts } from "@/lib/content/loader";
import { buildPublicMetadata } from "@/lib/seo/build-metadata";

export const metadata: Metadata = buildPublicMetadata({
  title: "Conceitos de algoritmos e estruturas de dados",
  description:
    "Mini-guias sobre Big O, tabelas hash, duas ponteiros, janela deslizante e mais — base para ler as soluções com contexto.",
  pathname: "/concepts",
  keywords: [
    "Big O",
    "complexidade algorítmica",
    "hash table",
    "two pointers",
    "sliding window",
    "fundamentos algoritmos",
    "Algoria conceitos",
  ],
});

export default async function ConceptsPage() {
  const concepts = await getAllConcepts();
  const items = concepts.map((c) => ({
    slug: c.meta.slug,
    title: c.meta.title,
    summary: c.meta.summary,
    category: c.meta.category,
    estimatedMinutes: c.meta.estimatedMinutes,
    difficulty: c.meta.difficulty,
    access: c.meta.access,
  }));

  return (
    <div className="relative bg-grid-pattern">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <header className="mb-16 border-l-4 border-primary pl-8">
          <Badge
            variant="secondary"
            className="mb-4 rounded-none bg-primary/10 px-1.5 py-0 font-mono text-[10px] uppercase text-primary"
          >
            Conceitos de algoritmos e estruturas de dados
          </Badge>
          <h1 className="mb-4 text-4xl font-black uppercase tracking-tighter md:text-6xl">
            Conceitos fundamentais
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed tracking-tight text-muted-foreground">
            Os pilares fundamentais para entender problemas de algoritmos e
            estruturas de dados.
          </p>
        </header>

        <div className="mb-14 flex flex-col gap-6 rounded-xl border border-primary/35 bg-background/95 p-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl space-y-2">
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-primary">
              Nova trilha
            </p>
            <h2 className="text-xl font-bold tracking-tight">
              Prefere um programa com ordem fixa?
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              O mesmo conteúdo abaixo entra também no curso de Fundamentos:
              progresso no browser, dois níveis nos exemplos interativos e
              certificado próprio assim que resolveres a avaliação de cada
              módulo.
            </p>
          </div>
          <Link
            href="/course/fundamentos-fase-1"
            className="inline-flex shrink-0 items-center justify-center border-2 border-primary px-6 py-3 text-center text-[11px] font-bold uppercase tracking-[0.2em] transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            Ver curso de Fundamentos
          </Link>
        </div>

        <ConceptsCatalogClient concepts={items} />
      </div>
    </div>
  );
}
