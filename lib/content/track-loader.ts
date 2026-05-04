import { promises as fs } from 'node:fs';
import path from 'node:path';

import type { Problem } from '@/lib/content/schemas';

import { StudyTrackFileSchema, type StudyTrackFile } from '@/lib/content/track-schema';

const TRACKS_DIR = path.join(process.cwd(), 'content', 'tracks');

async function listTrackFiles(): Promise<string[]> {
  try {
    const entries = await fs.readdir(TRACKS_DIR, { withFileTypes: true });
    return entries.filter((e) => e.isFile() && e.name.endsWith('.json')).map((e) => e.name);
  } catch {
    return [];
  }
}

export async function getStudyTrackSlugs(): Promise<string[]> {
  const files = await listTrackFiles();
  return files
    .map((f) => f.replace(/\.json$/i, ''))
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));
}

export async function getStudyTrack(slug: string): Promise<StudyTrackFile | null> {
  const fp = path.join(TRACKS_DIR, `${slug}.json`);
  try {
    const raw = JSON.parse(await fs.readFile(fp, 'utf8')) as unknown;
    const parsed = StudyTrackFileSchema.safeParse(raw);
    if (!parsed.success || parsed.data.slug !== slug) return null;
    return parsed.data;
  } catch {
    return null;
  }
}

export async function getAllStudyTracks(): Promise<StudyTrackFile[]> {
  const slugs = await getStudyTrackSlugs();
  const out: StudyTrackFile[] = [];
  for (const s of slugs) {
    const t = await getStudyTrack(s);
    if (t) out.push(t);
  }
  return out;
}

/** Ordena instâncias de `Problem` pela lista editorial da trilha; ignora slugs em falta. */
export function orderProblemsForTrack(track: StudyTrackFile, problems: Problem[]): Problem[] {
  const map = new Map(problems.map((p) => [p.meta.slug, p]));
  const ordered: Problem[] = [];
  for (const slug of track.problemSlugs) {
    const p = map.get(slug);
    if (p) ordered.push(p);
  }
  return ordered;
}
