import { getContentRepository } from './content-repository';
import type { Problem } from '@/lib/content/schemas';
import type { StudyTrackFile } from '@/lib/content/track-schema';

const repo = getContentRepository();

export async function getStudyTrackSlugs(): Promise<string[]> {
  const tracks = await repo.getAllStudyTracks();
  return tracks.map(t => t.slug).sort();
}

export async function getStudyTrack(slug: string): Promise<StudyTrackFile | null> {
  return repo.getStudyTrack(slug);
}

export async function getAllStudyTracks(): Promise<StudyTrackFile[]> {
  return repo.getAllStudyTracks();
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
