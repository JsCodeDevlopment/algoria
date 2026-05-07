import { Check, Lock, Zap } from "lucide-react";
import Link from "next/link";

import { PaywallAnalytics } from "@/components/billing/paywall-analytics";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function UpgradePrompt({
  context,
  problemSlug,
  conceptSlug,
  hideLogin,
}: {
  context?: string;
  problemSlug?: string;
  conceptSlug?: string;
  hideLogin?: boolean;
}) {
  const isConcept = !!conceptSlug;

  const perks = isConcept
    ? [
        "Acesso a todos os conceitos avançados",
        "Padrões de desenho e arquitetura",
        "Guias de engenharia aplicada",
        "Sincronização de progresso",
      ]
    : [
        "Player linha-a-linha interativo",
        "Traces de execução visual",
        "Múltiplas linguagens (JS, TS, Python...)",
        "Soluções ótimas e alternativas",
      ];

  return (
    <div className="mx-auto max-w-3xl border-2 border-primary bg-background p-0 overflow-hidden">
      {/* Industrial Header Bar - Mirroring Technical Section in Homepage */}
      <div className="border-b-2 border-primary bg-primary/[0.06] px-8 py-5 flex items-center justify-between">
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.35em] text-primary">
            Acesso Restrito
          </p>
          <p className="mt-1 text-sm font-semibold uppercase tracking-wide text-foreground">
            Funcionalidade Pro Necessária
          </p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center border-2 border-primary bg-background text-primary">
          <Lock className="h-5 w-5" />
        </div>
      </div>

      {/* Grid Pattern Body */}
      <div className="p-8 md:p-12 bg-grid-pattern relative">
        {problemSlug || conceptSlug ? (
          <PaywallAnalytics
            problemSlug={problemSlug}
            conceptSlug={conceptSlug}
          />
        ) : null}

        <div className="relative z-10">
          <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="space-y-4 text-left">
              <h2 className="text-4xl font-black uppercase tracking-tighter leading-none md:text-5xl text-foreground">
                {context ?? (isConcept ? "Conceito Pro" : "Conteúdo Pro")}
              </h2>
              <div className="h-1.5 w-32 bg-primary" />
            </div>
            <Badge
              variant="outline"
              className="rounded-none border-primary/40 px-3 py-1 font-mono text-[10px] text-primary self-start md:self-auto uppercase tracking-widest whitespace-nowrap"
            >
              Licença Exclusiva
            </Badge>
          </div>

          <p className="text-base sm:text-lg leading-relaxed text-muted-foreground mb-12 max-w-2xl border-l-[3px] border-primary/35 pl-6 text-left">
            {isConcept ? (
              <>
                Este guia técnico faz parte do catálogo{" "}
                <strong>Algoria Pro</strong>. Utilizamos o mesmo método de
                leitura crítica para temas de arquitetura e sistemas reais.
              </>
            ) : (
              <>
                Domina este problema com o player linha-a-linha. Vê como cada
                decisão impacta a complexidade e o estado do sistema através de
                traces interativos.
              </>
            )}
          </p>

          {/* Perks Grid - Mirroring Platform Features Pattern */}
          <div className="grid gap-0 border border-border md:grid-cols-2 mb-12 bg-background shadow-sm">
            {perks.map((perk, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-5 border-b border-border md:border-b-0 md:odd:border-r last:border-b-0 group hover:bg-muted/30 transition-colors"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center border-2 border-primary/30 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                  <Check className="h-4 w-4" strokeWidth={3} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest leading-snug">
                  {perk}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Button
              asChild
              size="xl"
              className="rounded-none px-10 font-black uppercase tracking-[0.2em] text-xs flex-1"
            >
              <Link
                href="/pricing"
                className="flex items-center justify-center gap-2"
              >
                <Zap className="h-4 w-4 fill-current" /> Desbloquear Agora
              </Link>
            </Button>
            {!hideLogin && (
              <Button
                asChild
                variant="outline"
                size="xl"
                className="rounded-none border-2 border-foreground px-8 font-black uppercase tracking-[0.2em] text-xs flex-1"
              >
                <Link href="/auth/sign-in">Entrar na conta</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
