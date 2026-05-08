import { ArrowRight, Code2, Layout, Database, Server } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { buildPublicMetadata } from "@/lib/seo/build-metadata";

export const metadata: Metadata = buildPublicMetadata({
  title: "Testes Técnicos de Engenharia",
  description:
    "Simulados reais para vagas de Frontend, Backend e DevOps. Escolhe a tua trilha e começa a tua avaliação.",
  pathname: "/tests",
});

export default function TechnicalTestsIndexPage() {
  const tracks = [
    { 
      id: "frontend", 
      title: "Frontend", 
      description: "React, Next.js, Performance, Acessibilidade e Ecossistema Web.",
      icon: Layout,
    },
    { 
      id: "backend", 
      title: "Backend", 
      description: "Node.js, APIs, Bases de Dados, Segurança e Arquitetura.",
      icon: Database,
    },
    { 
      id: "devops", 
      title: "DevOps", 
      description: "Docker, CI/CD, Cloud, Monitorização e Infraestrutura.",
      icon: Server,
    },
  ];

  return (
    <div className="relative bg-grid-pattern flex flex-col flex-1">
      <div className="mx-auto w-full max-w-7xl px-6 py-12 md:py-20 flex-1">
        <header className="mb-10 rounded-xl border border-primary/35 bg-background/95 p-6 md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center border-2 border-primary text-primary">
                <Code2 className="h-6 w-6" aria-hidden />
              </div>
              <div className="space-y-3 max-w-2xl">
                <p className="text-[10px] font-black uppercase tracking-[0.35em] text-primary">
                  Assessment
                </p>
                <h1 className="text-2xl font-black uppercase tracking-tight md:text-3xl">
                  Escolhe a tua Trilha
                </h1>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Seleciona a tua área de especialização para ver os simulados disponíveis. 
                  Cada trilha contém testes de diferentes níveis e tópicos específicos.
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-3">
          {tracks.map((track) => (
            <Link
              key={track.id}
              href={`/tests/${track.id}`}
              className="group relative flex flex-col justify-between border-2 border-primary/30 bg-background p-8 transition-all hover:border-primary hover:shadow-[8px_8px_0_0_rgba(var(--primary-rgb),0.1)] cursor-pointer"
            >
              <div>
                <div className="mb-6 flex h-12 w-12 items-center justify-center border-2 border-primary text-primary transition-all group-hover:bg-primary group-hover:text-primary-foreground">
                  <track.icon className="h-6 w-6" />
                </div>
                <h2 className="mb-4 text-2xl font-black uppercase tracking-tight text-foreground">
                  {track.title}
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground mb-8">
                  {track.description}
                </p>
              </div>

              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary group-hover:gap-4 transition-all">
                Ver Simulados <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
