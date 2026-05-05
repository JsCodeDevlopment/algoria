'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Clock } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { CatalogReviewSection } from '@/components/catalog/catalog-review-section';
import { ProgressBackupControls } from '@/components/catalog/progress-backup-controls';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DifficultyBadge } from '@/components/catalog/difficulty-badge';
import { ProblemStatusBadge } from '@/components/catalog/problem-status-badge';
import { Input } from '@/components/ui/input';
import type { ProblemsCatalogProblem } from '@/lib/catalog/problem-card-model';
import { catalogCategoryLabels, categoryLabelPt } from '@/lib/catalog/category-labels';
import type { SortMode } from '@/lib/catalog/problem-filters';
import {
  DIFFICULTY_LABEL_PT,
  filterProblems,
  sortCatalogProblems,
  type CategoryFilter,
} from '@/lib/catalog/problem-filters';
import type { Category, Difficulty } from '@/lib/content/schemas';

interface Props {
  problems: ProblemsCatalogProblem[];
}

const SORT_LABEL: Record<SortMode, string> = {
  recommended: 'Ordem recomendada',
  difficulty_asc: 'Dificuldade (fácil → difícil)',
  title_az: 'Título (A–Z)',
};

export function ProblemsCatalogClient({ problems }: Props) {
  const categories = catalogCategoryLabels();
  const [q, setQ] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [sortMode, setSortMode] = useState<SortMode>('recommended');

  const filteredSorted = useMemo(() => {
    const f = filterProblems(problems, q, difficultyFilter, categoryFilter);
    return sortCatalogProblems(f, sortMode);
  }, [problems, q, difficultyFilter, categoryFilter, sortMode]);

  return (
    <div className="relative bg-grid-pattern">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <header className="mb-12 border-l-4 border-primary pl-8">
          <Badge variant="outline" className="mb-4 font-mono text-[10px] border-primary/30 text-primary">
            SYSTEM.CATALOG_v1.0
          </Badge>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4 uppercase">
            Catálogo de <br /> problemas
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl font-medium">
            Filtra por dificuldade e categoria, pesquisa por título e segue a ordem recomendada de aprendizagem.
            O progresso fica no teu browser (localStorage).
          </p>
          <p className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
            <Link
              href="/tracks"
              className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
            >
              Trilhos curados (por tema e ordem editorial)
            </Link>
            <Link href="/changelog" className="text-sm font-semibold text-primary underline-offset-4 hover:underline">
              Novidades
            </Link>
          </p>
        </header>

        <CatalogReviewSection problems={problems} />

        <div className="mb-10 flex flex-col gap-4 rounded-xl border border-border bg-card/40 p-4 backdrop-blur-sm lg:flex-row lg:flex-wrap lg:items-end">
          <div className="flex-1 min-w-[12rem]">
            <label htmlFor="catalog-search" className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Pesquisar
            </label>
            <Input
              id="catalog-search"
              placeholder="Ex.: Two Sum, array…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              autoComplete="off"
            />
          </div>
          <div className="w-full min-w-[10rem] sm:w-auto">
            <label htmlFor="catalog-diff" className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Nível
            </label>
            <select
              id="catalog-diff"
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value as Difficulty | 'all')}
              className="flex h-9 w-full min-w-[10rem] rounded-md border border-zinc-200 bg-white px-3 text-sm outline-none dark:border-zinc-800 dark:bg-zinc-950"
            >
              {(['all', 'easy', 'medium', 'hard'] as const).map((d) => (
                <option key={d} value={d}>
                  {DIFFICULTY_LABEL_PT[d]}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full min-w-[12rem] sm:w-auto">
            <label htmlFor="catalog-cat" className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Categoria
            </label>
            <select
              id="catalog-cat"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as CategoryFilter)}
              className="flex h-9 w-full min-w-[12rem] rounded-md border border-zinc-200 bg-white px-3 text-sm outline-none dark:border-zinc-800 dark:bg-zinc-950"
            >
              <option value="all">Todas</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {categoryLabelPt(c)}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full min-w-[12rem] sm:w-auto lg:ml-auto">
            <label htmlFor="catalog-sort" className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Ordenar
            </label>
            <select
              id="catalog-sort"
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value as SortMode)}
              className="flex h-9 w-full min-w-[12rem] rounded-md border border-zinc-200 bg-white px-3 text-sm outline-none dark:border-zinc-800 dark:bg-zinc-950"
            >
              {(Object.keys(SORT_LABEL) as SortMode[]).map((m) => (
                <option key={m} value={m}>
                  {SORT_LABEL[m]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-8">
          <ProgressBackupControls />
        </div>

        <p className="mb-6 text-xs text-muted-foreground font-mono uppercase tracking-tight">
          {filteredSorted.length} problema{filteredSorted.length === 1 ? '' : 's'}
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-0 border border-border">
          {filteredSorted.map((p) => (
            <Link key={p.slug} href={`/problems/${p.slug}`} className="group relative border border-border p-px hover:z-10">
              <Card className="h-full rounded-none border-none bg-background transition-all duration-200 group-hover:bg-muted/50">
                <CardHeader className="px-6 pt-6">
                  <div className="flex items-center gap-2 mb-4 flex-wrap">
                    <DifficultyBadge difficulty={p.difficulty} />
                    <ProblemStatusBadge problemSlug={p.slug} solutionCount={p.solutionCount} />
                    {p.categories.slice(0, 2).map((c) => (
                      <Badge key={c} variant="secondary" className="font-mono text-[9px] px-1.5 py-0 rounded-none bg-primary/10 text-primary">
                        {categoryLabelPt(c as Category).replace(/\s+/g, '_').toUpperCase()}
                      </Badge>
                    ))}
                  </div>
                  <CardTitle className="text-xl font-black uppercase tracking-tight group-hover:text-primary transition-colors">
                    {p.title}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-2 font-mono text-[10px] uppercase">
                    <span>{p.solutionCount} soluções</span>
                    <span className="h-1 w-1 bg-primary" />
                    <Clock className="h-3 w-3" /> {p.estimatedMinutes}m
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{p.excerpt}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {filteredSorted.length === 0 ? (
          <p className="mt-12 text-center text-sm text-muted-foreground">Nenhum problema corresponde aos filtros.</p>
        ) : null}
      </div>
    </div>
  );
}
