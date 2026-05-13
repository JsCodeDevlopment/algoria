import { z } from 'zod';

export const DIFFICULTIES = ['easy', 'medium', 'hard'] as const;
export const CATEGORIES = [
  'arrays',
  'hash-tables',
  'two-pointers',
  'sliding-window',
  'binary-search',
  'linked-list',
  'trees',
  'graphs',
  'dynamic-programming',
  'greedy',
  'backtracking',
  'bit-manipulation',
  'math',
  'strings',
  'stacks',
  'queues',
  'recursion',
  'sorting',
] as const;

export const LANGUAGES = [
  'javascript',
  'typescript',
  'java',
  'rust',
  'go',
  'python',
  'csharp',
] as const;

export const SYSTEM_TYPES = [
  'changelog',
  'legal-page',
  'landing-section',
  'pricing-copy',
  'navigation',
  'taxonomy',
] as const;

export const SOLUTION_KINDS = ['brute-force', 'optimal', 'alternative'] as const;

export const Difficulty = z.enum(DIFFICULTIES);
export type Difficulty = z.infer<typeof Difficulty>;

export const Category = z.enum(CATEGORIES);
export type Category = z.infer<typeof Category>;

export const Language = z.enum(LANGUAGES);
export type Language = z.infer<typeof Language>;

export const SolutionKind = z.enum(SOLUTION_KINDS);
export type SolutionKind = z.infer<typeof SolutionKind>;

export const Complexity = z.object({
  time: z.string(),
  space: z.string(),
  rationale: z.string(),
});
export type Complexity = z.infer<typeof Complexity>;

export const Example = z.object({
  input: z.string(),
  output: z.string(),
  explanation: z.string().optional(),
});
export type Example = z.infer<typeof Example>;

export const CONTENT_ACCESS = ['free', 'pro'] as const;
export const ContentAccess = z.enum(CONTENT_ACCESS);
export type ContentAccess = z.infer<typeof ContentAccess>;

export const ProblemMeta = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  difficulty: Difficulty,
  categories: z.array(Category).min(1),
  prerequisites: z.array(z.string()).default([]),
  examples: z.array(Example).default([]),
  constraints: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  estimatedMinutes: z.number().int().positive().default(15),
  /** Menor aparece primeiro no modo «ordem recomendada» da Fase 1. */
  recommendedOrder: z.number().int().positive().optional(),
  /** `pro` = requer assinatura para player e soluções. Omisso = `pro`. */
  access: ContentAccess.default('pro'),
});
export type ProblemMeta = z.infer<typeof ProblemMeta>;

export const SolutionMeta = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  kind: SolutionKind,
  language: Language,
  complexity: Complexity,
  /** Identifier of the function/method that holds the solution.
   * Used by the player to know what to highlight as "the entry point". */
  entryFunction: z.string().optional(),
});
export type SolutionMeta = z.infer<typeof SolutionMeta>;

export const LineAnnotation = z.object({
  line: z.number().int().positive(),
  /** 1–2 sentence summary, plain markdown. Always required. */
  level1: z.string().min(1),
  /** Detailed explanation, full markdown — tab "Detalhado". */
  level2: z.string().min(1),
  /** Deep dive — tab "Deep dive". */
  level3: z.string().min(1),
  /** Slugs of concept pages relevant to this line. */
  concepts: z.array(z.string()).default([]),
  /** Common pitfalls for this line. */
  warnings: z.array(z.string()).default([]),
  /** Highlight a sub-range within the line for extra emphasis (column-based). */
  emphasis: z
    .object({
      from: z.number().int().nonnegative(),
      to: z.number().int().nonnegative(),
    })
    .optional(),
});
export type LineAnnotation = z.infer<typeof LineAnnotation>;

export const AnnotationsFile = z.object({
  annotations: z.array(LineAnnotation),
});
export type AnnotationsFile = z.infer<typeof AnnotationsFile>;

/** Modelo manual do estado em cada passo — MVP Fase 2 (arrays / mapas). */
export const ExecutionTraceArraySnapshotSchema = z.object({
  label: z.string().min(1),
  values: z.array(z.union([z.number(), z.string(), z.null()])),
  highlightIndices: z.array(z.number().int().nonnegative()).default([]),
});

export const ExecutionTraceSnapshotSchema = z.object({
  caption: z.string().optional(),
  arrays: z.array(ExecutionTraceArraySnapshotSchema).optional(),
  mapEntries: z.array(z.object({ key: z.string(), value: z.string() })).optional(),
  scalars: z.record(z.string(), z.string()).optional(),
});

