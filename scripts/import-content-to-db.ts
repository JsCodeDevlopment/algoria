/**
 * import-content-to-db.ts
 *
 * Pipeline idempotente de backfill: lê conteúdos do filesystem e faz
 * upsert na tabela `contents` por (slug, type).
 *
 * Uso: pnpm import:content
 *
 * Domínios importados:
 * - problems (meta.json + description.md)
 * - concepts (meta.json + body.md)
 * - interview-en (meta.json + body.md)
 * - engineering-work (meta.json + body.md)
 * - tracks (*.json)
 * - changelog (changelog.md)
 * - courses (seeds TypeScript)
 * - technical-tests (tests-data.ts)
 */

import { createHash } from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';

import { drizzle } from 'drizzle-orm/node-postgres';
import { eq, and } from 'drizzle-orm';
import { Pool } from 'pg';

import { contents } from '../lib/db/schema';

/* ── DB connection ─────────────────────────────────────────────── */

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ?? 'postgresql://127.0.0.1:5432/algoria',
  max: 5,
});
const db = drizzle(pool);

/* ── Helpers ────────────────────────────────────────────────────── */

const CONTENT_ROOT = path.join(process.cwd(), 'content');

function sha256(text: string): string {
  return createHash('sha256').update(text, 'utf8').digest('hex');
}

async function readJson<T>(file: string): Promise<T> {
  const raw = await fs.readFile(file, 'utf8');
  return JSON.parse(raw) as T;
}

async function readText(file: string): Promise<string> {
  try {
    return await fs.readFile(file, 'utf8');
  } catch {
    return '';
  }
}

async function listDirs(parent: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(parent, { withFileTypes: true });
    return entries.filter((e) => e.isDirectory()).map((e) => e.name);
  } catch {
    return [];
  }
}

async function listJsonFiles(parent: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(parent, { withFileTypes: true });
    return entries
      .filter((e) => e.isFile() && e.name.endsWith('.json'))
      .map((e) => e.name);
  } catch {
    return [];
  }
}

interface ContentRow {
  slug: string;
  type: typeof contents.$inferInsert.type;
  title: string;
  body: string;
  metadata: Record<string, unknown>;
  status: 'PUBLISHED';
  contentHash: string;
  publishedAt: Date;
}

let insertCount = 0;
let updateCount = 0;
let skipCount = 0;

async function upsert(row: ContentRow): Promise<void> {
  const existing = await db
    .select({ id: contents.id, contentHash: contents.contentHash })
    .from(contents)
    .where(and(eq(contents.slug, row.slug), eq(contents.type, row.type)))
    .limit(1);

  if (existing[0]) {
    // Idempotência: skip se hash não mudou
    if (existing[0].contentHash === row.contentHash) {
      skipCount++;
      return;
    }
    await db
      .update(contents)
      .set({
        title: row.title,
        body: row.body,
        metadata: row.metadata,
        contentHash: row.contentHash,
        updatedAt: new Date(),
      })
      .where(eq(contents.id, existing[0].id));
    updateCount++;
  } else {
    await db.insert(contents).values({
      id: crypto.randomUUID(),
      ...row,
    });
    insertCount++;
  }
}

/* ── Importers ──────────────────────────────────────────────────── */

async function importProblems() {
  console.log('\n📦 Importing problems...');
  const dir = path.join(CONTENT_ROOT, 'problems');
  const slugs = await listDirs(dir);

  for (const slug of slugs) {
    const metaPath = path.join(dir, slug, 'meta.json');
    const descPath = path.join(dir, slug, 'description.md');

    try {
      const meta = await readJson<Record<string, unknown>>(metaPath);
      const description = await readText(descPath);

      // Collect solution metadata
      const solutionsDir = path.join(dir, slug, 'solutions');
      const solutionSlugs = await listDirs(solutionsDir);
      const solutionMetas: Record<string, unknown>[] = [];

      for (const solSlug of solutionSlugs) {
        const solDir = path.join(solutionsDir, solSlug);
        try {
          const solMeta = await readJson<Record<string, unknown>>(
            path.join(solDir, 'meta.json'),
          );
          const introMd = await readText(path.join(solDir, 'intro.md'));
          
          // Code files
          const codeByLanguage: Record<string, string> = {};
          const files = await fs.readdir(solDir);
          for (const f of files) {
            const ext = path.extname(f);
            const content = await readText(path.join(solDir, f));
            if (ext === '.ts') codeByLanguage['typescript'] = content;
            if (ext === '.js') codeByLanguage['javascript'] = content;
            if (ext === '.py') codeByLanguage['python'] = content;
            if (ext === '.go') codeByLanguage['go'] = content;
            if (ext === '.java') codeByLanguage['java'] = content;
            if (ext === '.cs') codeByLanguage['csharp'] = content;
            if (ext === '.cpp') codeByLanguage['cpp'] = content;
          }

          // Annotations & Trace
          const annPath = path.join(solDir, 'annotations.json');
          const tracePath = path.join(solDir, 'trace.json');
          const annotationsData = await readJson<{ annotations: any[] }>(annPath).catch(() => ({ annotations: [] }));
          const traceData = await readJson<any[]>(tracePath).catch(() => undefined);

          solutionMetas.push({
            meta: solMeta,
            codeByLanguage,
            introMd,
            annotations: annotationsData.annotations,
            executionTrace: traceData,
          });
        } catch (err) {
          console.warn(`    ⚠ broken solution ${slug}/${solSlug}:`, err);
        }
      }

      const body = description;
      const hash = sha256(body + JSON.stringify(meta));

      await upsert({
        slug,
        type: 'problem',
        title: (meta.title as string) || slug,
        body,
        metadata: { ...meta, solutions: solutionMetas },
        status: 'PUBLISHED',
        contentHash: hash,
        publishedAt: new Date(),
      });

      console.log(`  ✓ problem/${slug}`);
    } catch (err) {
      console.error(`  ✗ problem/${slug}:`, err);
    }
  }
}

