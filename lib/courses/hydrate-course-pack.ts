import { getConcept } from '@/lib/content/loader';
import { renderMarkdown } from '@/lib/content/markdown';
import type {
  CourseExerciseHydrated,
  CourseExampleHydrated,
  CourseMcqExercise,
  CourseModuleDefinition,
  CourseModuleHydrated,
  CoursePackHydrated,
  CoursePackParsed,
} from '@/lib/content/schemas';

import { FUNDAMENTOS_FASE_1_PACK } from '@/lib/courses/fundamentos-fase1-seed';

async function mapExercise(ex: CourseMcqExercise): Promise<CourseExerciseHydrated> {
  return {
    ...ex,
    explanationSimpleHtml: renderMarkdown(ex.explanationSimple),
    explanationDeepHtml: renderMarkdown(ex.explanationDeep),
  };
}

async function mapModule(def: CourseModuleDefinition): Promise<CourseModuleHydrated> {
  const concept = await getConcept(def.linkedConceptSlug);
  const examples: CourseExampleHydrated[] = await Promise.all(
    def.examples.map(async (ex) => ({
      title: ex.title,
      simpleHtml: renderMarkdown(ex.simple),
      deepHtml: renderMarkdown(ex.deep),
      code: ex.code,
    })),
  );
  const exercises = await Promise.all(def.exercises.map(mapExercise));
  const capstone = await mapExercise(def.capstone);

  return {
    id: def.id,
    linkedConceptSlug: def.linkedConceptSlug,
    conceptSummary: concept?.meta.summary ?? '',
    certificateTitle: def.certificateTitle,
    certificateTagline: def.certificateTagline,
    examples,
    exercises,
    capstone,
  };
}

export async function hydrateCoursePack(parsed: CoursePackParsed): Promise<CoursePackHydrated> {
  const modules = await Promise.all(parsed.modules.map(mapModule));
  return {
    slug: parsed.slug,
    title: parsed.title,
    subtitle: parsed.subtitle,
    modules,
  };
}

/** Hoje apenas um pacote empacotado; futuros cursos ficam lado a lado. */
export async function listCourseSlugs(): Promise<string[]> {
  return [FUNDAMENTOS_FASE_1_PACK.slug];
}

export async function getCoursePackHydrated(slug: string): Promise<CoursePackHydrated | null> {
  if (slug === FUNDAMENTOS_FASE_1_PACK.slug) {
    return hydrateCoursePack(FUNDAMENTOS_FASE_1_PACK);
  }
  return null;
}
