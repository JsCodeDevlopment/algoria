import React from "react";
import { SectionHeading } from "./shared";

interface StepProps {
  n: number;
  title: string;
  text: string;
}

function Step({ n, title, text }: StepProps) {
  return (
    <div className="bg-background p-8">
      <span className="font-mono text-[11px] font-bold uppercase tracking-[0.35em] text-primary">
        Passo {n}
      </span>
      <p className="mt-6 text-xl font-black uppercase tracking-tight">{title}</p>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{text}</p>
    </div>
  );
}

export function HowItWorks() {
  return (
    <section className="relative z-10 mx-auto max-w-7xl px-6 pb-20 md:pb-28">
      <SectionHeading
        kicker="Processo típico"
        title="Como usar em quatro movimentos"
        subtitle="Não há lição secreta atrás da paywall técnico: primeiro lê bem o problema, só depois vês o código já resolvido e comentado."
      />
      <div className="mt-14 grid gap-px border border-border bg-border md:grid-cols-2 lg:grid-cols-4">
        <Step
          n={1}
          title="Escolhe o problema"
          text="Filtra por dificuldade ou segue ordem recomendada no catálogo."
        />
        <Step
          n={2}
          title="Lê a solução comentada"
          text="Percorre o player: cada linha explica porque existe e onde encaixa no algoritmo global."
        />
        <Step
          n={3}
          title="Compara quando houver várias versões"
          text="Saltar brutal para óptima mostra onde a complexidade tempo/espaço muda mesmo."
        />
        <Step
          n={4}
          title="Ou segue o curso guiado"
          text="Mesmos temas estruturados com provas e reconhecimento local por capítulo."
        />
      </div>
    </section>
  );
}
