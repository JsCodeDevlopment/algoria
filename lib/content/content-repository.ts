/**
 * ContentRepository — camada de abstração para leitura de conteúdo.
 *
 * Permite migração progressiva file → db controlada por feature flag
 * `CONTENT_SOURCE` (file | hybrid | db).
 *
 * No modo `hybrid`, tenta ler do banco primeiro e faz fallback para arquivo
 * quando o slug ainda não foi migrado.
 */

import type { Concept, EngineeringWorkGuide, InterviewEnglishTopic, Problem } from './schemas';
import type { StudyTrackFile } from './track-schema';

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

  getAllTechnicalTests(): Promise<any[]>;
  getTechnicalTestsByTrack(track: string): Promise<any[]>;
  getTechnicalTest(slug: string): Promise<any | null>;

  getAllCourses(): Promise<any[]>;
  getCourse(slug: string): Promise<any | null>;
}

/* ── DB-based provider (Phase 1 reads from contents table) ─ */

import { renderMarkdown } from './markdown';
import { db } from '@/lib/db';
import { contents } from '@/lib/db/schema';
import { and, eq } from 'drizzle-orm';

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

  async getAllTechnicalTests(): Promise<any[]> {
    const rows = await db
      .select()
      .from(contents)
      .where(and(eq(contents.type, 'technical-test'), eq(contents.status, 'PUBLISHED')));
    return rows.map(r => this.hydrateTechnicalTest(r));
  }
  async getTechnicalTestsByTrack(track: string): Promise<any[]> {
    const rows = await db
      .select()
      .from(contents)
      .where(and(eq(contents.type, 'technical-test'), eq(contents.status, 'PUBLISHED')));
    return rows.map(r => this.hydrateTechnicalTest(r)).filter(t => t.track === track);
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

  async getTechnicalTest(slug: string): Promise<any | null> {
    const [row] = await db
      .select()
      .from(contents)
      .where(and(eq(contents.slug, slug), eq(contents.type, 'technical-test'), eq(contents.status, 'PUBLISHED')))
      .limit(1);
    return row ? this.hydrateTechnicalTest(row) : null;
  }

  private hydrateTechnicalTest(row: any) {
    const metadata = row.metadata as any;
    const body = JSON.parse(row.body); // Technical tests body stores the full JSON
    return {
      ...body,
      id: row.id,
      slug: row.slug,
      title: row.title,
      track: metadata.track,
      level: metadata.level,
      difficulty: metadata.difficulty,
      topic: metadata.topic,
    };
  }

  async getAllCourses(): Promise<any[]> {
    const rows = await db
      .select()
      .from(contents)
      .where(and(eq(contents.type, 'course'), eq(contents.status, 'PUBLISHED')));
    return rows.map(r => JSON.parse(r.body));
  }

  async getCourse(slug: string): Promise<any | null> {
    const [row] = await db
      .select()
      .from(contents)
      .where(and(eq(contents.slug, slug), eq(contents.type, 'course'), eq(contents.status, 'PUBLISHED')))
      .limit(1);
    return row ? JSON.parse(row.body) : null;
  }

  private hydrateProblem(row: any): Problem {
    const meta = row.metadata;
    return {
      meta: {
        slug: row.slug,
        title: row.title,
        difficulty: meta.difficulty,
        categories: meta.categories,
        prerequisites: meta.prerequisites ?? [],
        examples: meta.examples ?? [],
        constraints: meta.constraints ?? [],
        tags: meta.tags ?? [],
        estimatedMinutes: meta.estimatedMinutes ?? 15,
        recommendedOrder: meta.recommendedOrder,
        access: meta.access ?? 'pro',
      },
      descriptionHtml: renderMarkdown(row.body),
      solutions: (meta.solutions ?? []).map((s: any) => ({
        meta: {
          slug: s.meta?.slug || s.slug,
          name: s.meta?.name || s.name,
          kind: s.meta?.kind || s.kind,
          language: s.meta?.language || s.language,
          complexity: s.meta?.complexity || s.complexity,
          entryFunction: s.meta?.entryFunction || s.entryFunction,
        },
        codeByLanguage: s.codeByLanguage ?? {},
        introHtml: s.introHtml || renderMarkdown(s.introMd ?? ''),
        annotations: s.annotations ?? [],
        executionTrace: s.executionTrace,
      })),
    };
  }

  private hydrateConcept(row: any): Concept {
    return {
      meta: {
        ...row.metadata,
        slug: row.slug,
        title: row.title,
      },
      bodyHtml: renderMarkdown(row.body),
    };
  }

  private hydrateInterviewEn(row: any): InterviewEnglishTopic {
    return {
      meta: {
        ...row.metadata,
        slug: row.slug,
        title: row.title,
      },
      bodyHtml: renderMarkdown(row.body),
    };
  }

  private hydrateEngineeringWork(row: any): EngineeringWorkGuide {
    return {
      meta: {
        ...row.metadata,
        slug: row.slug,
        title: row.title,
      },
      bodyHtml: renderMarkdown(row.body, { didacticBlocks: true }),
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
