import type { Category, Difficulty } from '@/lib/content/schemas';

export type SortMode = 'recommended' | 'difficulty_asc' | 'title_az';

/** Valor sintético no select de filtros quando não há categoria fixa */
export type CategoryFilter = Category | 'all';

export function filterProblems<T extends { title: string; difficulty: Difficulty; categories: Category[] }>(
  items: T[],
  query: string,
  difficultyFilter: Difficulty | 'all',
  categoryFilter: CategoryFilter,
): T[] {
  const q = query.trim().toLowerCase();
  return items.filter((p) => {
    if (difficultyFilter !== 'all' && p.difficulty !== difficultyFilter) return false;
    if (categoryFilter !== 'all' && !p.categories.includes(categoryFilter)) return false;
    if (!q) return true;
    return p.title.toLowerCase().includes(q);
  });
}

export function sortCatalogProblems<
  T extends { title: string; difficulty: Difficulty; recommendedOrder?: number },
>(items: T[], mode: SortMode): T[] {
  const difficultyRank: Record<Difficulty, number> = { easy: 0, medium: 1, hard: 2 };
  const next = [...items];
  switch (mode) {
    case 'difficulty_asc':
      next.sort((a, b) => difficultyRank[a.difficulty] - difficultyRank[b.difficulty] || a.title.localeCompare(b.title));
      break;
    case 'title_az':
      next.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'recommended':
    default:
      next.sort((a, b) => {
        const oa = a.recommendedOrder;
        const ob = b.recommendedOrder;
        if (oa != null && ob != null && oa !== ob) return oa - ob;
        if (oa != null && ob == null) return -1;
        if (oa == null && ob != null) return 1;
        const td = difficultyRank[a.difficulty] - difficultyRank[b.difficulty];
        if (td !== 0) return td;
        return a.title.localeCompare(b.title);
      });
  }
  return next;
}

export const DIFFICULTY_LABEL_PT: Record<Difficulty | 'all', string> = {
  all: 'Qualquer nível',
  easy: 'Fácil',
  medium: 'Médio',
  hard: 'Difícil',
};
