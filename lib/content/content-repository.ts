/**
 * ContentRepository — camada de abstração para leitura de conteúdo.
 *
 * Permite migração progressiva file → db controlada por feature flag
 * `CONTENT_SOURCE` (file | hybrid | db).
 *
 * No modo `hybrid`, tenta ler do banco primeiro e faz fallback para arquivo
 * quando o slug ainda não foi migrado.
 */

import type {
  Concept,
  EngineeringWorkGuide,
  InterviewEnglishTopic,
  Problem,
  Difficulty,
  Category,
  Language,
  SolutionKind,
  ContentAccess,
  Complexity,
  Example,
  LineAnnotation,
  ExecutionTraceStep,
  TestTrack,
  TestLevel,
  TestDifficulty,
  PricingCopy,
} from './schemas';
import type { StudyTrackFile } from './track-schema';

export interface ContentAccessCounts {
  free: Record<string, number>;
  pro: Record<string, number>;
}

/* ── Interface pública ──────────────────────────────────────────── */

export interface ContentRepository {
  getAllProblems(): Promise<Problem[]>;
  getProblem(slug: string): Promise<Problem | null>;

  getAllConcepts(): Promise<Concept[]>;
  getConcept(slug: string): Promise<Concept | null>;

  getAllInterviewEnglishTopics(): Promise<InterviewEnglishTopic[]>;
  getInterviewEnglishTopic(slug: string): Promise<InterviewEnglishTopic | null>;

  getAllEngineeringWorkGuides(): Promise<EngineeringWorkGuide[]>;
  getEngineeringWorkGuide(slug: string): Promise<EngineeringWorkGuide | null>;

  getAllStudyTracks(): Promise<StudyTrackFile[]>;
  getStudyTrack(slug: string): Promise<StudyTrackFile | null>;

  getChangelogHtml(): Promise<string | null>;

  getAllTechnicalTests(): Promise<TechnicalTest[]>;
  getTechnicalTestsByTrack(track: string): Promise<TechnicalTest[]>;
  getTechnicalTest(slug: string): Promise<TechnicalTest | null>;

  getAllCourses(): Promise<CoursePackParsed[]>;
  getCourse(slug: string): Promise<CoursePackParsed | null>;

  getPricingCopy(slug: string): Promise<PricingCopy | null>;
  getContentCountsByAccess(): Promise<ContentAccessCounts>;
}

import { renderMarkdown } from './markdown';
import { db } from '@/lib/db';
import { contents } from '@/lib/db/schema';
import { and, eq, count } from 'drizzle-orm';
import type { CoursePackParsed, TechnicalTest } from './schemas';

type ContentRow = typeof contents.$inferSelect;

class DbContentRepository implements ContentRepository {
  async getAllProblems(): Promise<Problem[]> {
    const rows = await db
      .select()
      .from(contents)
      .where(and(eq(contents.type, 'problem'), eq(contents.status, 'PUBLISHED')));

    return rows.map((r) => this.hydrateProblem(r));
  }

  async getProblem(slug: string): Promise<Problem | null> {
    const [row] = await db
      .select()
      .from(contents)
      .where(and(eq(contents.slug, slug), eq(contents.type, 'problem'), eq(contents.status, 'PUBLISHED')))
      .limit(1);

    if (!row) return null;
    return this.hydrateProblem(row);
  }

  async getAllConcepts(): Promise<Concept[]> {
    const rows = await db
      .select()
      .from(contents)
      .where(and(eq(contents.type, 'concept'), eq(contents.status, 'PUBLISHED')));
    return rows.map((r) => this.hydrateConcept(r));
  }

  async getConcept(slug: string): Promise<Concept | null> {
    const [row] = await db
      .select()
      .from(contents)
      .where(and(eq(contents.slug, slug), eq(contents.type, 'concept'), eq(contents.status, 'PUBLISHED')))
      .limit(1);
    return row ? this.hydrateConcept(row) : null;
  }

  async getAllInterviewEnglishTopics(): Promise<InterviewEnglishTopic[]> {
    const rows = await db
      .select()
      .from(contents)
      .where(and(eq(contents.type, 'interview-en'), eq(contents.status, 'PUBLISHED')));
    return rows.map((r) => this.hydrateInterviewEn(r));
  }

