import type { Metadata } from 'next';

import { ProblemsCatalogClient } from '@/components/catalog/problems-catalog-client';
import { catalogModelsFromProblems } from '@/lib/catalog/problem-card-model';
import { getAllProblems } from '@/lib/content/loader';
import { buildPublicMetadata } from '@/lib/seo/build-metadata';

export const metadata: Metadata = buildPublicMetadata({
  title: 'Catálogo de problemas de algoritmos',
  description:
    'Catálogo filtrável por dificuldade, categoria e tags: cada problema com várias soluções comentadas linha-a-linha e progresso guardado no browser.',
  pathname: '/problems',
  keywords: [
    'catálogo problemas',
    'algoritmos exercícios',
    'LeetCode português',
    'estruturas de dados',
    'brute force vs ótimo',
    'code player',
  ],
});

export default async function ProblemsPage() {
  const problems = await getAllProblems();
  const payload = catalogModelsFromProblems(problems);

  return <ProblemsCatalogClient problems={payload} />;
}
