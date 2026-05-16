import React from "react";
import { Users, LineChart, Target } from "lucide-react";
import { SectionHeading } from "./shared";

interface AudienceCardProps {
  icon: React.ReactNode;
  title: string;
  text: string;
}

function AudienceCard({ icon, title, text }: AudienceCardProps) {
  return (
    <div className="border border-border bg-background p-8 transition-colors hover:border-primary/50">
      <div className="mb-6 flex text-primary">{icon}</div>
      <h3 className="mb-4 text-lg font-black uppercase tracking-tight">{title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
    </div>
  );
}

export function TargetAudience() {
  return (
    <section className="relative z-10 border-t border-border bg-muted/25 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          kicker="Público"
          title="Feito pensando nestas pessoas"
          subtitle="Se estás cansado de acumular submits sem entender a ideia estrutural, isto mantém o foco na leitura crítica do código."
        />
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          <AudienceCard
            icon={<Users className="h-6 w-6" />}
            title="Preparação a entrevistas"
            text="Dominar o raciocínio verbal da solução (não só entregar um ficheiro): ideal para repetir cenários até fixar."
          />
          <AudienceCard
            icon={<LineChart className="h-6 w-6" />}
            title="Autodidata que já fez listas"
            text="Já tens a brute e queres ver exactamente porque a segunda abordagem deixa de repetir trabalho quadrático onde já não faz falta."
          />
          <AudienceCard
            icon={<Target className="h-6 w-6" />}
            title="Professor ou mentor rápido"
            text="Partilhar os mesmos excertos comentados poupa tempo em pormenores de sintaxe e liberta tempo para invariantes e complexidade."
          />
        </div>
      </div>
    </section>
  );
}
