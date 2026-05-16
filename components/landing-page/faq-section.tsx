import React from "react";
import { ChevronDown } from "lucide-react";
import { SectionHeading } from "./shared";

interface FaqItemProps {
  question: string;
  answer: string;
}

function FaqItem({ question, answer }: FaqItemProps) {
  return (
    <details className="group border-none open:bg-muted/35">
      <summary className="flex cursor-pointer list-none items-start justify-between gap-4 px-5 py-4 text-left font-semibold uppercase tracking-tight [&::-webkit-details-marker]:hidden">
        <span className="pt-1 pr-6">{question}</span>
        <ChevronDown className="mt-1 h-4 w-4 shrink-0 text-primary transition-transform group-open:rotate-180" />
      </summary>
      <div className="border-t border-border/60 px-5 pb-5 pt-4 text-sm leading-relaxed text-muted-foreground">
        {answer}
      </div>
    </details>
  );
}

export function FaqSection() {
  return (
    <section className="relative z-10 border-t border-border py-16 md:py-24">
      <div className="mx-auto max-w-3xl px-6">
        <SectionHeading
          kicker="Dúvidas"
          title="Perguntas frequentes"
          subtitle="Antes de mergulhares, isto diz o que a plataforma garante neste momento."
          compact
        />
        <div className="mt-12 space-y-0 border border-border divide-y divide-border rounded-none bg-background">
          <FaqItem
            question="Posso apenas ler sem submeter código?"
            answer="Sim — o centro da experiência é o code player ao abrir cada solução: percorrer linhas, abrir níveis diferentes de explicação e saltar aos conceitos referenciados quando existirem."
          />
          <FaqItem
            question="O certificado do curso tem validação legal ou só local?"
            answer="É emitido apenas no browser após responderes bem à última avaliação de cada capítulo. Serve como marco pedagógico pessoal; não substitui exames externos formais institucionais."
          />
          <FaqItem
            question="Todos os exercícios têm mais do que uma solução?"
            answer="Preferimos sempre publicar pelo menos dois ângulos (por exemplo brute vs óptima) quando faz sentido. Se existir apenas uma edição forte no catálogo, ela ficará assim até aparecer segunda variante válida editorialmente."
          />
          <FaqItem
            question="Funciona bem no telemóvel?"
            answer="O site é responsivo; códigos longos em ecrãs pequenos costumam pedir zoom confortável de qualquer forma."
          />
        </div>
      </div>
    </section>
  );
}
