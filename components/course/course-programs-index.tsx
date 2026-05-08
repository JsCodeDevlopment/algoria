'use client';

import Link from 'next/link';
import { CheckCircle2, Lock, PenLine } from 'lucide-react';

import type { CoursePackHydrated } from '@/lib/content/schemas';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
  const aggregate = pack.modules.reduce(
    (acc, module) => {
      const slice = sliceFor(module.id);
      const exIds = module.exercises.map((e) => e.id);
      const { earned, total } = progressUnitsForModule(exIds, slice);
      return { sum: acc.sum + earned, denom: acc.denom + total };
    },
    { sum: 0, denom: 0 },
  );
  const sum = aggregate.sum;
  const denom = aggregate.denom;

  const rows = pack.modules.map((module, idx) => {
    const slice = sliceFor(module.id);
    const exIds = module.exercises.map((e) => e.id);
    const { earned, total } = progressUnitsForModule(exIds, slice);
    const unlock = moduleUnlocked(orderedIds, idx, sliceFor);
    const pct = Math.round((earned / total) * 100);

    const capPassed = !!slice.capstonePassedAt;

    const statusLabel = capPassed ? 'Completo • certificado desbloqueado' : pct === 0 ? 'Não iniciado' : 'Em progresso';

    return (
      <div key={module.id} className="group relative flex flex-col md:flex-row bg-background hover:bg-muted/30 transition-colors">
        <div className="grow p-6 md:p-8 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-primary border border-primary/30 px-2 py-0.5">
              Módulo {idx + 1}
            </span>
            {!unlock && <Lock className="h-3 w-3 text-muted-foreground" />}
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{statusLabel}</span>
          </div>
          
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-foreground group-hover:text-primary transition-colors">
            {module.certificateTitle.replace(/^Certificado — /, '')}
          </h2>
          
          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">{module.conceptSummary}</p>

          {!unlock ? (
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 italic">
              Bloqueado: completa o módulo anterior para aceder.
            </p>
          ) : (
            <div className="space-y-2 max-w-md">
              <div className="h-1.5 bg-muted overflow-hidden">
                <div className="h-full bg-primary transition-all duration-500" style={{ width: `${pct}%` }} />
              </div>
              <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                <span>Progresso</span>
                <span>{pct}% • {earned}/{total} UN</span>
              </div>
            </div>
          )}
        </div>
        
        <div className="shrink-0 md:w-64 border-t md:border-t-0 md:border-l-2 border-border p-6 md:p-8 flex flex-col justify-center gap-3 bg-muted/10">
          {unlock ? (
            <Button asChild variant="outline" className="rounded-none font-black uppercase tracking-widest h-12">
              <Link href={`/course/${encodeURIComponent(pack.slug)}/module/${encodeURIComponent(module.id)}`}>
                Abrir Módulo
              </Link>
            </Button>
          ) : (
            <div className="h-12 flex items-center justify-center border-2 border-dashed border-border text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              Bloqueado
            </div>
          )}
          
          {capPassed && (
            <Button asChild variant="ghost" className="rounded-none text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 h-10">
              <Link href={`/course/${encodeURIComponent(pack.slug)}/module/${encodeURIComponent(module.id)}/certificate`}>
                <CheckCircle2 className="mr-2 h-3.5 w-3.5" /> Ver Certificado
              </Link>
            </Button>
          )}
        </div>
      </div>
    );
  });

  const overallPct = denom ? Math.round((sum / denom) * 100) : 0;

  return (
    <div className="relative bg-grid-pattern flex flex-col flex-1">
      <div className="mx-auto w-full max-w-7xl px-6 py-12 md:py-24 flex-1 space-y-12">
        <header className="space-y-4 border-l-4 border-primary pl-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="rounded-none uppercase text-[10px] font-black tracking-[0.3em]">
              Curso Local
            </Badge>
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-muted px-2 py-0.5">
              {overallPct}% Concluído
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight uppercase text-foreground">{pack.title}</h1>
          <p className="text-muted-foreground max-w-2xl leading-relaxed">{pack.subtitle}</p>
        </header>

        <section className="border-2 border-border bg-background p-6 md:p-8 space-y-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-primary text-primary">
              <PenLine className="h-5 w-5" />
            </div>
            <div className="space-y-4 flex-1">
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest mb-1">Identificação no Certificado</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Os certificados são emitidos localmente. O nome que definires abaixo será o que aparecerá no documento final.
                </p>
              </div>
              <input
                defaultValue={learnerName}
                onBlur={(e) => setLearner(e.target.value)}
                placeholder="Nome completo para o certificado ..."
                className="w-full max-w-md rounded-none border-2 border-input bg-background px-4 py-2 text-sm font-bold focus:border-primary focus:outline-none transition-colors"
              />
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary flex items-center gap-2">
            <div className="h-2 w-2 bg-primary" /> Programa do Curso
          </h2>
          <div className="grid gap-0 border-2 border-border divide-y-2 divide-border">
            {rows}
          </div>
        </section>

        <footer className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground border-t border-border pt-8 pb-24">
          Aviso importante: como o progresso é guardado apenas no teu navegador, limpar os dados do site removerá os teus certificados.
        </footer>
      </div>
    </div>
  );
}