  async getInterviewEnglishTopic(slug: string): Promise<InterviewEnglishTopic | null> {
    const [row] = await db
      .select()
      .from(contents)
      .where(and(eq(contents.slug, slug), eq(contents.type, 'interview-en'), eq(contents.status, 'PUBLISHED')))
      .limit(1);
    return row ? this.hydrateInterviewEn(row) : null;
  }

  async getAllEngineeringWorkGuides(): Promise<EngineeringWorkGuide[]> {
    const rows = await db
      .select()
      .from(contents)
      .where(and(eq(contents.type, 'engineering-work'), eq(contents.status, 'PUBLISHED')));
    return rows.map((r) => this.hydrateEngineeringWork(r));
  }

  async getEngineeringWorkGuide(slug: string): Promise<EngineeringWorkGuide | null> {
    const [row] = await db
      .select()
      .from(contents)
      .where(and(eq(contents.slug, slug), eq(contents.type, 'engineering-work'), eq(contents.status, 'PUBLISHED')))
      .limit(1);
    return row ? this.hydrateEngineeringWork(row) : null;
  }

  async getAllStudyTracks(): Promise<StudyTrackFile[]> {
    const rows = await db
      .select()
      .from(contents)
      .where(and(eq(contents.type, 'track'), eq(contents.status, 'PUBLISHED')));
    return rows.map((r) => r.metadata as unknown as StudyTrackFile);
  }

  async getStudyTrack(slug: string): Promise<StudyTrackFile | null> {
    const [row] = await db
      .select()
      .from(contents)
      .where(and(eq(contents.slug, slug), eq(contents.type, 'track'), eq(contents.status, 'PUBLISHED')))
      .limit(1);
    return row ? (row.metadata as unknown as StudyTrackFile) : null;
  }

  async getChangelogHtml(): Promise<string | null> {
    const [row] = await db
      .select()
      .from(contents)
      .where(eq(contents.type, 'changelog'))
      .limit(1);
    return row ? renderMarkdown(row.body) : null;
  }

  async getAllTechnicalTests(): Promise<TechnicalTest[]> {
    const rows = await db
      .select()
      .from(contents)
      .where(and(eq(contents.type, 'technical-test'), eq(contents.status, 'PUBLISHED')));
    return rows.map(r => this.hydrateTechnicalTest(r));
  }

  async getTechnicalTestsByTrack(track: string): Promise<TechnicalTest[]> {
    const rows = await db
      .select()
      .from(contents)
      .where(and(eq(contents.type, 'technical-test'), eq(contents.status, 'PUBLISHED')));
    return rows.map(r => this.hydrateTechnicalTest(r)).filter(t => t.track === track);
  }

  async getTechnicalTest(slug: string): Promise<TechnicalTest | null> {
    const [row] = await db
      .select()
      .from(contents)
      .where(and(eq(contents.slug, slug), eq(contents.type, 'technical-test'), eq(contents.status, 'PUBLISHED')))
      .limit(1);
    return row ? this.hydrateTechnicalTest(row) : null;
  }

  async getAllCourses(): Promise<CoursePackParsed[]> {
    const rows = await db
      .select()
      .from(contents)
      .where(and(eq(contents.type, 'course'), eq(contents.status, 'PUBLISHED')));
    return rows.map((r) => JSON.parse(r.body));
  }

  async getCourse(slug: string): Promise<CoursePackParsed | null> {
    const [row] = await db
      .select()
      .from(contents)
      .where(and(eq(contents.slug, slug), eq(contents.type, 'course'), eq(contents.status, 'PUBLISHED')))
      .limit(1);
    return row ? JSON.parse(row.body) : null;
  }

  async getPricingCopy(slug: string): Promise<PricingCopy | null> {
    const [row] = await db
      .select()
      .from(contents)
      .where(and(eq(contents.slug, slug), eq(contents.type, 'pricing-copy'), eq(contents.status, 'PUBLISHED')))
      .limit(1);
    return row ? this.hydratePricingCopy(row) : null;
  }

  async getContentCountsByAccess(): Promise<ContentAccessCounts> {
    const rows = await db
      .select({
        type: contents.type,
        access: contents.access,
        total: count(),
      })
      .from(contents)
      .where(eq(contents.status, 'PUBLISHED'))
      .groupBy(contents.type, contents.access);

    const result: ContentAccessCounts = {
      free: {},
      pro: {},
    };

    rows.forEach((r) => {
      const access = r.access as 'free' | 'pro';
      const type = r.type as string;
      result[access][type] = Number(r.total);
    });

    return result;
  }

