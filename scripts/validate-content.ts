#!/usr/bin/env npx tsx
/**
 * Validação de conteúdo (Fase 1): metadados Zod, pré-requisitos, ≥2 soluções
 * por problema, números de linha das anotações vs `solution.ts`.
 *
 * Corre: `pnpm validate:content`
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';

import {
  AnnotationsFile,
  ConceptMeta,
  EngineeringWorkMeta,
  InterviewEnglishMeta,
  ProblemMeta,
  SolutionMeta,
} from '../lib/content/schemas';
import { FUNDAMENTOS_FASE_1_PACK } from '../lib/courses/fundamentos-fase1-seed';

const ROOT = path.join(process.cwd(), 'content');
const PROBLEMS = path.join(ROOT, 'problems');
const CONCEPTS = path.join(ROOT, 'concepts');
const INTERVIEW_EN = path.join(ROOT, 'interview-en');
const ENGENHARIA_TRABALHO = path.join(ROOT, 'engenharia-trabalho');

async function listDirs(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  return entries.filter((e) => e.isDirectory()).map((e) => e.name);
}

async function readJson(fp: string): Promise<unknown> {
  const raw = await fs.readFile(fp, 'utf8');
  return JSON.parse(raw) as unknown;
}

async function fileExists(fp: string): Promise<boolean> {
  try {
    await fs.access(fp);
    return true;
  } catch {
    return false;
  }
}

async function validate(): Promise<{ errors: string[]; warnings: string[] }> {
  const errors: string[] = [];
  const warnings: string[] = [];

  const slugs = await listDirs(PROBLEMS);
  if (slugs.length === 0) errors.push('Nenhuma pasta em content/problems');

  if (slugs.length < 10) {
    warnings.push(`Esperávamos pelo menos 10 problemas para o MVP (~${slugs.length} encontrados)`);
  }

  for (const slug of slugs) {
    const pdir = path.join(PROBLEMS, slug);
    const metaPath = path.join(pdir, 'meta.json');
    if (!(await fileExists(metaPath))) {
      errors.push(`[${slug}] falta meta.json`);
      continue;
    }
    const metaParsed = ProblemMeta.safeParse(await readJson(metaPath));
    if (!metaParsed.success) {
      errors.push(`[${slug}] meta.json inválido: ${metaParsed.error.message}`);
      continue;
    }
    const meta = metaParsed.data;

    if (meta.slug !== slug) {
      errors.push(`[${slug}] meta.slug deve ser igual ao nome da pasta (é "${meta.slug}")`);
    }

    for (const pre of meta.prerequisites) {
      const cMeta = path.join(CONCEPTS, pre, 'meta.json');
      if (!(await fileExists(cMeta))) {
        errors.push(`[${slug}] prerequisite desconhecido: concepts/${pre}/`);
      }
    }

    const solRoots = await listDirs(path.join(pdir, 'solutions')).catch(() => [] as string[]);
    if (solRoots.length < 2) {
      errors.push(`[${slug}] precisa de pelo menos 2 soluções (${solRoots.length})`);
    }

    for (const sol of solRoots) {
      const sdir = path.join(pdir, 'solutions', sol);
      const sMetaPath = path.join(sdir, 'meta.json');
      const annotPath = path.join(sdir, 'annotations.json');
      const tsPath = path.join(sdir, 'solution.ts');

      if (!(await fileExists(sMetaPath))) {
        errors.push(`[${slug}/${sol}] falta meta.json`);
        continue;
      }
      const sm = SolutionMeta.safeParse(await readJson(sMetaPath));
      if (!sm.success) {
        errors.push(`[${slug}/${sol}] solution meta inválido: ${sm.error.message}`);
        continue;
      }

      if (!(await fileExists(tsPath))) {
        warnings.push(`[${slug}/${sol}] sem solution.ts (validação usa só TypeScript-canónico)`);
        continue;
      }

      if (!(await fileExists(annotPath))) {
        errors.push(`[${slug}/${sol}] falta annotations.json`);
        continue;
      }

      const code = await fs.readFile(tsPath, 'utf8');
      const lineCount = Math.max(1, code.split(/\r?\n/).length);

      const annParsed = AnnotationsFile.safeParse(await readJson(annotPath));
      if (!annParsed.success) {
        errors.push(`[${slug}/${sol}] annotations.json inválido: ${annParsed.error.message}`);
        continue;
      }

      const lines = annParsed.data.annotations.map((a) => a.line);
      const maxAnnotated = Math.max(...lines);
      const minAnnotated = Math.min(...lines);
      if (minAnnotated < 1) {
        errors.push(`[${slug}/${sol}] linha anotada < 1`);
      }
      if (maxAnnotated > lineCount) {
        errors.push(
          `[${slug}/${sol}] anotação até linha ${maxAnnotated}, mas solution.ts só tem ${lineCount} linhas`,
        );
      }

      for (const row of annParsed.data.annotations) {
        if (!row.level1.trim()) errors.push(`[${slug}/${sol}] linha ${row.line}: level1 vazio`);
        else if (row.level1.trim().length < 20)
          errors.push(`[${slug}/${sol}] linha ${row.line}: level1 demasiado curto (${row.level1.trim().length} chars)`);

        if (!row.level2.trim())
          errors.push(`[${slug}/${sol}] linha ${row.line}: level2 vazio`);
        else if (row.level2.trim().length < 40)
          errors.push(`[${slug}/${sol}] linha ${row.line}: level2 demasiado curto (${row.level2.trim().length} chars)`);

        if (!row.level3.trim())
          errors.push(`[${slug}/${sol}] linha ${row.line}: level3 vazio`);
        else if (row.level3.trim().length < 40)
          errors.push(`[${slug}/${sol}] linha ${row.line}: level3 demasiado curto (${row.level3.trim().length} chars)`);
      }
    }
  }

  const conceptSlugs = await listDirs(CONCEPTS).catch(() => [] as string[]);
  for (const cslug of conceptSlugs) {
    const cdir = path.join(CONCEPTS, cslug);
    const metaPath = path.join(cdir, 'meta.json');
    const bodyPath = path.join(cdir, 'body.md');
    if (!(await fileExists(metaPath))) {
      errors.push(`[concepts/${cslug}] falta meta.json`);
      continue;
    }
    const conceptParsed = ConceptMeta.safeParse(await readJson(metaPath));
    if (!conceptParsed.success) {
      errors.push(`[concepts/${cslug}] meta.json inválido: ${conceptParsed.error.message}`);
      continue;
    }
    const cmeta = conceptParsed.data;
    if (cmeta.slug !== cslug) {
      errors.push(`[concepts/${cslug}] meta.slug deve ser igual ao nome da pasta (é "${cmeta.slug}")`);
    }
    for (const pre of cmeta.prerequisites) {
      const preMeta = path.join(CONCEPTS, pre, 'meta.json');
      if (!(await fileExists(preMeta))) {
        errors.push(`[concepts/${cslug}] prerequisite desconhecido: concepts/${pre}/`);
      }
    }
    if (!(await fileExists(bodyPath))) {
      errors.push(`[concepts/${cslug}] falta body.md`);
    }
  }

  const expectedPhase1 = [
    'big-o',
    'hash-tables',
    'two-pointers',
    'sliding-window',
    'recursion-intro',
    'stacks-intro',
    'queues-intro',
    'linked-list-intro',
  ];
  for (const slug of expectedPhase1) {
    if (!conceptSlugs.includes(slug)) warnings.push(`Mini-curso Fase 1 em falta: concepts/${slug}/`);
  }

  const seenCourseIds = new Set<string>();
  for (const mod of FUNDAMENTOS_FASE_1_PACK.modules) {
    if (seenCourseIds.has(mod.id)) {
      errors.push(`[course ${FUNDAMENTOS_FASE_1_PACK.slug}] id de módulo repetido ${mod.id}`);
    }
    seenCourseIds.add(mod.id);
    const cMeta = path.join(CONCEPTS, mod.linkedConceptSlug, 'meta.json');
    if (!(await fileExists(cMeta))) {
      errors.push(`[course ${FUNDAMENTOS_FASE_1_PACK.slug}/${mod.id}] concepto falta concepts/${mod.linkedConceptSlug}/`);
    }
  }

  const interviewSlugs = await listDirs(INTERVIEW_EN).catch(() => [] as string[]);
  if (interviewSlugs.length === 0) {
    warnings.push('Pasta content/interview-en vazia — hub Technical English sem lições');
  }
  for (const islug of interviewSlugs) {
    const idir = path.join(INTERVIEW_EN, islug);
    const metaPath = path.join(idir, 'meta.json');
    const bodyPath = path.join(idir, 'body.md');
    if (!(await fileExists(metaPath))) {
      errors.push(`[interview-en/${islug}] falta meta.json`);
      continue;
    }
    const parsed = InterviewEnglishMeta.safeParse(await readJson(metaPath));
    if (!parsed.success) {
      errors.push(`[interview-en/${islug}] meta.json inválido: ${parsed.error.message}`);
      continue;
    }
    if (parsed.data.slug !== islug) {
      errors.push(`[interview-en/${islug}] meta.slug deve ser igual ao nome da pasta (é "${parsed.data.slug}")`);
    }
    if (!(await fileExists(bodyPath))) {
      errors.push(`[interview-en/${islug}] falta body.md`);
      continue;
    }
    const rawBody = await fs.readFile(bodyPath, 'utf8').catch(() => '');
    if (rawBody.trim().length < 80) {
      errors.push(`[interview-en/${islug}] body.md demasiado curto ou vazio`);
    }
  }

  const engSlugs = await listDirs(ENGENHARIA_TRABALHO).catch(() => [] as string[]);
  if (engSlugs.length === 0) {
    warnings.push('Pasta content/engenharia-trabalho vazia — hub sem guias');
  }
  for (const eslug of engSlugs) {
    const edir = path.join(ENGENHARIA_TRABALHO, eslug);
    const metaPath = path.join(edir, 'meta.json');
    const bodyPath = path.join(edir, 'body.md');
    if (!(await fileExists(metaPath))) {
      errors.push(`[engenharia-trabalho/${eslug}] falta meta.json`);
      continue;
    }
    const eparsed = EngineeringWorkMeta.safeParse(await readJson(metaPath));
    if (!eparsed.success) {
      errors.push(`[engenharia-trabalho/${eslug}] meta.json inválido: ${eparsed.error.message}`);
      continue;
    }
    if (eparsed.data.slug !== eslug) {
      errors.push(`[engenharia-trabalho/${eslug}] meta.slug deve ser igual ao nome da pasta (é "${eparsed.data.slug}")`);
    }
    if (!(await fileExists(bodyPath))) {
      errors.push(`[engenharia-trabalho/${eslug}] falta body.md`);
      continue;
    }
    const engBody = await fs.readFile(bodyPath, 'utf8').catch(() => '');
    if (engBody.trim().length < 80) {
      errors.push(`[engenharia-trabalho/${eslug}] body.md demasiado curto ou vazio`);
    }
  }

  return { errors, warnings };
}

validate().then(({ errors, warnings }) => {
  for (const w of warnings) console.warn('WARN', w);
  for (const e of errors) console.error('ERROR', e);
  if (errors.length) {
    console.error(`\nFalhou com ${errors.length} erro(s).`);
    process.exit(1);
  }
  console.log('Validação OK (avisos apenas se listados acima).');
});
