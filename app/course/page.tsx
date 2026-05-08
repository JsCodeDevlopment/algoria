import { ArrowRight, Code2 } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { getCoursePackHydrated, listCourseSlugs } from '@/lib/courses/hydrate-course-pack';
import { buildPublicMetadata } from '@/lib/seo/build-metadata';

export const metadata: Metadata = buildPublicMetadata({
  title: 'Cursos guiados com certificado por módulo',
  description:
    'Percursos com leitura curada, exercícios no browser e certificado modular ao concluir cada avaliação — progresso guardado localmente.',
  pathname: '/course',
  keywords: ['curso algoritmos', 'fundamentos programação', 'certificado módulo', 'Algoria curso', 'trilha guiada'],
});

export default async function CoursesIndexPage() {
  const slugs = await listCourseSlugs();
  const packs = await Promise.all(slugs.map((s) => getCoursePackHydrated(s)));

  return (
    <div className="relative bg-grid-pattern flex flex-col flex-1">
      <div className="mx-auto w-full max-w-7xl px-6 py-12 md:py-20 flex-1">
        <header className="mb-14 rounded-xl border border-primary/35 bg-background/95 p-6 md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center border-2 border-primary text-primary">
                <Code2 className="h-6 w-6" aria-hidden />
              </div>
              <div className="space-y-3 max-w-2xl">
                <p className="text-[10px] font-black uppercase tracking-[0.35em] text-primary">
                  Algoria.curriculum
                </p>
                <h1 className="text-2xl font-black uppercase tracking-tight md:text-3xl">
                  Cursos Guiados
                </h1>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Cada curso combina leitura, exemplos práticos e exercícios no browser.
                  Obtém certificados modulares ao concluir as avaliações de cada capítulo.
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="grid gap-6">
          {packs.map((p) =>
            p ? (
              <div
                key={p.slug}
                className="group relative flex flex-col justify-between border-2 border-border bg-background p-8 transition-all hover:border-primary hover:shadow-[8px_8px_0_0_rgba(var(--primary-rgb),0.1)]"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div className="space-y-4">
                    <h2 className="text-2xl font-black uppercase tracking-tight">{p.title}</h2>
                    <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">{p.subtitle}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-muted text-muted-foreground">
                        {p.modules.length} Módulos
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-primary/10 text-primary">
                        Progresso Local
                      </span>
                    </div>
                  </div>
                  
                  <Button asChild className="rounded-none font-black uppercase tracking-widest shrink-0">
                    <Link href={`/course/${encodeURIComponent(p.slug)}`}>
                      Abrir Programa <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            ) : null,
          )}
        </div>

        <footer className="mt-16 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground border-t border-border pt-8">
          O catálogo cresce por fases: fundamentos técnicos e trilhos de comunicação para entrevistas em inglês.
        </footer>
      </div>
    </div>
  );
}