export const ExecutionTraceStepSchema = z.object({
  line: z.number().int().positive(),
  snapshot: ExecutionTraceSnapshotSchema,
});

export const ExecutionTraceFileSchema = z.object({
  steps: z.array(ExecutionTraceStepSchema).min(1),
});

export type ExecutionTraceSnapshot = z.infer<typeof ExecutionTraceSnapshotSchema>;
export type ExecutionTraceStep = z.infer<typeof ExecutionTraceStepSchema>;

export const ConceptMeta = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  category: z.union([Category, z.literal('fundamentals')]),
  /** Nível editorial do mini-guia (filtro e badge na lista de conceitos). */
  difficulty: Difficulty.default('medium'),
  estimatedMinutes: z.number().int().positive().default(10),
  prerequisites: z.array(z.string()).default([]),
  summary: z.string().min(1),
  /** `pro` = requer assinatura. Omisso = `pro`. */
  access: ContentAccess.default('pro'),
});
export type ConceptMeta = z.infer<typeof ConceptMeta>;

/** Hydrated types — what the loader returns to the UI. */

export interface Solution {
  meta: SolutionMeta;
  /** Código por idioma (ficheiros `solution.{ext}` presentes nesta pasta). */
  codeByLanguage: Partial<Record<Language, string>>;
  /** Markdown of intro.md (rendered HTML by the loader). */
  introHtml: string;
  /** Annotations indexed by line number. */
  annotations: LineAnnotation[];
  /** Opcional — trace visual curado (`trace.json`). */
  executionTrace?: ExecutionTraceStep[];
}

export interface Problem {
  meta: ProblemMeta;
  /** Markdown of description.md (rendered HTML). */
  descriptionHtml: string;
  solutions: Solution[];
}

export interface Concept {
  meta: ConceptMeta;
  /** Markdown of body.md (rendered HTML). */
  bodyHtml: string;
}

/** Technical English focused on live coding / hiring conversations (content is EN). */
export const INTERVIEW_EN_TRACKS = ['vocabulary', 'communication', 'behavioral', 'system-design'] as const;
export const InterviewEnglishTrack = z.enum(INTERVIEW_EN_TRACKS);
export type InterviewEnglishTrack = z.infer<typeof InterviewEnglishTrack>;

export const InterviewEnglishMeta = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().min(1),
  estimatedMinutes: z.number().int().positive().default(12),
  track: InterviewEnglishTrack,
  difficulty: Difficulty.default('easy'),
  /** `pro` = requer assinatura. Omisso = `pro`. */
  access: ContentAccess.default('pro'),
});
export type InterviewEnglishMeta = z.infer<typeof InterviewEnglishMeta>;

export interface InterviewEnglishTopic {
  meta: InterviewEnglishMeta;
  bodyHtml: string;
}

/** Guias de engenharia aplicada ao dia-a-dia (produto, APIs, operação). */
export const ENGINEERING_WORK_PILLARS = ['frontend', 'backend', 'devops'] as const;
export const EngineeringWorkPillar = z.enum(ENGINEERING_WORK_PILLARS);
export type EngineeringWorkPillar = z.infer<typeof EngineeringWorkPillar>;

export const EngineeringWorkMeta = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().min(1),
  estimatedMinutes: z.number().int().positive().default(15),
  pillar: EngineeringWorkPillar,
  image: z.string().optional(),
  /** `pro` = requer assinatura. Omisso = `pro`. */
  access: ContentAccess.default('pro'),
});
export type EngineeringWorkMeta = z.infer<typeof EngineeringWorkMeta>;

export interface EngineeringWorkGuide {
  meta: EngineeringWorkMeta;
  bodyHtml: string;
}

/* ---- Cursos (fundamentos como trilha com progresso & certificado) ---- */

export const CourseExampleBlockSchema = z.object({
  title: z.string().min(1),
  /** Markdown PT — vista simples / introdutória. */
  simple: z.string().min(1),
  /** Markdown PT — vista profunda (nuances, invariantes, complexidade). */
  deep: z.string().min(1),
  code: z.string().optional(),
});
export type CourseExampleBlock = z.infer<typeof CourseExampleBlockSchema>;

export const CourseMcqExerciseSchema = z.object({
  id: z.string().min(1),
  stem: z.string().min(1),
  choices: z.array(z.string()).min(2),
  correctIndex: z.number().int().nonnegative(),
  explanationSimple: z.string().min(1),
  explanationDeep: z.string().min(1),
});
export type CourseMcqExercise = z.infer<typeof CourseMcqExerciseSchema>;

