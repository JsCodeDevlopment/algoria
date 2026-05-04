import { ProblemsCatalogClient } from '@/components/catalog/problems-catalog-client';
import { catalogModelsFromProblems } from '@/lib/catalog/problem-card-model';
import { getAllProblems } from '@/lib/content/loader';

export const metadata = {
  title: 'Problemas',
  description: 'Catálogo filtrável: dificuldade, categoria, pesquisa e ordem recomendada. Progresso em localStorage.',
};

export default async function ProblemsPage() {
  const problems = await getAllProblems();
  const payload = catalogModelsFromProblems(problems);

  return <ProblemsCatalogClient problems={payload} />;
}
