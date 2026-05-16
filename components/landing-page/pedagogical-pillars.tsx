import React from "react";
import {
  GitBranch,
  BookOpen,
  Code,
  Trophy,
  Sparkles,
  Terminal,
} from "lucide-react";
import { SectionHeading } from "./shared";

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function Feature({ icon, title, description }: FeatureProps) {
  return (
    <div className="group relative border border-border border-b bg-background bg-grid-pattern p-10 hover:bg-muted/30 max-md:border-r-0 [&:last-child]:border-b-0 md:border-r md:[&:nth-child(3n)]:border-r-0 md:[&:nth-child(n+4)]:border-b-0">
      <div className="h-14 w-14 mb-8 flex items-center justify-center border-2 border-primary text-primary transition-all duration-500 group-hover:bg-primary group-hover:text-primary-foreground">
        {icon}
      </div>
      <h3 className="mb-4 text-xl font-black uppercase tracking-tight">{title}</h3>
      <p className="text-sm font-medium leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

export function PedagogicalPillars() {
  return (
    <section id="pedagogical-pillars" className="relative z-10 mx-auto max-w-7xl px-6 pb-20 md:py-28">
      <SectionHeading
        kicker="Diferenciação"
        title="Pilares pedagógicos explícitos"
        subtitle="Isto não é substituto de escreveres código sozinho no editor — complementa esse treino com narrações profundamente técnicas do que já funcionou bem."
      />
      <div className="mt-14 grid gap-0 border border-border md:grid-cols-3">
        <Feature
          icon={<GitBranch className="h-6 w-6" />}
          title="Confrontar soluções"
          description="Vê lado a lado força bruta e versão ótima sempre que disponível: percebes onde aparece hashing, ponteiros ou janela deslizante."
        />
        <Feature
          icon={<BookOpen className="h-6 w-6" />}
          title="Três níveis por linha"
          description="Resumo para navegar rápido, detalhado para segurar o modelo mental, deep dive quando queres invariantes ou complexidade amortizada honesta."
        />
        <Feature
          icon={<Code className="h-6 w-6" />}
          title="Código canónico"
          description="Sobretudo TypeScript legível: a ideia vem sempre antes dos pormenores de sintaxe de uma língua em particular."
        />
        <Feature
          icon={<Trophy className="h-6 w-6" />}
          title="Curso modular local"
          description="Mesmos fundamentos ordenados por capítulo, exercícios, provas e certificado apenas no teu dispositivo após avaliações."
        />
        <Feature
          icon={<Sparkles className="h-6 w-6" />}
          title="Ligações contextuais"
          description='As explicações puxam fichas tipo "big-o" só quando esse trecho mesmo depende aquela ferramenta — menos dispersão irrelevante.'
        />
        <Feature
          icon={<Terminal className="h-6 w-6" />}
          title="Leitura first-class"
          description="Fluxo inteiro centrado ler e seguir código real com highlight — não apenas pseudocódigo estático perdido página HTML."
        />
      </div>
    </section>
  );
}
