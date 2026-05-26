import type { Metadata } from 'next';

import { ProblemsCatalogClient } from '@/components/catalog/problems-catalog-client';
import { DailyChallengeBanner } from '@/components/gamification/daily-challenge-banner';
import { catalogModelsFromProblems } from '@/lib/catalog/problem-card-model';
import { getAllProblems } from '@/lib/content/loader';
import { getDailyChallenge } from '@/lib/gamification/daily-challenge';
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

  const slugs = problems.map((p) => p.meta.slug);
  const metaMap = new Map(
    problems.map((p) => [p.meta.slug, { title: p.meta.title, difficulty: p.meta.difficulty }]),
  );
  const daily = getDailyChallenge(slugs, metaMap);

  return (
    <div>
      {daily && (
        <div className="mx-auto max-w-7xl px-6 pt-6">
          <DailyChallengeBanner
            slug={daily.slug}
            title={daily.title}
            difficulty={daily.difficulty}
            dateKey={daily.dateKey}
          />
        </div>
      )}
      <ProblemsCatalogClient problems={payload} />
    </div>
  );
}
