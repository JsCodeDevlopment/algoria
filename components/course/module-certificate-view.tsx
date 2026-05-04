'use client';

import { useMemo } from 'react';
import { Printer } from 'lucide-react';

import type { CourseModuleHydrated } from '@/lib/content/schemas';
import { useCourseProgressStore } from '@/lib/stores/course-progress-store';
import { Button } from '@/components/ui/button';

interface Props {
  courseSlug: string;
  module: CourseModuleHydrated;
}

export function ModuleCertificateView({ courseSlug, module }: Props) {
  const learner = useCourseProgressStore((s) => s.learnerName);
  const setLearner = useCourseProgressStore((s) => s.setLearnerName);

  const capRaw = useCourseProgressStore((s) => s.packages[courseSlug]?.[module.id]?.capstonePassedAt);
  const ok = !!capRaw;

  const dateLabel = useMemo(() => {
    if (!capRaw) return 'pendente';
    return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'full' }).format(new Date(capRaw));
  }, [capRaw]);

  if (!ok) {
    return (
      <div className="mx-auto max-w-lg px-6 py-24 text-center space-y-4">
        <h1 className="text-2xl font-semibold">Certificado ainda pendente</h1>
        <p className="text-muted-foreground">
          Completa primeiro a última avaliação do módulo — depois regressa aqui porque este documento apenas confirma
          localmente esse fecho técnico.
        </p>
        <Button asChild variant="outline" className="rounded-xl">
          <a href={`/curso/${encodeURIComponent(courseSlug)}/modulo/${encodeURIComponent(module.id)}`}>Voltar às lições</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="print:hidden mb-8 flex flex-wrap gap-4 items-center">
        <label className="flex flex-col text-xs uppercase tracking-[0.2em] gap-1">
          Nome no certificado (editável)
          <input
            value={learner}
            onChange={(e) => setLearner(e.target.value)}
            className="rounded-lg border border-input bg-background px-3 py-2 text-base max-w-xs"
          />
        </label>
        <Button
          type="button"
          variant="outline"
          onClick={() => window.print()}
          className="inline-flex gap-2 rounded-xl uppercase text-xs tracking-[0.2em]"
        >
          <Printer className="h-4 w-4" /> Guardar ou imprimir PDF
        </Button>
      </div>

      <article
        className="border-[12px] border-double border-primary/60 bg-gradient-to-br from-[#fdfbf7] to-white dark:from-zinc-950 dark:to-zinc-900 p-10 md:p-16 text-center shadow-2xl print:shadow-none print:border-primary"
        aria-labelledby="certificate-title"
      >
        <p className="text-[10px] uppercase tracking-[0.4em] text-primary font-bold mb-4">Certificado modular · Algoria</p>
        <h1 id="certificate-title" className="text-3xl md:text-5xl font-black uppercase tracking-[0.12em] mb-6 leading-tight">
          {module.certificateTitle.replace(/^Certificado — /, '')}
        </h1>
        {module.certificateTagline ? (
          <p className="text-sm md:text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed mb-10 italic">
            {module.certificateTagline}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground mb-10">Conhecimento sintetizado após conclusão prática obrigatória neste servidor local.</p>
        )}

        <p className="text-xl md:text-2xl font-semibold mb-2 text-zinc-800 dark:text-zinc-100">Este certificado atesta oficialmente apenas localmente</p>
        <p className="text-3xl md:text-5xl font-serif italic text-primary pb-10 border-b border-dashed border-primary/40 mb-8">
          {learner.trim() || 'Nome ainda não preenchido'}
        </p>

        <p className="text-xs text-muted-foreground leading-relaxed max-w-xl mx-auto mb-10">
          O titular registou aqui mesmo conclusão deste ciclo através do material associado ao conceito <strong>{module.linkedConceptSlug}</strong> até passar todas etapas e a prova final neste próprio navegador.
        </p>

        <div className="flex flex-col md:flex-row justify-between gap-8 text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
          <div className="text-left space-y-1">
            <p className="text-foreground font-bold">{dateLabel}</p>
            <p>Data registada apenas localmente quando passaste última avaliação</p>
          </div>
          <div className="text-left space-y-1">
            <p className="text-foreground font-bold">Assinatura simbólica</p>
            <p>FASE 01 · CURSO FUNDAMENTOS · Algoria</p>
          </div>
        </div>
      </article>
    </div>
  );
}
