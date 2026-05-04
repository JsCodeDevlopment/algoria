import { promises as fs } from 'node:fs';
import path from 'node:path';

import { renderMarkdown } from './markdown';
import {
  AnnotationsFile,
  ConceptMeta,
  EngineeringWorkMeta,
  InterviewEnglishMeta,
  LANGUAGES,
  ProblemMeta,
  SolutionMeta,
  type Concept,
  type EngineeringWorkGuide,
  type InterviewEnglishTopic,
  type Language,
  type Problem,
  type Solution,
} from './schemas';

const CONTENT_ROOT = path.join(process.cwd(), 'content');

const PROBLEMS_DIR = path.join(CONTENT_ROOT, 'problems');
const CONCEPTS_DIR = path.join(CONTENT_ROOT, 'concepts');
const INTERVIEW_EN_DIR = path.join(CONTENT_ROOT, 'interview-en');
const ENGENHARIA_TRABALHO_DIR = path.join(CONTENT_ROOT, 'engenharia-trabalho');

const SOLUTION_FILES: Record<Language, string> = {
  typescript: 'solution.ts',
  javascript: 'solution.js',
  python: 'solution.py',
  java: 'solution.java',
  rust: 'solution.rs',
  go: 'solution.go',
  csharp: 'solution.cs',
};

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readJson<T>(file: string): Promise<T> {
  const raw = await fs.readFile(file, 'utf8');
  return JSON.parse(raw) as T;
}

async function readMarkdown(file: string): Promise<string> {
  try {
    const raw = await fs.readFile(file, 'utf8');
    return renderMarkdown(raw);
  } catch {
    return '';
  }
}

async function listDirs(parent: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(parent, { withFileTypes: true });
    return entries.filter((e) => e.isDirectory()).map((e) => e.name);
  } catch {
    return [];
  }
}

export async function getAllProblemSlugs(): Promise<string[]> {
  return listDirs(PROBLEMS_DIR);
}

export async function getAllConceptSlugs(): Promise<string[]> {
  return listDirs(CONCEPTS_DIR);
}

export async function getAllInterviewEnglishSlugs(): Promise<string[]> {
  return listDirs(INTERVIEW_EN_DIR);
}

export async function getAllEngineeringWorkSlugs(): Promise<string[]> {
  return listDirs(ENGENHARIA_TRABALHO_DIR);
}

async function loadSolution(problemDir: string, solutionSlug: string): Promise<Solution> {
  const dir = path.join(problemDir, 'solutions', solutionSlug);
  const meta = SolutionMeta.parse(await readJson<unknown>(path.join(dir, 'meta.json')));
  const codeByLanguage: Partial<Record<Language, string>> = {};
  for (const lang of LANGUAGES) {
    const fileName = SOLUTION_FILES[lang];
    const fp = path.join(dir, fileName);
    if (await fileExists(fp)) {
      codeByLanguage[lang] = await fs.readFile(fp, 'utf8');
    }
  }
  if (!codeByLanguage[meta.language]) {
    throw new Error(
      `Missing solution file for canonical language "${meta.language}" in ${solutionSlug} (expected ${SOLUTION_FILES[meta.language]})`,
    );
  }
  const introHtml = await readMarkdown(path.join(dir, 'intro.md'));
  const annotationsRaw = await readJson<unknown>(path.join(dir, 'annotations.json'));
  const annotations = AnnotationsFile.parse(annotationsRaw).annotations;
  return { meta, codeByLanguage, introHtml, annotations };
}

export async function getProblem(slug: string): Promise<Problem | null> {
  const dir = path.join(PROBLEMS_DIR, slug);
  let metaRaw: unknown;
  try {
    metaRaw = await readJson<unknown>(path.join(dir, 'meta.json'));
  } catch {
    return null;
  }
  const meta = ProblemMeta.parse(metaRaw);
  const descriptionHtml = await readMarkdown(path.join(dir, 'description.md'));
  const solutionSlugs = await listDirs(path.join(dir, 'solutions'));
  const solutions = await Promise.all(solutionSlugs.map((s) => loadSolution(dir, s)));
  // Stable ordering: brute-force first, then optimal, then alternatives.
  solutions.sort((a, b) => orderForKind(a.meta.kind) - orderForKind(b.meta.kind));
  return { meta, descriptionHtml, solutions };
}

function orderForKind(kind: string): number {
  switch (kind) {
    case 'brute-force':
      return 0;
    case 'optimal':
      return 1;
    case 'alternative':
      return 2;
    default:
      return 99;
  }
}

export async function getAllProblems(): Promise<Problem[]> {
  const slugs = await getAllProblemSlugs();
  const problems = await Promise.all(slugs.map((slug) => getProblem(slug)));
  return problems.filter((p): p is Problem => p !== null);
}

export async function getConcept(slug: string): Promise<Concept | null> {
  const dir = path.join(CONCEPTS_DIR, slug);
  let metaRaw: unknown;
  try {
    metaRaw = await readJson<unknown>(path.join(dir, 'meta.json'));
  } catch {
    return null;
  }
  const meta = ConceptMeta.parse(metaRaw);
  const bodyHtml = await readMarkdown(path.join(dir, 'body.md'));
  return { meta, bodyHtml };
}

export async function getAllConcepts(): Promise<Concept[]> {
  const slugs = await getAllConceptSlugs();
  const concepts = await Promise.all(slugs.map((slug) => getConcept(slug)));
  return concepts.filter((c): c is Concept => c !== null);
}

export async function getInterviewEnglishTopic(slug: string): Promise<InterviewEnglishTopic | null> {
  const dir = path.join(INTERVIEW_EN_DIR, slug);
  let metaRaw: unknown;
  try {
    metaRaw = await readJson<unknown>(path.join(dir, 'meta.json'));
  } catch {
    return null;
  }
  const meta = InterviewEnglishMeta.parse(metaRaw);
  const bodyHtml = await readMarkdown(path.join(dir, 'body.md'));
  return { meta, bodyHtml };
}

export async function getAllInterviewEnglishTopics(): Promise<InterviewEnglishTopic[]> {
  const slugs = await getAllInterviewEnglishSlugs();
  const topics = await Promise.all(slugs.map((slug) => getInterviewEnglishTopic(slug)));
  return topics.filter((t): t is InterviewEnglishTopic => t !== null);
}

export async function getEngineeringWorkGuide(slug: string): Promise<EngineeringWorkGuide | null> {
  const dir = path.join(ENGENHARIA_TRABALHO_DIR, slug);
  let metaRaw: unknown;
  try {
    metaRaw = await readJson<unknown>(path.join(dir, 'meta.json'));
  } catch {
    return null;
  }
  const meta = EngineeringWorkMeta.parse(metaRaw);
  const bodyHtml = await readMarkdown(path.join(dir, 'body.md'));
  return { meta, bodyHtml };
}

export async function getAllEngineeringWorkGuides(): Promise<EngineeringWorkGuide[]> {
  const slugs = await getAllEngineeringWorkSlugs();
  const guides = await Promise.all(slugs.map((slug) => getEngineeringWorkGuide(slug)));
  return guides.filter((g): g is EngineeringWorkGuide => g !== null);
}

export async function getSolution(problemSlug: string, solutionSlug: string): Promise<Solution | null> {
  try {
    return await loadSolution(path.join(PROBLEMS_DIR, problemSlug), solutionSlug);
  } catch {
    return null;
  }
}
