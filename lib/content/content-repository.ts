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
}

/* ── File-based provider (legado — wraps existing loaders) ─────── */

import * as fileLoader from './loader';
import * as trackLoader from './track-loader';

class FileContentRepository implements ContentRepository {
  getAllProblems = fileLoader.getAllProblems;
  getProblem = fileLoader.getProblem;

  getAllConcepts = fileLoader.getAllConcepts;
  getConcept = fileLoader.getConcept;

  getAllInterviewEnglishTopics = fileLoader.getAllInterviewEnglishTopics;
  getInterviewEnglishTopic = fileLoader.getInterviewEnglishTopic;

  getAllEngineeringWorkGuides = fileLoader.getAllEngineeringWorkGuides;
  getEngineeringWorkGuide = fileLoader.getEngineeringWorkGuide;

  getAllStudyTracks = trackLoader.getAllStudyTracks;
  getStudyTrack = trackLoader.getStudyTrack;

  getChangelogHtml = fileLoader.getChangelogHtml;
}

/* ── DB-based provider (stub — Phase 1 reads from contents table) ─ */

import { db } from '@/lib/db';
import { contents } from '@/lib/db/schema';
import { and, eq } from 'drizzle-orm';

class DbContentRepository implements ContentRepository {
  // Phase 1: Stub — will be fleshed out as content is migrated
  async getAllProblems(): Promise<Problem[]> {
    // TODO: query contents table where type='problem' and status='PUBLISHED'
    return [];
  }
  async getProblem(_slug: string): Promise<Problem | null> {
    const row = await db.select().from(contents)
      .where(and(eq(contents.slug, _slug), eq(contents.type, 'problem'), eq(contents.status, 'PUBLISHED')))
      .limit(1);
    if (!row[0]) return null;
    // TODO: hydrate full Problem from row + metadata JSON
    return null;
  }
  async getAllConcepts(): Promise<Concept[]> { return []; }
  async getConcept(_slug: string): Promise<Concept | null> { return null; }
  async getAllInterviewEnglishTopics(): Promise<InterviewEnglishTopic[]> { return []; }
  async getInterviewEnglishTopic(_slug: string): Promise<InterviewEnglishTopic | null> { return null; }
  async getAllEngineeringWorkGuides(): Promise<EngineeringWorkGuide[]> { return []; }
  async getEngineeringWorkGuide(_slug: string): Promise<EngineeringWorkGuide | null> { return null; }
  async getAllStudyTracks(): Promise<StudyTrackFile[]> { return []; }
  async getStudyTrack(_slug: string): Promise<StudyTrackFile | null> { return null; }
  async getChangelogHtml(): Promise<string | null> { return null; }
}

/* ── Hybrid provider (tries DB first, falls back to file) ──────── */

class HybridContentRepository implements ContentRepository {
  private dbRepo = new DbContentRepository();
  private fileRepo = new FileContentRepository();

  async getAllProblems() {
    const dbResults = await this.dbRepo.getAllProblems();
    if (dbResults.length > 0) return dbResults;
    return this.fileRepo.getAllProblems();
  }

  async getProblem(slug: string) {
    const dbResult = await this.dbRepo.getProblem(slug);
    if (dbResult) return dbResult;
    return this.fileRepo.getProblem(slug);
  }

  async getAllConcepts() {
    const dbResults = await this.dbRepo.getAllConcepts();
    if (dbResults.length > 0) return dbResults;
    return this.fileRepo.getAllConcepts();
  }

  async getConcept(slug: string) {
    return (await this.dbRepo.getConcept(slug)) ?? this.fileRepo.getConcept(slug);
  }

  async getAllInterviewEnglishTopics() {
    const dbResults = await this.dbRepo.getAllInterviewEnglishTopics();
    if (dbResults.length > 0) return dbResults;
    return this.fileRepo.getAllInterviewEnglishTopics();
  }

  async getInterviewEnglishTopic(slug: string) {
    return (await this.dbRepo.getInterviewEnglishTopic(slug)) ?? this.fileRepo.getInterviewEnglishTopic(slug);
  }

  async getAllEngineeringWorkGuides() {
    const dbResults = await this.dbRepo.getAllEngineeringWorkGuides();
    if (dbResults.length > 0) return dbResults;
    return this.fileRepo.getAllEngineeringWorkGuides();
  }

  async getEngineeringWorkGuide(slug: string) {
    return (await this.dbRepo.getEngineeringWorkGuide(slug)) ?? this.fileRepo.getEngineeringWorkGuide(slug);
  }

  async getAllStudyTracks() {
    const dbResults = await this.dbRepo.getAllStudyTracks();
    if (dbResults.length > 0) return dbResults;
    return this.fileRepo.getAllStudyTracks();
  }

  async getStudyTrack(slug: string) {
    return (await this.dbRepo.getStudyTrack(slug)) ?? this.fileRepo.getStudyTrack(slug);
  }

  async getChangelogHtml() {
    return (await this.dbRepo.getChangelogHtml()) ?? this.fileRepo.getChangelogHtml();
  }
}

/* ── Factory (feature flag) ───────────────────────────────────── */

export type ContentSource = 'file' | 'hybrid' | 'db';

let _instance: ContentRepository | null = null;

export function getContentRepository(): ContentRepository {
  if (_instance) return _instance;

  const source = (process.env.CONTENT_SOURCE ?? 'file') as ContentSource;

  switch (source) {
    case 'db':
      _instance = new DbContentRepository();
      break;
    case 'hybrid':
      _instance = new HybridContentRepository();
      break;
    case 'file':
    default:
      _instance = new FileContentRepository();
      break;
  }

  return _instance;
}