async function importContentDir(
  dirName: string,
  type: ContentRow['type'],
  bodyFile = 'body.md',
) {
  console.log(`\n📦 Importing ${type}...`);
  const dir = path.join(CONTENT_ROOT, dirName);
  const slugs = await listDirs(dir);

  for (const slug of slugs) {
    try {
      const meta = await readJson<Record<string, unknown>>(
        path.join(dir, slug, 'meta.json'),
      );
      const body = await readText(path.join(dir, slug, bodyFile));
      const hash = sha256(body + JSON.stringify(meta));

      await upsert({
        slug,
        type,
        title: (meta.title as string) || slug,
        body,
        metadata: meta,
        status: 'PUBLISHED',
        contentHash: hash,
        publishedAt: new Date(),
      });

      console.log(`  ✓ ${type}/${slug}`);
    } catch (err) {
      console.error(`  ✗ ${type}/${slug}:`, err);
    }
  }
}

async function importTracks() {
  console.log('\n📦 Importing tracks...');
  const dir = path.join(CONTENT_ROOT, 'tracks');
  const files = await listJsonFiles(dir);

  for (const file of files) {
    const slug = file.replace(/\.json$/i, '');
    try {
      const data = await readJson<Record<string, unknown>>(
        path.join(dir, file),
      );
      const body = JSON.stringify(data, null, 2);
      const hash = sha256(body);

      await upsert({
        slug,
        type: 'track',
        title: (data.title as string) || slug,
        body,
        metadata: data,
        status: 'PUBLISHED',
        contentHash: hash,
        publishedAt: new Date(),
      });

      console.log(`  ✓ track/${slug}`);
    } catch (err) {
      console.error(`  ✗ track/${slug}:`, err);
    }
  }
}

async function importChangelog() {
  console.log('\n📦 Importing changelog...');
  const file = path.join(CONTENT_ROOT, 'changelog.md');

  try {
    const body = await readText(file);
    if (!body) return;
    const hash = sha256(body);

    await upsert({
      slug: 'changelog',
      type: 'changelog',
      title: 'Changelog',
      body,
      metadata: {},
      status: 'PUBLISHED',
      contentHash: hash,
      publishedAt: new Date(),
    });

    console.log('  ✓ changelog');
  } catch (err) {
    console.error('  ✗ changelog:', err);
  }
}

async function importCourses() {
  console.log('\n📦 Importing courses...');

  // Dynamically import the seeds
  const seedFiles = [
    { path: '../lib/courses/fundamentos-fase1-seed.ts', exportName: 'FUNDAMENTOS_FASE_1_PACK' },
    { path: '../lib/courses/fundamentos-fase2-seed.ts', exportName: 'FUNDAMENTOS_FASE_2_PACK' },
    { path: '../lib/courses/interview-english-seed.ts', exportName: 'INTERVIEW_ENGLISH_INTERVIEWS_PACK' },
  ];

  for (const seed of seedFiles) {
    try {
      const mod = await import(seed.path);
      const pack = mod[seed.exportName];
      if (!pack) {
        console.log(`  ⚠ ${seed.exportName} not found, skipping`);
        continue;
      }

      const body = JSON.stringify(pack, null, 2);
      const hash = sha256(body);

      await upsert({
        slug: pack.slug,
        type: 'course',
        title: pack.title,
        body,
        metadata: {
          subtitle: pack.subtitle,
          moduleCount: pack.modules?.length ?? 0,
          moduleIds: pack.modules?.map((m: { id: string }) => m.id) ?? [],
        },
        status: 'PUBLISHED',
        contentHash: hash,
        publishedAt: new Date(),
      });

      console.log(`  ✓ course/${pack.slug}`);
    } catch (err) {
      console.error(`  ✗ course from ${seed.path}:`, err);
    }
  }
}

async function importTechnicalTests() {
  console.log('\n📦 Importing technical tests...');

  try {
    const { TECHNICAL_TESTS } = await import('../lib/content/tests-data');

    for (const test of TECHNICAL_TESTS) {
      const body = JSON.stringify(test, null, 2);
      const hash = sha256(body);

      await upsert({
        slug: test.slug,
        type: 'technical-test',
        title: test.title,
        body,
        metadata: {
          track: test.track,
          level: test.level,
          difficulty: test.difficulty,
          topic: test.topic,
          timeLimitMinutes: test.timeLimitMinutes,
          questionCount: test.questions.length,
        },
        status: 'PUBLISHED',
        contentHash: hash,
        publishedAt: new Date(),
      });

      console.log(`  ✓ technical-test/${test.slug}`);
    }
  } catch (err) {
    console.error('  ✗ technical-tests:', err);
  }
}

/* ── Main ───────────────────────────────────────────────────────── */

async function main() {
  console.log('═══════════════════════════════════════════════════════');
  console.log(' Algoria — Content Backfill to Database');
  console.log('═══════════════════════════════════════════════════════');

  await importProblems();
  await importContentDir('concepts', 'concept');
  await importContentDir('interview-en', 'interview-en');
  await importContentDir('engenharia-trabalho', 'engineering-work');
  await importTracks();
  await importChangelog();
  await importCourses();
  await importTechnicalTests();

  console.log('\n═══════════════════════════════════════════════════════');
  console.log(` ✅ Done: ${insertCount} inserted, ${updateCount} updated, ${skipCount} skipped`);
  console.log('═══════════════════════════════════════════════════════\n');

  await pool.end();
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
