'use client';

import Link from 'next/link';
import { BookOpenCheck, CheckCircle2, ChevronRight, Lock, Trophy } from 'lucide-react';

import { Button } from '@/components/ui/button';
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
          href={`/course/${pack.slug}`}
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

  const studyHref =
    module.linkedResourceKind === 'interview-en'
      ? `/interview-en/${module.linkedConceptSlug}?course=${encodeURIComponent(pack.slug)}&module=${encodeURIComponent(module.id)}`
      : `/concepts/${module.linkedConceptSlug}?course=${encodeURIComponent(pack.slug)}&module=${encodeURIComponent(module.id)}`;

  return (
    <div className="relative bg-grid-pattern flex flex-col flex-1">
      <div className="mx-auto w-full max-w-7xl px-6 py-10 flex-1 space-y-12">
        <header className="space-y-4 border-l-4 border-primary pl-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="rounded-none uppercase text-[10px] font-black tracking-[0.3em]">
              Capítulo {moduleIndex + 1}/{pack.modules.length}
            </Badge>
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-muted px-2 py-0.5">
              Progresso Local {pct}%
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight uppercase text-foreground">
            {module.certificateTitle.replace(/^Certificado — /, '')}
          </h1>
          {module.certificateTagline && (
            <p className="text-sm font-bold uppercase tracking-widest text-primary/80">{module.certificateTagline}</p>
          )}
          <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">{module.conceptSummary}</p>
        </header>

        <section className="border-2 border-border bg-background p-6 md:p-8 space-y-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-primary text-primary">
              <BookOpenCheck className="h-5 w-5" />
            </div>
            <div className="space-y-4 flex-1">
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest mb-1">Passo 1 — Ler o Conceito</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  O texto teórico completo está disponível no catálogo de conceitos. Estuda ao teu ritmo e depois marca a leitura abaixo.
                </p>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Button asChild className="rounded-none font-black uppercase tracking-widest h-11">
                  <Link href={studyHref}>
                    {module.linkedResourceKind === 'interview-en' ? 'Abrir Artigo (Interview EN)' : 'Abrir Conceito Teórico'}
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                
                <label className="flex items-center gap-3 cursor-pointer select-none group">
                  <div className="relative flex items-center justify-center">
                    <input
                      id="lesson-mark"
                      type="checkbox"
                      className="peer h-5 w-5 appearance-none border-2 border-border bg-background checked:bg-primary checked:border-primary transition-all cursor-pointer"
                      checked={!!slice.lessonReadAt}
                      onChange={(ev) => setLesson(pack.slug, module.id, ev.target.checked)}
                    />
                    <CheckCircle2 className="absolute h-3.5 w-3.5 text-primary-foreground opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest group-hover:text-primary transition-colors">
                    Concluí a Leitura
                  </span>
                </label>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 bg-primary" />
            <h2 className="text-xl font-black uppercase tracking-tight">Passo 2 — Exemplos Guiados</h2>
          </div>
          <div className="grid gap-6">
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

        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 bg-primary" />
            <h2 className="text-xl font-black uppercase tracking-tight">Passo 3 — Fixação de Conhecimento</h2>
          </div>
          <div className="grid gap-6">
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

        <section className="border-t-4 border-primary bg-muted/20 p-8 space-y-8">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center border-2 border-amber-500 text-amber-500">
              <Trophy className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-black uppercase tracking-tight">Passo 4 — Prova Final</h2>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
                Supera este último desafio para desbloqueares o certificado oficial deste capítulo.
              </p>
            </div>
          </div>

          <McqLesson variant="capstone" exercise={module.capstone} alreadySolved={capOk} onCorrect={onCapstoneSuccess} />
          
          {capOk && (
            <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-border/50">
              <Button asChild className="rounded-none bg-amber-600 hover:bg-amber-700 text-white font-black uppercase tracking-widest h-12 px-8">
                <Link href={`/course/${pack.slug}/module/${encodeURIComponent(module.id)}/certificate`}>
                  Obter Certificado <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="ghost" className="rounded-none font-black uppercase tracking-widest">
                <Link href={`/course/${pack.slug}`}>
                  Voltar ao Programa
                </Link>
              </Button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
