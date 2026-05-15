"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-background text-foreground relative overflow-hidden min-h-[80vh] bg-grid-pattern">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span
          className="text-[40vw] font-black leading-none opacity-5 dark:opacity-[0.12] text-transparent"
          style={{ WebkitTextStroke: "1px var(--foreground)" }}
        >
          404
        </span>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl">
        <h1 className="text-9xl md:text-[12rem] font-black tracking-tighter mb-4 text-primary animate-in fade-in zoom-in duration-1000">
          404
        </h1>

        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 fill-mode-both flex flex-col items-center">
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight max-w-2xl text-center">
            Desculpa, mas a página solicitada não foi encontrada
          </h2>
          <p className="text-xs md:text-sm text-muted-foreground uppercase font-mono font-bold tracking-[0.2em] text-center">
            Por favor, volta para a página inicial ou entra em contacto com o
            suporte abaixo
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 w-full">
            <Button
              asChild
              className="h-12 px-10 rounded-none font-black uppercase tracking-widest bg-primary text-primary-foreground hover:opacity-90 border-none transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
            >
              <Link href="/">Ir para Home Page</Link>
            </Button>

            {/* <Button
              asChild
              variant="outline"
              className="h-12 px-10 rounded-none font-black uppercase tracking-widest border-2 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <Link href="/support">Página de Suporte</Link>
            </Button> */}
          </div>
        </div>
      </div>
    </div>
  );
}
