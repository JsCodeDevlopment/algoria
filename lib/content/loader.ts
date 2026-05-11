import { getContentRepository } from './content-repository';
import type {
  Concept,
  EngineeringWorkGuide,
  InterviewEnglishTopic,
  Problem,
  Solution,
} from './schemas';

const repo = getContentRepository();

export async function getAllProblemSlugs(): Promise<string[]> {
  const problems = await repo.getAllProblems();
  return problems.map(p => p.meta.slug);
}

export async function getAllConceptSlugs(): Promise<string[]> {
  const concepts = await repo.getAllConcepts();
  return concepts.map(c => c.meta.slug);
}

export async function getAllInterviewEnglishSlugs(): Promise<string[]> {
  const topics = await repo.getAllInterviewEnglishTopics();
  return topics.map(t => t.meta.slug);
}

export async function getAllEngineeringWorkSlugs(): Promise<string[]> {
  const guides = await repo.getAllEngineeringWorkGuides();
  return guides.map(g => g.meta.slug);
}

export async function getProblem(slug: string): Promise<Problem | null> {
  return repo.getProblem(slug);
}

export async function getAllProblems(): Promise<Problem[]> {
  return repo.getAllProblems();
}

export async function getConcept(slug: string): Promise<Concept | null> {
  return repo.getConcept(slug);
}

export async function getAllConcepts(): Promise<Concept[]> {
  return repo.getAllConcepts();
}

export async function getInterviewEnglishTopic(slug: string): Promise<InterviewEnglishTopic | null> {
  return repo.getInterviewEnglishTopic(slug);
}

export async function getAllInterviewEnglishTopics(): Promise<InterviewEnglishTopic[]> {
  return repo.getAllInterviewEnglishTopics();
}

export async function getEngineeringWorkGuide(slug: string): Promise<EngineeringWorkGuide | null> {
  return repo.getEngineeringWorkGuide(slug);
}

export async function getAllEngineeringWorkGuides(): Promise<EngineeringWorkGuide[]> {
  return repo.getAllEngineeringWorkGuides();
}

export async function getChangelogHtml(): Promise<string | null> {
  return repo.getChangelogHtml();
}

export async function getSolution(problemSlug: string, solutionSlug: string): Promise<Solution | null> {
  const problem = await repo.getProblem(problemSlug);
  if (!problem) return null;
  return problem.solutions.find(s => s.meta.slug === solutionSlug) ?? null;
}

/* ── Adjacent-content helpers (for prev/next navigation) ── */

interface AdjacentItem {
  slug: string;
  title: string;
}

interface AdjacentResult {
  prev: AdjacentItem | null;
  next: AdjacentItem | null;
}

async function getAdjacentFromRepo(
  slugs: string[],
  currentSlug: string,
  loadTitle: (slug: string) => Promise<string | null>,
): Promise<AdjacentResult> {
  const sortedSlugs = [...slugs].sort();
  const idx = sortedSlugs.indexOf(currentSlug);
  if (idx === -1) return { prev: null, next: null };

  let prev: AdjacentItem | null = null;
  let next: AdjacentItem | null = null;

  if (idx > 0) {
    const s = sortedSlugs[idx - 1]!;
    const title = await loadTitle(s);
    if (title) prev = { slug: s, title };
  }

  if (idx < sortedSlugs.length - 1) {
    const s = sortedSlugs[idx + 1]!;
    const title = await loadTitle(s);
    if (title) next = { slug: s, title };
  }

  return { prev, next };
}

export async function getAdjacentProblems(currentSlug: string): Promise<AdjacentResult> {
  const slugs = await getAllProblemSlugs();
  return getAdjacentFromRepo(slugs, currentSlug, async (s) => {
    const p = await getProblem(s);
    return p?.meta.title ?? null;
  });
}

export async function getAdjacentConcepts(currentSlug: string): Promise<AdjacentResult> {
  const slugs = await getAllConceptSlugs();
  return getAdjacentFromRepo(slugs, currentSlug, async (s) => {
    const c = await getConcept(s);
    return c?.meta.title ?? null;
  });
}

export async function getAdjacentInterviewEnglish(currentSlug: string): Promise<AdjacentResult> {
  const slugs = await getAllInterviewEnglishSlugs();
  return getAdjacentFromRepo(slugs, currentSlug, async (s) => {
    const t = await getInterviewEnglishTopic(s);
    return t?.meta.title ?? null;
  });
}

export async function getAdjacentEngineeringWork(currentSlug: string): Promise<AdjacentResult> {
  const slugs = await getAllEngineeringWorkSlugs();
  return getAdjacentFromRepo(slugs, currentSlug, async (s) => {
    const g = await getEngineeringWorkGuide(s);
    return g?.meta.title ?? null;
  });
}

