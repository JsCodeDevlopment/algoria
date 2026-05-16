import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function FinalCTA() {
  return (
    <section className="relative z-10 border-t border-primary/30 bg-gradient-to-br from-primary/10 via-muted/35 to-transparent py-16 md:py-24">
      <div className="mx-auto flex max-w-7xl flex-col items-start gap-6 px-6 md:flex-row md:items-center md:justify-between md:gap-10">
        <div className="max-w-xl space-y-4">
          <p className="text-[11px] font-black uppercase tracking-[0.38em] text-primary">
            Começar agora
          </p>
          <h2 className="text-3xl font-black uppercase leading-tight tracking-tighter md:text-5xl md:leading-none">
            Claro até demais porque isto existe
          </h2>
          <p className="text-muted-foreground md:text-lg">
            Ler implementações bem comentadas ao lado da teoria certa faz com que
            as tuas próprias soluções futuras tenham menos regressões — porque
            reconhecer padrões passa a ser quase automático.
          </p>
        </div>
        <div className="flex w-full flex-col gap-4 sm:flex-row md:w-auto">
          <Button
            asChild
            size="xl"
            className="rounded-none px-10 font-black uppercase tracking-wider"
          >
            <Link href="/problems">Entrar catálogo</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="xl"
            className="rounded-none border-2 border-foreground px-8 font-black uppercase tracking-wider"
          >
            <Link href="/course/fundamentos-fase-1">Curso primeiro</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
