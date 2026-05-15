import { Clock, CloudCog, MonitorSmartphone, Server, Users } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAllEngineeringWorkGuides } from "@/lib/content/loader";
import {
  ENGINEERING_WORK_PILLARS,
  type EngineeringWorkPillar,
} from "@/lib/content/schemas";
import { buildPublicMetadata } from "@/lib/seo/build-metadata";

export const metadata: Metadata = buildPublicMetadata({
  title: "Engenharia no trabalho — guias práticos",
  description:
    "Guias em português sobre frontend, backend, DevOps e soft skills — aplicáveis na sprint real, sem lista de buzzwords.",
  pathname: "/engineering-work",
  keywords: [
    "engenharia software prática",
    "frontend produção",
    "APIs backend",
    "DevOps dia a dia",
    "soft skills engenharia",
    "carreira tech leader",
    "Algoria guias",
  ],
});

const PILLAR_ORDER = new Map<EngineeringWorkPillar, number>(
  ENGINEERING_WORK_PILLARS.map((p, i) => [p, i]),
);

const PILLAR_ICON: Record<EngineeringWorkPillar, ReactNode> = {
  frontend: <MonitorSmartphone className="h-6 w-6" aria-hidden />,
  backend: <Server className="h-6 w-6" aria-hidden />,
  devops: <CloudCog className="h-6 w-6" aria-hidden />,
  softskills: <Users className="h-6 w-6" aria-hidden />,
};

const PILLAR_TITLE: Record<EngineeringWorkPillar, string> = {
  frontend: "Frontend e produto",
  backend: "Backend e APIs",
  devops: "DevOps e sistema",
  softskills: "Carreira e Soft Skills",
};

const PILLAR_TAGLINE: Record<EngineeringWorkPillar, string> = {
  frontend:
    "Performance real, segurança em superfícies web e SEO técnico honesto.",
  backend:
    "Identidade, permissões, contratos estáveis e resiliência sob carga.",
  devops:
    "Entrega contínua, observabilidade e segurança operacional sem teatro.",
  softskills:
    "Liderança, comunicação, produtividade e evolução profissional na engenharia.",
};

export default async function EngineeringWorkHubPage() {
  const guides = await getAllEngineeringWorkGuides();
  guides.sort((a, b) => {
    const pd =
      (PILLAR_ORDER.get(a.meta.pillar) ?? 99) -
      (PILLAR_ORDER.get(b.meta.pillar) ?? 99);
    if (pd !== 0) return pd;
    return a.meta.title.localeCompare(b.meta.title);
  });

  const byPillar = ENGINEERING_WORK_PILLARS.map((pillar) => ({
    pillar,
    guides: guides.filter((g) => g.meta.pillar === pillar),
  }));

  return (
    <div className="relative bg-grid-pattern">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <header className="mb-16 border-l-4 border-primary pl-8">
          <Badge
            variant="secondary"
            className="mb-4 rounded-none bg-primary/10 px-1.5 py-0 font-mono text-[10px] uppercase text-primary"
          >
            Conteúdo prático de engenharia
          </Badge>
          <h1 className="mb-4 text-4xl font-black uppercase tracking-tighter md:text-6xl">
            Engenharia no trabalho
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed tracking-tight text-muted-foreground">
            Frontend, Backend e DevOps aplicados ao mundo real. Material pensado
            para ler com calma e usar na segunda-feira.
          </p>
        </header>

        <div className="space-y-20">
          {byPillar.map(({ pillar, guides: list }) => (
            <section
              key={pillar}
              aria-labelledby={`pillar-${pillar}`}
              className="scroll-mt-28"
            >
              <div className="mb-8 flex flex-col gap-4 border-b border-border pb-8 md:flex-row md:items-end md:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-primary/40 text-primary">
                    {PILLAR_ICON[pillar]}
                  </div>
                  <div>
                    <Badge
                      variant="secondary"
                      className="mb-2 rounded-none bg-primary/10 px-2 py-0 font-mono text-[9px] uppercase text-primary"
                    >
                      Pilar · {pillar}
                    </Badge>
                    <h2
                      id={`pillar-${pillar}`}
                      className="text-xl font-black uppercase tracking-tight md:text-2xl"
                    >
                      {PILLAR_TITLE[pillar]}
                    </h2>
                    <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                      {PILLAR_TAGLINE[pillar]}
                    </p>
                  </div>
                </div>
              </div>

              {list.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Conteúdo deste pilar em preparação.
                </p>
              ) : (
                <div className="grid gap-0 border border-border sm:grid-cols-2">
                  {list.map((g) => (
                    <Link
                      key={g.meta.slug}
                      href={`/engineering-work/${g.meta.slug}`}
                      className="group relative border border-border p-px hover:z-10"
                    >
                      <Card className="h-full rounded-none border-none bg-background transition-all duration-200 group-hover:bg-muted/50">
                        <CardHeader className="px-6 pt-6">
                          <CardTitle className="text-lg font-black uppercase tracking-tight transition-colors group-hover:text-primary md:text-xl">
                            {g.meta.title}
                          </CardTitle>
                          <CardDescription className="mt-2 flex items-center gap-2 font-mono text-[10px] uppercase">
                            <Clock className="h-3 w-3 shrink-0" aria-hidden /> ~
                            {g.meta.estimatedMinutes} min de leitura
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="px-6 pb-6">
                          <p className="text-sm leading-relaxed text-muted-foreground">
                            {g.meta.summary}
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>

        <p className="mt-20 border-l-[3px] border-primary/35 pl-6 text-sm text-muted-foreground leading-relaxed">
          Sugestão de uso: escolhe um pilar por sprint, lê um guia na sexta ou
          segunda, e implementa uma única melhoria mensurável (métrica de
          produto ou observabilidade) em vez de uma lista enorme de &quot;best
          practices&quot;.
        </p>
      </div>
    </div>
  );
}