  private hydrateTechnicalTest(row: ContentRow): TechnicalTest {
    const metadata = row.metadata as Record<string, unknown>;
    const body = JSON.parse(row.body);
    return {
      ...body,
      id: row.id,
      slug: row.slug,
      title: row.title,
      track: (metadata.track || body.track) as TestTrack,
      level: (metadata.level || body.level) as TestLevel,
      difficulty: (metadata.difficulty || body.difficulty) as TestDifficulty,
      topic: (metadata.topic || body.topic) as string,
      access: row.access as ContentAccess,
    } as unknown as TechnicalTest;
  }

  private hydrateProblem(row: ContentRow): Problem {
    const meta = row.metadata as Record<string, unknown>;
    return {
      meta: {
        slug: row.slug,
        title: row.title,
        difficulty: (meta.difficulty as Difficulty) || 'medium',
        categories: (meta.categories as Category[]) || [],
        prerequisites: (meta.prerequisites as string[]) ?? [],
        examples: (meta.examples as Example[]) ?? [],
        constraints: (meta.constraints as string[]) ?? [],
        tags: (meta.tags as string[]) ?? [],
        estimatedMinutes: (meta.estimatedMinutes as number) ?? 15,
        recommendedOrder: meta.recommendedOrder as number | undefined,
        hasBespokeVisualizer: (meta.hasBespokeVisualizer as boolean) ?? false,
        access: row.access as ContentAccess,
      },
      descriptionHtml: renderMarkdown(row.body),
      solutions: ((meta.solutions as Record<string, unknown>[]) ?? []).map((s) => {
        const sMeta = (s.meta || {}) as Record<string, unknown>;
        return {
          meta: {
            slug: (sMeta.slug as string) || (s.slug as string),
            name: (sMeta.name as string) || (s.name as string),
            kind: (sMeta.kind as SolutionKind) || (s.kind as SolutionKind),
            language: (sMeta.language as Language) || (s.language as Language),
            complexity: (sMeta.complexity as Complexity) || (s.complexity as Complexity), 
            entryFunction: (sMeta.entryFunction as string) || (s.entryFunction as string),
            simulatorCode: sMeta.simulatorCode as string | undefined,
          },
          codeByLanguage: (s.codeByLanguage as Record<string, string>) ?? {},
          introHtml: (s.introHtml as string) || renderMarkdown((s.introMd as string) ?? ''),
          annotations: (s.annotations as LineAnnotation[]) ?? [],
          executionTrace: s.executionTrace as ExecutionTraceStep[],
        };
      }),
    };
  }

  private hydrateConcept(row: ContentRow): Concept {
    return {
      meta: {
        ...(row.metadata as Record<string, unknown>),
        slug: row.slug,
        title: row.title,
        access: row.access as ContentAccess,
      } as Concept['meta'],
      bodyHtml: renderMarkdown(row.body),
    };
  }

  private hydrateInterviewEn(row: ContentRow): InterviewEnglishTopic {
    return {
      meta: {
        ...(row.metadata as Record<string, unknown>),
        slug: row.slug,
        title: row.title,
        access: row.access as ContentAccess,
      } as InterviewEnglishTopic['meta'],
      bodyHtml: renderMarkdown(row.body),
    };
  }

  private hydrateEngineeringWork(row: ContentRow): EngineeringWorkGuide {
    return {
      meta: {
        ...(row.metadata as Record<string, unknown>),
        slug: row.slug,
        title: row.title,
        access: row.access as ContentAccess,
      } as EngineeringWorkGuide['meta'],
      bodyHtml: renderMarkdown(row.body, { didacticBlocks: true }),
    };
  }

  private hydratePricingCopy(row: ContentRow): PricingCopy {
    return {
      id: row.id,
      slug: row.slug,
      title: row.title,
      body: row.body,
      meta: row.metadata as PricingCopy['meta'],
    };
  }
}

/* ── Factory (feature flag) ───────────────────────────────────── */

export type ContentSource = 'file' | 'hybrid' | 'db';

let _instance: ContentRepository | null = null;

export function getContentRepository(): ContentRepository {
  if (_instance) return _instance;
  _instance = new DbContentRepository();
  return _instance;
}
