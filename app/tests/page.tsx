import { ArrowRight, Database, Layout, Server } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
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
      description:
        "React, Next.js, Performance, Acessibilidade e Ecossistema Web.",
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
        <header className="mb-16 border-l-4 border-primary pl-8">
          <Badge
            variant="secondary"
            className="mb-4 rounded-none bg-primary/10 px-1.5 py-0 font-mono text-[10px] uppercase text-primary"
          >
            Trilhas de Testes Técnicos
          </Badge>
          <h1 className="mb-4 text-4xl font-black uppercase tracking-tighter md:text-6xl">
            Avaliações Técnicas
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed tracking-tight text-muted-foreground">
            Simulados reais para vagas de Frontend, Backend e DevOps. Escolhe a
            tua trilha e começa a tua avaliação profissional.
          </p>
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
