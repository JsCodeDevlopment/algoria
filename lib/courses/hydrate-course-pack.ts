import { getContentRepository } from '@/lib/content/content-repository';
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

async function mapExercise(ex: CourseMcqExercise): Promise<CourseExerciseHydrated> {
  return {
    ...ex,
    explanationSimpleHtml: renderMarkdown(ex.explanationSimple),
    explanationDeepHtml: renderMarkdown(ex.explanationDeep),
  };
}

async function mapModule(def: CourseModuleDefinition): Promise<CourseModuleHydrated> {
  const repo = getContentRepository();
  const concept =
    def.linkedResourceKind === 'interview-en'
      ? await repo.getInterviewEnglishTopic(def.linkedConceptSlug)
      : await repo.getConcept(def.linkedConceptSlug);
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
    linkedResourceKind: def.linkedResourceKind,
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

/** Pacotes editoriais disponíveis no catálogo de cursos. */
export async function listCourseSlugs(): Promise<string[]> {
  const repo = getContentRepository();
  const courses = await repo.getAllCourses();
  return courses.map(c => c.slug);
}

export async function getCoursePackHydrated(slug: string): Promise<CoursePackHydrated | null> {
  const repo = getContentRepository();
  const course = await repo.getCourse(slug);
  if (!course) return null;
  return hydrateCoursePack(course);
}
