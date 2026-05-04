import Link from 'next/link';
import type { ReactNode } from 'react';
import { Briefcase, Clock, MonitorSmartphone, Server, CloudCog } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ENGINEERING_WORK_PILLARS, type EngineeringWorkPillar } from '@/lib/content/schemas';
import { getAllEngineeringWorkGuides } from '@/lib/content/loader';

export const metadata = {
  title: 'Engenharia no trabalho',
  description:
    'Guias didáticos em português: frontend e produto, backend e APIs, DevOps e operação — para aplicar em sprint sem decorar buzzwords.',
};

const PILLAR_ORDER = new Map<EngineeringWorkPillar, number>(ENGINEERING_WORK_PILLARS.map((p, i) => [p, i]));

const PILLAR_ICON: Record<EngineeringWorkPillar, ReactNode> = {
  frontend: <MonitorSmartphone className="h-6 w-6" aria-hidden />,
  backend: <Server className="h-6 w-6" aria-hidden />,
  devops: <CloudCog className="h-6 w-6" aria-hidden />,
};

const PILLAR_TITLE: Record<EngineeringWorkPillar, string> = {
  frontend: 'Frontend e produto',
  backend: 'Backend e APIs',
  devops: 'DevOps e sistema',
};

const PILLAR_TAGLINE: Record<EngineeringWorkPillar, string> = {
  frontend: 'Performance real, segurança em superfícies web e SEO técnico honesto.',
  backend: 'Identidade, permissões, contratos estáveis e resiliência sob carga.',
  devops: 'Entrega contínua, observabilidade e segurança operacional sem teatro.',
};

export default async function EngenhariaTrabalhoPage() {
  const guides = await getAllEngineeringWorkGuides();
  guides.sort((a, b) => {
    const pd = (PILLAR_ORDER.get(a.meta.pillar) ?? 99) - (PILLAR_ORDER.get(b.meta.pillar) ?? 99);
    if (pd !== 0) return pd;
    return a.meta.title.localeCompare(b.meta.title);
  });

  const byPillar = ENGINEERING_WORK_PILLARS.map((pillar) => ({
    pillar,
    guides: guides.filter((g) => g.meta.pillar === pillar),
  }));

  return (
    <div className="relative bg-grid-pattern">
      <div className="mx-auto max-w-5xl px-6 py-24">
        <header className="mb-14 rounded-xl border border-primary/35 bg-background/95 p-6 md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-start">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center border-2 border-primary text-primary">
              <Briefcase className="h-6 w-6" aria-hidden />
            </div>
            <div className="max-w-3xl space-y-4">
              <p className="text-[10px] font-black uppercase tracking-[0.35em] text-primary">Área aplicada</p>
              <h1 className="text-2xl font-black uppercase tracking-tight md:text-4xl">Engenharia no trabalho</h1>
              <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                Material pensado para ler com calma e usar na segunda-feira: cada guia separa o que é conceito, o que é decisão de produto e o que é
                checklist na prática. Sem pressupor cloud específica nem framework único — quando há exemplos, são ilustrativos.
              </p>
              <p className="text-xs leading-relaxed text-muted-foreground border-l-2 border-primary/25 pl-4">
                Voltaste da página inicial? Os mesmos três pilares (front, back, DevOps) estão aqui expandidos em capítulos longos. Usa o tempo estimado
                como bloco de foco — pausa entre guias para experimentar no teu projeto.
              </p>
            </div>
          </div>
        </header>

        <div className="space-y-20">
          {byPillar.map(({ pillar, guides: list }) => (
            <section key={pillar} aria-labelledby={`pillar-${pillar}`} className="scroll-mt-28">
              <div className="mb-8 flex flex-col gap-4 border-b border-border pb-8 md:flex-row md:items-end md:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-primary/40 text-primary">
                    {PILLAR_ICON[pillar]}
                  </div>
                  <div>
                    <Badge variant="secondary" className="mb-2 rounded-none bg-primary/10 px-2 py-0 font-mono text-[9px] uppercase text-primary">
                      Pilar · {pillar}
                    </Badge>
                    <h2 id={`pillar-${pillar}`} className="text-xl font-black uppercase tracking-tight md:text-2xl">
                      {PILLAR_TITLE[pillar]}
                    </h2>
                    <p className="mt-2 max-w-xl text-sm text-muted-foreground">{PILLAR_TAGLINE[pillar]}</p>
                  </div>
                </div>
              </div>

              {list.length === 0 ? (
                <p className="text-sm text-muted-foreground">Conteúdo deste pilar em preparação.</p>
              ) : (
                <div className="grid gap-0 border border-border sm:grid-cols-2">
                  {list.map((g) => (
                    <Link
                      key={g.meta.slug}
                      href={`/engenharia-trabalho/${g.meta.slug}`}
                      className="group relative border border-border p-px hover:z-10"
                    >
                      <Card className="h-full rounded-none border-none bg-background transition-all duration-200 group-hover:bg-muted/50">
                        <CardHeader className="px-6 pt-6">
                          <CardTitle className="text-lg font-black uppercase tracking-tight transition-colors group-hover:text-primary md:text-xl">
                            {g.meta.title}
                          </CardTitle>
                          <CardDescription className="mt-2 flex items-center gap-2 font-mono text-[10px] uppercase">
                            <Clock className="h-3 w-3 shrink-0" aria-hidden /> ~{g.meta.estimatedMinutes} min de leitura
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="px-6 pb-6">
                          <p className="text-sm leading-relaxed text-muted-foreground">{g.meta.summary}</p>
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
          Sugestão de uso: escolhe um pilar por sprint, lê um guia na sexta ou segunda, e implementa uma única melhoria mensurável (métrica de produto ou
          observabilidade) em vez de uma lista enorme de &quot;best practices&quot;.
        </p>
      </div>
    </div>
  );
}
