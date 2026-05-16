import { BackgroundBeams } from "@/components/ui/background-beams";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FlipWords } from "@/components/ui/flip-words";
import { SparklesCore } from "@/components/ui/sparkles";
import { Spotlight } from "@/components/ui/spotlight";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <div className="relative overflow-hidden border-b border-border">
      <div className="absolute top-0 left-0 h-full w-full pointer-events-none -z-10 bg-grid-pattern opacity-10 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      <BackgroundBeams className="-z-10" />
      <SparklesCore
        background="transparent"
        minSize={0.4}
        maxSize={1.2}
        particleDensity={40}
        className="w-full h-full -z-10"
        particleColor="#4f46e5"
      />

      <div className="pointer-events-none absolute top-0 left-1/2 z-0 w-full max-w-[1400px] -translate-x-1/2 overflow-hidden opacity-25 md:opacity-30">
        <div className="absolute top-[-140px] left-[-40px] h-[460px] w-[460px] rotate-45 border border-primary/25" />
        <div className="absolute top-[80px] right-[-80px] h-[380px] w-[380px] -rotate-6 border border-primary/15" />
      </div>

      <section className="relative z-10 mx-auto max-w-7xl px-6 pt-20 pb-16 md:pt-28 md:pb-24">
        <div className="animate-in flex max-w-4xl flex-col items-start gap-8">
          <div className="flex flex-wrap items-center gap-3">
            <Badge
              variant="outline"
              className="rounded-none border-primary/35 bg-primary/5 px-3 py-1 font-mono text-[10px] text-primary"
            >
              Plataforma de estudo técnico
            </Badge>
            <span className="text-[11px] font-bold uppercase tracking-[0.35em] text-muted-foreground">
              Problemas · Code player · Curso modular
            </span>
          </div>
          <h1 className="text-5xl font-black uppercase leading-[0.92] tracking-tighter md:text-8xl md:leading-[0.9]">
            Lê código com intenção. <br className="hidden sm:block" />
            Entende o{" "}
            <FlipWords words={["algoritmo", "padrão", "sistema", "desafio"]} />
          </h1>
          <p className="border-l-[3px] border-primary/35 pl-6 text-lg leading-relaxed text-muted-foreground md:text-xl md:leading-relaxed">
            A Algoria é um ambiente só para estudar decisões algorítmicas: mesmo
            exercício pode ter brute-force ao lado da versão melhor, todas as
            linhas comentadas em{" "}
            <strong className="text-foreground font-semibold">
              três níveis
            </strong>{" "}
            (resumo, detalhado, deep dive) e um{" "}
            <strong className="text-foreground font-semibold">
              curso de fundamentos guiado
            </strong>{" "}
            com avaliações e um certificado por capítulo gravado só no teu
            browser.
          </p>
          <div className="flex w-full flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
            <Button
              asChild
              size="xl"
              className="rounded-none px-10 font-bold uppercase tracking-wider"
            >
              <Link href="/problems">
                Abrir catálogo completo <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="xl"
              className="rounded-none border-2 px-8 font-bold uppercase tracking-wider"
            >
              <Link href="/course/fundamentos-fase-1">
                Curso de fundamentos guiado
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="xl"
              className="rounded-none font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground"
            >
              <Link href="/concepts">
                Conceitos rápidos
                <Sparkles className="ml-2 h-4 w-4 opacity-70" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
