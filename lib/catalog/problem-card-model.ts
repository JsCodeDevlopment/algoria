import { getProblemAccess } from '@/lib/billing/tiering';
import type { Problem } from '@/lib/content/schemas';
import { stripHtmlLoose } from '@/lib/seo/strip-html';

export type ProblemsCatalogProblem = Pick<
  Problem['meta'],
  'slug' | 'title' | 'difficulty' | 'categories' | 'tags' | 'estimatedMinutes' | 'recommendedOrder'
> & {
  solutionCount: number;
  excerpt: string;
  access: Problem['meta']['access'];
};

export function problemToCatalogModel(p: Problem): ProblemsCatalogProblem {
  const plain = stripHtmlLoose(p.descriptionHtml);
  return {
    slug: p.meta.slug,
    title: p.meta.title,
    difficulty: p.meta.difficulty,
    categories: p.meta.categories,
    tags: p.meta.tags,
    estimatedMinutes: p.meta.estimatedMinutes,
    recommendedOrder: p.meta.recommendedOrder ?? undefined,
    solutionCount: p.solutions.length,
    excerpt: plain.length > 220 ? `${plain.slice(0, 220)}…` : plain,
    access: getProblemAccess(p.meta),
  };
}

export function catalogModelsFromProblems(problems: Problem[]): ProblemsCatalogProblem[] {
  return problems.map(problemToCatalogModel);
}
