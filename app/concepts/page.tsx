import Link from 'next/link';
import type { Metadata } from 'next';

import { ConceptsCatalogClient } from '@/components/concepts/concepts-catalog-client';
import { getAllConcepts } from '@/lib/content/loader';
import { buildPublicMetadata } from '@/lib/seo/build-metadata';

export const metadata: Metadata = buildPublicMetadata({
  title: 'Conceitos de algoritmos e estruturas de dados',
  description:
    'Mini-guias sobre Big O, tabelas hash, duas ponteiros, janela deslizante e mais — base para ler as soluções com contexto.',
  pathname: '/concepts',
  keywords: [
    'Big O',
    'complexidade algorítmica',
    'hash table',
    'two pointers',
    'sliding window',
    'fundamentos algoritmos',
    'Algoria conceitos',
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
  }));

  return (
    <div className="relative bg-grid-pattern">
      <div className="mx-auto max-w-5xl px-6 py-24">
        <div className="mb-14 flex flex-col gap-6 rounded-xl border border-primary/35 bg-background/95 p-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl space-y-2">
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-primary">Nova trilha</p>
            <h2 className="text-xl font-bold tracking-tight">Prefere um programa com ordem fixa?</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              O mesmo conteúdo abaixo entra também no curso de Fundamentos: progresso no browser, dois níveis nos exemplos
              interativos e certificado próprio assim que resolveres a avaliação de cada módulo.
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
