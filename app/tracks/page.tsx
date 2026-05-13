import type { Metadata } from "next";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAllStudyTracks } from "@/lib/content/track-loader";
import { buildPublicMetadata } from "@/lib/seo/build-metadata";

export const metadata: Metadata = buildPublicMetadata({
  title: "Trilhos curados de problemas",
  description:
    "Listas editoriais ordenadas — fundamentos na ordem recomendada ou foco arrays & hashing — para estudar sem escolher tu próprio a sequência.",
  pathname: "/tracks",
  keywords: [
    "trilho estudo",
    "roadmap algoritmos",
    "arrays hashing",
    "ordem recomendada",
  ],
});

export default async function TracksIndexPage() {
  const tracks = await getAllStudyTracks();

  return (
    <div className="relative bg-grid-pattern min-h-screen flex flex-col">
      <div className="mx-auto max-w-7xl px-6 py-24 flex-1">
        <header className="mb-16 border-l-4 border-primary pl-8">
          <Badge
            variant="secondary"
            className="mb-4 rounded-none bg-primary/10 px-1.5 py-0 font-mono text-[10px] uppercase text-primary"
          >
            Roadmaps Algorítmicos
          </Badge>
          <h1 className="mb-4 text-4xl font-black uppercase tracking-tighter md:text-6xl">
            Trilhas Recomendadas
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed tracking-tight text-muted-foreground">
            Listas editoriais organizadas por tópicos específicos ou fundamentos
            gerais para otimizar a tua aprendizagem.
          </p>
        </header>

        <div className="grid gap-0 border border-border md:grid-cols-2">
          {tracks.map((t) => (
            <Link
              key={t.slug}
              href={`/tracks/${t.slug}`}
              className="group relative border border-border p-px hover:z-10"
            >
              <Card className="h-full rounded-none border-none bg-background transition-all duration-300 group-hover:bg-primary/[0.02]">
                <CardHeader className="p-8 md:p-10">
                  <div className="mb-6 flex items-center justify-between">
                    <div className="h-1 w-12 bg-primary/30 group-hover:w-20 group-hover:bg-primary transition-all duration-500" />
                    <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary">
                      {t.problemSlugs.length} problemas
                    </span>
                  </div>
                  <CardTitle className="text-2xl font-black uppercase tracking-tight group-hover:text-primary transition-colors md:text-3xl">
                    {t.title}
                  </CardTitle>
                  <CardDescription className="mt-4 text-base leading-relaxed text-muted-foreground line-clamp-3">
                    {t.summary}
                  </CardDescription>
                  <div className="mt-10 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-[-10px] group-hover:translate-x-0">
                    Começar trilha <span className="text-lg">→</span>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-20 flex flex-col items-center border-t border-border pt-12">
          <p className="mb-6 text-xs font-mono uppercase tracking-widest text-muted-foreground">
            Queres ver todos os problemas disponíveis?
          </p>
          <Link
            href="/problems"
            className="inline-flex items-center justify-center border-2 border-primary px-8 py-4 text-center text-xs font-black uppercase tracking-[0.2em] transition-all hover:bg-primary hover:text-primary-foreground active:scale-95"
          >
            Explorar Catálogo Completo
          </Link>
        </div>
      </div>
    </div>
  );
}
