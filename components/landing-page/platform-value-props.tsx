import React from "react";
import Link from "next/link";
import { ArrowRight, Layers, Terminal, GraduationCap } from "lucide-react";
import { SectionHeading } from "./shared";

interface PlatformArmProps {
  icon: React.ReactNode;
  title: string;
  bullets: string[];
  ctaHref: string;
  ctaLabel: string;
}

function PlatformArm({ icon, title, bullets, ctaHref, ctaLabel }: PlatformArmProps) {
  return (
    <div className="group border-border bg-background px-8 py-10 transition-colors hover:bg-muted/35 md:border-r md:border-b-0 md:last:border-r-0 border-b last:border-b-0 md:border-b-0 md:border-t-0 md:border-border">
      <div className="mb-8 flex h-14 w-14 items-center justify-center border-2 border-primary text-primary transition-all duration-500 group-hover:bg-primary group-hover:text-primary-foreground">
        {icon}
      </div>
      <h3 className="mb-6 text-xl font-black uppercase tracking-tight">{title}</h3>
      <ul className="mb-8 space-y-3 text-sm font-medium leading-relaxed text-muted-foreground">
        {bullets.map((b, i) => (
          <li key={i} className="flex gap-3">
            <span className="mt-2 inline-block h-1.5 w-1.5 shrink-0 bg-primary opacity-70" />
            <span>{b}</span>
          </li>
        ))}
      </ul>
      <Link
        href={ctaHref}
        className="inline-flex items-center gap-2 border-b-2 border-primary pb-0.5 text-xs font-bold uppercase tracking-[0.2em] text-primary hover:text-foreground hover:border-foreground transition-colors"
      >
        {ctaLabel} <ArrowRight className="h-3 w-3" />
      </Link>
    </div>
  );
}

export function PlatformValueProps() {
  return (
    <section className="relative z-10 mx-auto max-w-7xl px-6 py-20 md:py-28">
      <SectionHeading
        kicker="O que faz a plataforma"
        title="Três lugares diferentes, um mesmo objetivo: clareza"
        subtitle="Escolhes o formato conforme estado de espírito — catálogo aberto para mergulhos profundos ou curso com ordem e provas."
      />
      <div className="mt-14 grid gap-0 border border-border md:grid-cols-3">
        <PlatformArm
          icon={<Layers className="h-8 w-8" />}
          title="Catálogo de problemas"
          bullets={[
            "Cada problema com enunciado, tags e duração orientativa.",
            "Várias soluções (brute-force, óptima, alternativa) quando existir.",
            "Entrada directa nas soluções e no modo leitura do código.",
          ]}
          ctaHref="/problems"
          ctaLabel="Ver problemas"
        />
        <PlatformArm
          icon={<Terminal className="h-8 w-8" />}
          title="Code player linha-a-linha"
          bullets={[
            "Destaque por linha com explicação em markdown.",
            "Três abas por linha: resumo rápido, passo-a-paso, trade-offs.",
            "Ligação directa aos conceitos (Big O, two pointers...) quando faz sentido.",
          ]}
          ctaHref="/problems/two-sum"
          ctaLabel="Exemplo rápido: Two Sum"
        />
        <PlatformArm
          icon={<GraduationCap className="h-8 w-8" />}
          title="Curso + fundamentos"
          bullets={[
            "Trilho ordenado com desbloqueio progressivo.",
            "Exemplos com separador simples vs profundo e perguntas de fixação.",
            "Certificado por capítulo só no teu navegador após a prova.",
          ]}
          ctaHref="/course/fundamentos-fase-1"
          ctaLabel="Abrir programa do curso"
        />
      </div>
    </section>
  );
}
