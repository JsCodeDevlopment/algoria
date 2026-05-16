import React from "react";
import Link from "next/link";
import { Briefcase, TrendingUp, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function TechnicalJobTests() {
  return (
    <section
      id="technical-job-tests"
      className="relative z-10 scroll-mt-28 border-y border-primary/20 bg-muted/30"
    >
      <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-start lg:gap-16">
          <div className="space-y-8">
            <div className="flex flex-wrap items-center gap-3">
              <Badge
                variant="outline"
                className="rounded-none border-primary/40 px-3 py-1 font-mono text-[10px] text-primary"
              >
                Em expansão editorial
              </Badge>
              <span className="text-[11px] font-black uppercase tracking-[0.38em] text-muted-foreground">
                Vagas & entrevistas
              </span>
            </div>
            <div className="flex items-start gap-5">
              <div className="mt-1 flex h-14 w-14 shrink-0 items-center justify-center border-2 border-primary bg-background text-primary">
                <Briefcase className="h-7 w-7" aria-hidden />
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl font-black uppercase leading-tight tracking-tighter md:text-5xl md:leading-[1]">
                  Resoluções no ritmo dos testes técnicos
                </h2>
                <p className="border-l-[3px] border-primary/35 pl-6 text-muted-foreground md:text-lg md:leading-relaxed">
                  A mesma filosofia da Algoria — ler implementações bem comentadas
                  antes de cair só em memorização — aplica-se aos desafios típicos
                  de processos seleção: encontrar invariantes rápido, explicar
                  complexidade verbalmente e escolher a abordagem certa quando o
                  enunciado ecoa vagas clássicas (arrays e hashing, duas pontas,
                  grafos quando encaixa, simulações com limites bem definidos...).
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <Button
                    asChild
                    variant="outline"
                    size="xl"
                    className="rounded-none border-2 px-8 font-black uppercase tracking-wider"
                  >
                    <Link href="/problems">Treinar já no catálogo</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="xl"
                    className="rounded-none border-2 px-8 font-black uppercase tracking-wider"
                  >
                    <Link href="/interview-en">Inglês técnico · hub EN</Link>
                  </Button>
                  <Link
                    href="/course/fundamentos-fase-1"
                    className="inline-flex items-center gap-2 self-center px-2 text-[11px] font-bold uppercase tracking-[0.2em] text-primary hover:underline"
                  >
                    Revisar fundamentos guiados{" "}
                    <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-0 border border-border bg-background">
            <div className="border-b border-border bg-primary/[0.06] px-8 py-5">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.35em] text-primary">
                Linha editorial
              </p>
              <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-foreground">
                O que vais usar na prática
              </p>
            </div>
            <ul className="divide-y divide-border px-8 py-2">
              {[
                "Bundles problema + solução mapeados a padrões de entrevista (ordenar, hashing, greedy prudente, janelas).",
                "Guia de raciocínio antes do compilador — o que dirias numa videochamada, não só o fluxo dos submits.",
                "Confrontos “passa só os exemplinhos públicos errados típicos” vs solução mínima defensável em entrevistas.",
              ].map((line, i) => (
                <li
                  key={i}
                  className="flex gap-4 py-5 text-sm leading-relaxed text-muted-foreground"
                >
                  <TrendingUp
                    className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                    aria-hidden
                  />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
            <div className="border-t border-dashed border-border bg-muted/20 px-8 py-4 text-[11px] leading-relaxed text-muted-foreground">
              Trilhos dedicados apenas a vagas aparecem gradualmente dentro do
              formato de problemas já existente — esta secção marca a intenção
              editorial enquanto o catálogo crescer nesse eixo.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
