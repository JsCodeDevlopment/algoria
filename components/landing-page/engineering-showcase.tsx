import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  MonitorSmartphone,
  Server,
  CloudCog,
  Gauge,
  Shield,
  Search,
  Brain,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "./shared";

interface WorkPracticeColumnProps {
  icon: React.ReactNode;
  title: string;
  tag: string;
  bullets: string[];
}

function WorkPracticeColumn({
  icon,
  title,
  tag,
  bullets,
}: WorkPracticeColumnProps) {
  return (
    <div className="group border-border bg-background px-8 py-10 transition-colors hover:bg-muted/35 border-b border-border last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3 border-b border-dashed border-border/80 pb-5">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center border-2 border-primary text-primary transition-all duration-500 group-hover:bg-primary group-hover:text-primary-foreground">
            {icon}
          </div>
          <h3 className="max-w-[12rem] text-lg font-black uppercase leading-tight tracking-tight">
            {title}
          </h3>
        </div>
        <Badge
          variant="secondary"
          className="rounded-none font-mono text-[9px] uppercase tracking-[0.25em]"
        >
          {tag}
        </Badge>
      </div>
      <ul className="space-y-4 text-sm font-medium leading-relaxed text-muted-foreground">
        {bullets.map((b, i) => (
          <li key={i} className="flex gap-3">
            <span
              className="mt-2 inline-block h-1 w-4 shrink-0 bg-primary opacity-75"
              aria-hidden
            />
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function EngineeringShowcase() {
  return (
    <section
      id="engineering-pro"
      className="relative z-10 scroll-mt-28 border-t border-border bg-background"
    >
      <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <SectionHeading
          kicker="Para além das listas clássicas"
          title="Conhecimento para sprint, infra e produto"
          subtitle="Temas onde muitos aprendem sob pressão antes de outages ou revisões SEO: segurança, custo em frontend e métricas de confiança nos deploys.
              Queremos tratar estas competências no mesmo modo de leitura exigente aplicável dia-a-dia em três frentes de trabalho."
        />
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Badge
            variant="outline"
            className="rounded-none border-muted-foreground/40 font-mono text-[10px] uppercase"
          >
            Conceitos aplicados · guias longos
          </Badge>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="rounded-none border-2 border-primary font-black uppercase tracking-wider"
          >
            <Link href="/engineering-work">
              Abrir guias · Front, Back, DevOps, IA{" "}
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="mt-14 grid gap-0 border border-border md:grid-cols-2 lg:grid-cols-4">
          <WorkPracticeColumn
            icon={<MonitorSmartphone className="h-7 w-7" />}
            title="Frontend & produto"
            tag="Web"
            bullets={[
              "Otimização sob medida Vitals — carregar menos, hidratar com critério, dividir bundles onde o utilizador estrangula primeiro.",
              "Boas práticas de performance — estratégias de cache (SWR, React Query), lazy loading de imagens e componentes pesados.",
              "Concorrência no front-end — paralelismo real com Web Workers para descarregar lógica pesada sem bloquear a UI principal.",
              "SEO técnico honesto — indexação, canonical, hreflang e migrações em cenários reais (guia longo no hub).",
            ]}
          />
          <WorkPracticeColumn
            icon={<Server className="h-7 w-7" />}
            title="Backend & APIs"
            tag="Serviços"
            bullets={[
              "Autorização distinta da autenticação — rituais curtos úteis no backlog de hardening.",
              "Caching e quotas no limiar entre clientes legítimos e automação não controlada sobre as tuas APIs.",
              "Automação com CronJobs — fluxos de criação e sincronização de material de estudo técnico em segundo plano.",
              "Schemas e migrações que não pedem refactor dramático sempre que o modelo de negócio muda.",
            ]}
          />
          <WorkPracticeColumn
            icon={<CloudCog className="h-7 w-7" />}
            title="DevOps & sistema"
            tag="Pipeline"
            bullets={[
              "Escalabilidade de infraestrutura — cenários de Scale Up vs Scale Out, Load Balancers e Caching.",
              "Mudança contínua com rollback que não diz “rezemos só desta vez”.",
              "Observabilidade mínima viável antes do primeiro spike de custo inexplicável à terça-feira.",
              "Segredos, RBAC e políticas quando equipas clicam rápido em consolas cloud públicas.",
            ]}
          />
          <WorkPracticeColumn
            icon={<Brain className="h-7 w-7" />}
            title="IA & modelos"
            tag="IA"
            bullets={[
              "Treinamento de LLMs do zero — da coleta de petabytes à arquitetura Transformer e alinhamento RLHF/DPO.",
              "Infraestrutura para IA — dimensionamento de VRAM, treinamento distribuído (FSDP) e otimização de matrizes.",
              "Inferência e Quantização — servindo modelos massivos em hardware limitado com GGUF, AWQ e vLLM.",
              "IA aplicada ao produto — RAG (Retrieval Augmented Generation), bases vetoriais e agentes autônomos.",
            ]}
          />
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <div className="border border-border bg-muted/15 p-6">
            <div className="mb-4 flex items-center gap-3 text-primary">
              <Gauge className="h-5 w-5 shrink-0" aria-hidden />
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.3em]">
                Performance custo-real
              </span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Trade-offs quando ancorados em número — p95 na rede, bytes
              transferidos — em vez de frases vagas tipo “rápido o suficiente”.
            </p>
          </div>
          <div className="border border-border bg-muted/15 p-6">
            <div className="mb-4 flex items-center gap-3 text-primary">
              <Shield className="h-5 w-5 shrink-0" aria-hidden />
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.3em]">
                Segurança aplicada
              </span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Listas funcionam quando ligamos cada item a regressões já vistas em
              projeto real ou quase infração de compliance.
            </p>
          </div>
          <div className="border border-border bg-muted/15 p-6">
            <div className="mb-4 flex items-center gap-3 text-primary">
              <Search className="h-5 w-5 shrink-0" aria-hidden />
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.3em]">
                SEO & indexação
              </span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Crawlers, frescura editorial controlada e conteúdo que engenharia
              pode defender em review — lado a lado, sem magia só de marketing.
            </p>
            <p className="mt-4 text-sm leading-relaxed">
              <Link
                href="/engineering-work/frontend-seo-tecnico-cenarios-producao"
                className="font-semibold text-primary underline-offset-4 hover:underline"
                prefetch={false}
              >
                Guia extensivo: SEO técnico — cenários de produção (SPA,
                e-commerce, multi-idioma, staging…)
              </Link>
            </p>
          </div>
        </div>
        <p className="mt-14 max-w-3xl border-l-[3px] border-primary/30 pl-6 text-sm leading-relaxed text-muted-foreground">
          Esta secção continua a funcionar como âncora na página inicial; os
          textos completos — por capítulo, com exercícios de reflexão e
          checklists — vivem no hub{" "}
          <Link
            href="/engineering-work"
            className="font-semibold text-foreground underline-offset-4 hover:underline"
          >
            Engenharia no trabalho
          </Link>
          . Novos temas entram no mesmo formato quando estiverem editorialmente
          maduros.
        </p>
      </div>
    </section>
  );
}
