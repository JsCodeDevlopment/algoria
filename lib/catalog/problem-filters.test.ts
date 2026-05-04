import { describe, expect, it } from 'vitest';

import { filterProblems, sortCatalogProblems } from '@/lib/catalog/problem-filters';
import type { Category, Difficulty } from '@/lib/content/schemas';

type Row = {
  title: string;
  difficulty: Difficulty;
  categories: Category[];
  recommendedOrder?: number;
};

const SAMPLE: Row[] = [
  { title: 'Alpha', difficulty: 'easy', categories: ['arrays'], recommendedOrder: 2 },
  { title: 'Beta', difficulty: 'hard', categories: ['graphs'], recommendedOrder: 1 },
  { title: 'Gamma', difficulty: 'medium', categories: ['hash-tables'], recommendedOrder: 3 },
];

describe('filterProblems', () => {
  it('filtra por texto no título', () => {
    expect(filterProblems(SAMPLE, 'alp', 'all', 'all')).toHaveLength(1);
    expect(filterProblems(SAMPLE, 'alp', 'all', 'all')[0]?.title).toBe('Alpha');
  });

  it('filtra por dificuldade', () => {
    expect(filterProblems(SAMPLE, '', 'easy', 'all')).toHaveLength(1);
  });

  it('filtra por categoria', () => {
    expect(filterProblems(SAMPLE, '', 'all', 'hash-tables')).toHaveLength(1);
  });
});

describe('sortCatalogProblems', () => {
  it('recommended usa recommendedOrder primeiro', () => {
    const sorted = sortCatalogProblems(SAMPLE, 'recommended');
    expect(sorted.map((x) => x.title)).toEqual(['Beta', 'Alpha', 'Gamma']);
  });

  it('difficulty_asc ordena easy antes de hard', () => {
    const sorted = sortCatalogProblems(SAMPLE, 'difficulty_asc');
    expect(sorted[0]?.difficulty).toBe('easy');
    expect(sorted[sorted.length - 1]?.difficulty).toBe('hard');
  });
});
