import Link from 'next/link';
import type { Metadata } from 'next';

import { getCoursePackHydrated, listCourseSlugs } from '@/lib/courses/hydrate-course-pack';
import { buildPublicMetadata } from '@/lib/seo/build-metadata';

export const metadata: Metadata = buildPublicMetadata({
  title: 'Cursos guiados com certificado por módulo',
  description:
    'Percursos com leitura curada, exercícios no browser e certificado modular ao concluir cada avaliação — progresso guardado localmente.',
  pathname: '/curso',
  keywords: ['curso algoritmos', 'fundamentos programação', 'certificado módulo', 'Algoria curso', 'trilha guiada'],
});

export default async function CoursesIndexPage() {
  const slugs = await listCourseSlugs();
  const packs = await Promise.all(slugs.map((s) => getCoursePackHydrated(s)));

  return (
    <div className="mx-auto max-w-4xl px-6 py-24 space-y-12">
      <header className="space-y-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">Algoria.curriculum</p>
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase">Cursos</h1>
        <p className="text-muted-foreground max-w-lg">
          Cada curso combina leitura + exercícios escritos no browser e emite certificado modular quando concluíres a
          prova final correspondente.
        </p>
      </header>
      <ul className="space-y-6">
        {packs.map((p) =>
          p ? (
            <li
              key={p.slug}
              className="border border-border bg-background p-8 flex flex-col gap-4 hover:border-primary transition-colors"
            >
              <div>
                <h2 className="text-2xl font-bold">{p.title}</h2>
                <p className="text-sm text-muted-foreground mt-2 max-w-xl">{p.subtitle}</p>
                <p className="text-xs font-mono uppercase tracking-[0.2em] mt-4 text-muted-foreground">
                  {p.modules.length} módulos · progresso apenas local
                </p>
              </div>
              <Link
                href={`/curso/${encodeURIComponent(p.slug)}`}
                className="self-start px-6 py-3 border-2 border-primary text-xs font-bold uppercase tracking-[0.2em] hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                Abrir programa
              </Link>
            </li>
          ) : null,
        )}
      </ul>
      <footer className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
        Mais trilhos aparecem assim que ampliamos o catálogo — por agora apenas a primeira fase de fundamentos já cobre
        todas oito peças atuais.
      </footer>
    </div>
  );
}