export const CourseModuleDefinition = z.object({
  id: z.string().min(1),
  linkedConceptSlug: z.string().min(1),
  linkedResourceKind: z.enum(['concept', 'interview-en']).default('concept'),
  certificateTitle: z.string().min(1),
  certificateTagline: z.string().optional(),
  examples: z.array(CourseExampleBlockSchema).min(1),
  exercises: z.array(CourseMcqExerciseSchema).min(1),
  capstone: CourseMcqExerciseSchema,
});
export type CourseModuleDefinition = z.infer<typeof CourseModuleDefinition>;

export const CoursePackParsed = z
  .object({
    slug: z.string().min(1),
    title: z.string().min(1),
    subtitle: z.string().min(1),
    modules: z.array(CourseModuleDefinition).min(1),
  })
  .superRefine((pack, ctx) => {
    const seen = new Set<string>();
    for (let mi = 0; mi < pack.modules.length; mi++) {
      const m = pack.modules[mi];
      if (!m) continue;
      if (seen.has(m.id)) {
        ctx.addIssue({ code: 'custom', message: `module id repetido: ${m.id}`, path: ['modules', mi, 'id'] });
      }
      seen.add(m.id);
      const all: { ex: CourseMcqExercise; path: (string | number)[] }[] = [
        ...m.exercises.map((ex, ei) => ({ ex, path: ['modules', mi, 'exercises', ei, 'correctIndex'] })),
        { ex: m.capstone, path: ['modules', mi, 'capstone', 'correctIndex'] },
      ];
      for (const { ex, path: ppath } of all) {
        if (ex.correctIndex >= ex.choices.length) {
          ctx.addIssue({ code: 'custom', message: `Índice de resposta fora do intervalo (${m.id} / ${ex.id})`, path: ppath });
        }
      }
    }
  });
export type CoursePackParsed = z.infer<typeof CoursePackParsed>;

export interface CourseExampleHydrated {
  title: string;
  simpleHtml: string;
  deepHtml: string;
  code?: string;
}

export interface CourseExerciseHydrated extends CourseMcqExercise {
  explanationSimpleHtml: string;
  explanationDeepHtml: string;
}

export interface CourseModuleHydrated {
  id: string;
  linkedConceptSlug: string;
  linkedResourceKind: 'concept' | 'interview-en';
  conceptSummary: string;
  certificateTitle: string;
  certificateTagline?: string;
  examples: CourseExampleHydrated[];
  exercises: CourseExerciseHydrated[];
  capstone: CourseExerciseHydrated;
}

export interface CoursePackHydrated {
  slug: string;
  title: string;
  subtitle: string;
  modules: CourseModuleHydrated[];
}

/* ── Technical Tests ─────────────────────────────────────────────── */

export type TestTrack = 'frontend' | 'backend' | 'devops';
export type TestLevel = 'junior' | 'pleno' | 'senior';
export type TestDifficulty = 'fácil' | 'médio' | 'difícil';

export interface QuizQuestion {
  id: string;
  question: string;
  options: {
    id: 'a' | 'b' | 'c' | 'd';
    text: string;
  }[];
  correctOptionId: 'a' | 'b' | 'c' | 'd';
  explanation: string;
}

export interface TestCase {
  id: string;
  description: string;
  assertion: string;
}

export interface LanguageTemplate {
  initialCode: string;
  testRunner: string;
}

export interface CodeChallenge {
  title: string;
  description: string;
  functionName: string;
  templates: Record<string, LanguageTemplate>;
  testCases: TestCase[];
}

export interface TestSolution {
  id: string;
  title: string;
  explanation: string;
  code: Record<string, string>;
}

export interface TechnicalTest {
  id: string;
  slug: string;
  track: TestTrack;
  level: TestLevel;
  difficulty: TestDifficulty;
  topic: string;
  title: string;
  description: string;
  timeLimitMinutes: number;
  questions: QuizQuestion[];
  challenge: CodeChallenge;
  solutions?: TestSolution[];
  access?: ContentAccess;
}

/* ── Pricing Copy ────────────────────────────────────────────────── */

export const PricingCopyMeta = z.object({
  freePerks: z.array(z.string()).default([]),
  proPerks: z.array(z.string()).default([]),
  monthlyPrice: z.string().optional(),
  yearlyNote: z.string().optional(),
});
export type PricingCopyMeta = z.infer<typeof PricingCopyMeta>;

export interface PricingCopy {
  id: string;
  slug: string;
  title: string;
  body: string;
  meta: PricingCopyMeta;
}
