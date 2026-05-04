'use client';

import Link from 'next/link';
import { BookOpenCheck, ChevronRight, Lock, Trophy } from 'lucide-react';

import { analyticsCapture } from '@/components/analytics/posthog-provider';
import type { CourseModuleHydrated, CoursePackHydrated } from '@/lib/content/schemas';
import { Badge } from '@/components/ui/badge';
import { ExampleDualDepth } from '@/components/course/example-dual-depth';
import { McqLesson } from '@/components/course/mcq-lesson';
import { useCourseProgressStore } from '@/lib/stores/course-progress-store';
import { moduleUnlocked, progressUnitsForModule } from '@/lib/courses/unlock';

interface Props {
  pack: CoursePackHydrated;
  module: CourseModuleHydrated;
  previousModuleCertificateTitle?: string;
}

/** Experiência interactiva dentro de um único “capítulo”: leituras, exemplos densos duplos e MCQs. */
export function CourseModuleRunner({ pack, module, previousModuleCertificateTitle }: Props) {
  const moduleIndex = pack.modules.findIndex((m) => m.id === module.id);
  const orderedIds = pack.modules.map((m) => m.id);
  const getSlice = useCourseProgressStore((s) => s.getModuleSlice);
  const setLesson = useCourseProgressStore((s) => s.setLessonRead);
  const passEx = useCourseProgressStore((s) => s.setExercisePassed);
  const passCapstone = useCourseProgressStore((s) => s.passCapstone);

  const slice = getSlice(pack.slug, module.id);

  const exerciseIds = module.exercises.map((e) => e.id);

  const progress = progressUnitsForModule(exerciseIds, slice);

  const progressByModule = (mid: string) => useCourseProgressStore.getState().getModuleSlice(pack.slug, mid);
  const unlock = moduleUnlocked(orderedIds, moduleIndex, (id) => progressByModule(id));

  if (!unlock) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16 text-center space-y-6">
        <div className="inline-flex rounded-full bg-zinc-100 dark:bg-zinc-900 border border-border p-4 mx-auto">
          <Lock className="h-8 w-8 text-zinc-500" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Módulo ainda bloqueado</h1>
        <p className="text-muted-foreground leading-relaxed">
          {previousModuleCertificateTitle ? (
            <>
              Conclui primeiro a prova final do capítulo anterior &ldquo;
              {previousModuleCertificateTitle.replace(/^Certificado — /, '').trim()}&rdquo; para desbloquear este novo
              módulo (o progresso fica apenas neste navegador).
            </>
          ) : (
            <>
              Este módulo só abre depois da avaliação do capítulo anterior estiver concluída neste próprio navegador.
            </>
          )}
        </p>
        <Link
          href={`/curso/${pack.slug}`}
          className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-border bg-background hover:bg-muted transition-colors font-medium text-sm uppercase tracking-[0.2em]"
        >
          Voltar ao programa do curso
        </Link>
      </div>
    );
  }

  function markExercise(id: string) {
    passEx(pack.slug, module.id, id, true);
  }

  function onCapstoneSuccess() {
    passCapstone(pack.slug, module.id);
    analyticsCapture('course_capstone_pass', { course_slug: pack.slug, module_id: module.id });
  }

  const pct = Math.round((progress.earned / progress.total) * 100);
  const capOk = !!slice.capstonePassedAt;

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 space-y-12">
      <header className="space-y-3 border-l-4 border-primary pl-5">
        <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
          <Badge variant="secondary" className="rounded-none text-[10px]">
            Capítulo&nbsp;{moduleIndex + 1}/{pack.modules.length}
          </Badge>
          <span>Progresso local {pct}%</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          {module.certificateTitle.replace(/^Certificado — /, '')}
        </h1>
        {module.certificateTagline ? (
          <p className="text-muted-foreground text-sm leading-relaxed max-w-xl">{module.certificateTagline}</p>
        ) : null}
        <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">{module.conceptSummary}</p>
      </header>

      <section className="rounded-xl border border-border bg-muted/40 p-5 space-y-4">
        <div className="flex items-start gap-3">
          <BookOpenCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div className="space-y-2">
            <h2 className="text-lg font-semibold tracking-tight">Passo 1 — ler o conceito</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              O texto longo está no catálogo de conceitos. Abre quando quiseres, depois confirma aqui para registar o teu progresso só neste dispositivo.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <Link
            href={`/concepts/${module.linkedConceptSlug}?curso=${encodeURIComponent(pack.slug)}&modulo=${encodeURIComponent(
              module.id,
            )}`}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 shadow-sm uppercase tracking-[0.12em]"
          >
            Abrir página do conceito
            <ChevronRight className="h-4 w-4" />
          </Link>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              id="lesson-mark"
              type="checkbox"
              className="h-4 w-4 rounded border-input accent-primary"
              checked={!!slice.lessonReadAt}
              onChange={(ev) => setLesson(pack.slug, module.id, ev.target.checked)}
            />
            <span className="text-sm leading-snug">Marquei a leitura do conceito</span>
          </label>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Passo 2 — exemplos guiados em duas densidades</h2>
        <p className="text-sm text-muted-foreground">
          Começa no separador simples e só depois abre o profundo quando tiveres carga cognitiva livre.
        </p>
        <div className="space-y-6">
          {module.examples.map((ex) => (
            <ExampleDualDepth
              key={ex.title}
              title={ex.title}
              simpleHtml={ex.simpleHtml}
              deepHtml={ex.deepHtml}
              code={ex.code}
            />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Passo 3 — exercícios rápidos de fixação</h2>
        <div className="space-y-5">
          {module.exercises.map((exercise) => (
            <McqLesson
              key={exercise.id}
              variant="practice"
              exercise={exercise}
              alreadySolved={!!slice.solvedExerciseIds[exercise.id]}
              onCorrect={() => markExercise(exercise.id)}
            />
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex items-start gap-2">
          <Trophy className="h-5 w-5 text-amber-500 shrink-0 mt-1" />
          <div className="space-y-2">
            <h2 className="text-xl font-semibold tracking-tight">Passo 4 — prova deste capítulo liberta o certificado</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Depois da resposta correcta aparece aqui mesmo o certificado — guardado apenas localmente até mudares navegador/máquina.
            </p>
          </div>
        </div>
        <McqLesson variant="capstone" exercise={module.capstone} alreadySolved={capOk} onCorrect={onCapstoneSuccess} />
        {capOk ? (
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={`/curso/${pack.slug}/modulo/${encodeURIComponent(module.id)}/certificado`}
              className="inline-flex items-center gap-2 rounded-lg border-2 border-amber-500/70 bg-amber-500/10 px-5 py-2.5 font-semibold text-sm uppercase tracking-[0.12em]"
            >
              Ver certificado
              <ChevronRight className="h-4 w-4" />
            </Link>
            <Link href={`/curso/${pack.slug}`} className="text-sm text-muted-foreground underline-offset-4 hover:underline">
              ← Índice do curso
            </Link>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">
            Esta prova fecha o ciclo antes de poderes iniciar oficialmente o módulo seguinte desta série.
          </p>
        )}
      </section>
    </div>
  );
}
