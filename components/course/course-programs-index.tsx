'use client';

import Link from 'next/link';
import { CheckCircle2, Lock, PenLine } from 'lucide-react';

import type { CoursePackHydrated } from '@/lib/content/schemas';
import { Badge } from '@/components/ui/badge';
import { useCourseProgressStore } from '@/lib/stores/course-progress-store';
import {
  defaultModuleSlice,
  moduleUnlocked,
  progressUnitsForModule,
  type StoredModuleSlice,
} from '@/lib/courses/unlock';

/** Referência estável: `?? {}` no selector cria objeto novo cada getSnapshot ⇒ loop infinito com React 19/useSyncExternalStore. */
const EMPTY_BY_MODULE_ID = Object.freeze({}) as Readonly<Record<string, StoredModuleSlice>>;

interface Props {
  pack: CoursePackHydrated;
}

/** Painel tipo “lista de UC” onde cada módulo tem unidades de trabalho próprias. */
export function CourseProgramsIndex({ pack }: Props) {
  const learnerName = useCourseProgressStore((s) => s.learnerName);
  const setLearner = useCourseProgressStore((s) => s.setLearnerName);

  const orderedIds = pack.modules.map((m) => m.id);
  const courseSlicesRaw = useCourseProgressStore((s) => s.packages[pack.slug] ?? EMPTY_BY_MODULE_ID);

  function sliceFor(id: string) {
    const raw = courseSlicesRaw[id];
    return {
      ...defaultModuleSlice(),
      ...raw,
      solvedExerciseIds: { ...(raw?.solvedExerciseIds ?? {}) },
    };
  }
  let sum = 0;
  let denom = 0;

  const rows = pack.modules.map((module, idx) => {
    const slice = sliceFor(module.id);
    const exIds = module.exercises.map((e) => e.id);
    const { earned, total } = progressUnitsForModule(exIds, slice);
    sum += earned;
    denom += total;
    const unlock = moduleUnlocked(orderedIds, idx, sliceFor);
    const pct = Math.round((earned / total) * 100);

    const capPassed = !!slice.capstonePassedAt;

    const statusLabel = capPassed ? 'Completo • certificado desbloqueado' : pct === 0 ? 'Não iniciado' : 'Em progresso';

    return (
      <div key={module.id} className="border border-border bg-background p-0 flex flex-col md:flex-row">
        <div className="grow p-6 space-y-2">
          <div className="flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
            <Badge variant="outline" className="rounded-none">
              #{idx + 1}
            </Badge>
            {!unlock ? <Lock className="h-4 w-4" /> : null}
            <span>{statusLabel}</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight">{module.certificateTitle.replace(/^Certificado — /, '')}</h2>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{module.conceptSummary}</p>

          {!unlock ? (
            <p className="text-xs text-muted-foreground border-l-4 border-muted pl-3 py-2">
              Fica bloqueado até passares pela prova do módulo anterior — mantém-te honesto relativamente ritmo progressivo.
            </p>
          ) : (
            <>
              <div className="h-2 rounded bg-muted overflow-hidden max-w-xl">
                <div className="h-full rounded bg-primary transition-all" style={{ width: `${pct}%` }} />
              </div>
              <p className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider">
                Linha temporal local {pct}% · {earned}/{total} unidades
              </p>
            </>
          )}
        </div>
        <div className="shrink-0 border-t md:border-t-0 md:border-l border-border p-6 flex md:flex-col items-stretch gap-3 justify-between bg-muted/40">
          {unlock ? (
            <Link
              href={`/curso/${encodeURIComponent(pack.slug)}/modulo/${encodeURIComponent(module.id)}`}
              className="inline-flex justify-center px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] border-2 border-primary bg-background hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              Abrir módulo
            </Link>
          ) : (
            <span className="text-xs uppercase font-bold tracking-widest text-muted-foreground text-center">Bloqueado</span>
          )}
          {capPassed ? (
            <Link
              href={`/curso/${encodeURIComponent(pack.slug)}/modulo/${encodeURIComponent(module.id)}/certificado`}
              className="inline-flex items-center gap-2 justify-center text-emerald-600 dark:text-emerald-400 px-6 py-2 text-xs uppercase font-bold tracking-widest underline-offset-4 hover:underline"
            >
              <CheckCircle2 className="h-4 w-4" /> Certificado deste capítulo
            </Link>
          ) : (
            <span className="text-[10px] text-center text-muted-foreground uppercase tracking-[0.2em]">&nbsp;</span>
          )}
        </div>
      </div>
    );
  });

  const overallPct = denom ? Math.round((sum / denom) * 100) : 0;

  return (
    <div className="mx-auto max-w-4xl px-6 py-12 space-y-10">
      <header className="space-y-3 border-l-4 border-primary pl-6">
        <Badge variant="secondary" className="rounded-none uppercase text-[10px] tracking-[0.3em]">
          Curso local · progresso no browser apenas
        </Badge>
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase">{pack.title}</h1>
        <p className="text-muted-foreground max-w-xl leading-relaxed">{pack.subtitle}</p>
      </header>

      <section className="rounded-xl border border-border bg-muted/30 p-5 space-y-3">
        <div className="flex items-start gap-2 text-sm font-medium">
          <PenLine className="h-5 w-5 shrink-0" />
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Como os certificados são emitidos no teu dispositivo, escreve o nome que pretendes aparecer na folha oficial
              (podes gravar sempre que quiseres):
            </p>
            <input
              defaultValue={learnerName}
              onBlur={(e) => setLearner(e.target.value)}
              placeholder="Nome completo ..."
              className="w-full max-w-md rounded-lg border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
        </div>
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
          <span>Ocupação média atual do curso</span>
          <span className="font-mono text-primary">{overallPct}%</span>
        </div>
      </section>

      <section className="space-y-0 border border-border rounded-none">{rows}</section>
      <footer className="text-xs text-muted-foreground uppercase tracking-[0.2em] pb-24">
        Aviso importante: quando limpares dados do site/perfil do navegador o progresso e certificados desaparecem — faz
        captura de écran ou imprime assim que ficares feliz como teu método de arquivo.
      </footer>
    </div>
  );
}
