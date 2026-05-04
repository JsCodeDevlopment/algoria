#!/usr/bin/env npx tsx
/**
 * Garante level1+level2+level3 em todas as anotações do player (merge com texto curador existente).
 *
 * pnpm exec tsx scripts/sync-annotation-three-levels.ts
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';

import { z } from 'zod';

import { LineAnnotation } from '../lib/content/schemas';
import { buildComputedTiers, mergeThreeLevels } from './lib/annotation-three-levels';

/** `""` nos JSON tratado como nível ausente (merge usa conteúdo gerado). */
const optionalTier = z.preprocess((v): unknown => {
  if (v === undefined || v === null) return undefined;
  if (typeof v !== 'string') return v;
  const t = v.trim();
  return t === '' ? undefined : t;
}, z.string().optional());

const LooseLineAnnotation = z.object({
  line: LineAnnotation.shape.line,
  level1: LineAnnotation.shape.level1,
  level2: optionalTier,
  level3: optionalTier,
  concepts: LineAnnotation.shape.concepts.optional(),
  warnings: LineAnnotation.shape.warnings.optional(),
  emphasis: LineAnnotation.shape.emphasis,
});

const LooseAnnotationsFile = z.object({
  annotations: z.array(LooseLineAnnotation),
});

const PROBLEMS = path.join(process.cwd(), 'content', 'problems');

async function walk(dir: string, out: string[]) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) await walk(p, out);
    else if (e.name === 'annotations.json') out.push(p);
  }
}

async function main() {
  const files: string[] = [];
  await walk(PROBLEMS, files);

  for (const annotPath of files.sort()) {
    const sdir = path.dirname(annotPath);
    const tsPath = path.join(sdir, 'solution.ts');
    try {
      await fs.access(tsPath);
    } catch {
      continue;
    }

    const rel = path.relative(PROBLEMS, sdir);
    const segs = rel.split(path.sep);
    const problemSlug = segs[0] ?? '';
    if (!problemSlug) continue;

    const codeRaw = await fs.readFile(tsPath, 'utf8');
    const codeLines = codeRaw.replace(/\s*$/, '').split(/\r?\n/);

    const json = JSON.parse(await fs.readFile(annotPath, 'utf8')) as unknown;
    const parsed = LooseAnnotationsFile.safeParse(json);
    if (!parsed.success) {
      throw new Error(`${annotPath}: ${parsed.error.message}`);
    }

    const nextAnnots = parsed.data.annotations.map((a) => {
      const idx = Math.max(0, a.line - 1);
      const rawLine = codeLines[idx] ?? '';
      const computed = buildComputedTiers(rawLine, a.line, problemSlug);
      const merged = mergeThreeLevels(
        { level1: a.level1, level2: a.level2, level3: a.level3 },
        computed,
      );

      const out: Record<string, unknown> = {
        line: a.line,
        level1: merged.level1,
        level2: merged.level2,
        level3: merged.level3,
        concepts: a.concepts ?? [],
      };
      if (a.warnings && a.warnings.length > 0) out.warnings = a.warnings;
      if (a.emphasis) out.emphasis = a.emphasis;
      return out;
    });

    nextAnnots.sort((x, y) => (x.line as number) - (y.line as number));
    await fs.writeFile(annotPath, JSON.stringify({ annotations: nextAnnots }, null, 2) + '\n');
    console.log('ok', path.relative(process.cwd(), annotPath));
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
