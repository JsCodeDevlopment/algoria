import { z } from 'zod';

/** Metadados de uma trilha curada (`content/tracks/<slug>.json`). */
export const StudyTrackFileSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().min(1),
  problemSlugs: z.array(z.string().min(1)).min(1),
});

export type StudyTrackFile = z.infer<typeof StudyTrackFileSchema>;
