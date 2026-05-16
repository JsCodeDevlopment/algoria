"use client";

import { BackgroundBeams } from "@/components/ui/background-beams";
import { Button } from "@/components/ui/button";
import { FlipWords } from "@/components/ui/flip-words";
import { SparklesCore } from "@/components/ui/sparkles";
import { Spotlight } from "@/components/ui/spotlight";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { MiniPlayer } from "./mini-player";

export function Hero() {
  return (
    <div className="relative flex flex-1 flex-col justify-center overflow-hidden">
      <div className="absolute inset-0 pointer-events-none -z-10">
        <Spotlight
          className="-top-40 left-0 md:left-60 md:-top-20"
          fill="white"
        />
        <BackgroundBeams className="opacity-40" />
        <SparklesCore
          background="transparent"
          minSize={0.4}
          maxSize={1.2}
          particleDensity={20}
          className="w-full h-full"
          particleColor="#4f46e5"
        />
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.06] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_40%,black_20%,transparent_100%)]" />

        <div className="absolute top-0 left-1/2 z-0 w-full max-w-[1400px] -translate-x-1/2 overflow-hidden opacity-10 md:opacity-20">
          <div className="absolute top-[-140px] left-[-40px] h-[460px] w-[460px] rotate-45 border border-primary/25" />
          <div className="absolute top-[80px] right-[-80px] h-[380px] w-[380px] -rotate-6 border border-primary/15" />
        </div>
      </div>

      <section className="relative z-10 mx-auto flex flex-1 max-w-7xl flex-col justify-center px-6 py-8 md:py-12">
        <div className="grid items-center gap-16 lg:grid-cols-[1.2fr_430px] lg:gap-12">
          <div className="max-w-3xl space-y-9">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-4"
            >
              <div className="h-px w-10 bg-primary/50" />
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.4em] text-primary">
                Plataforma de elite para engenheiros
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="text-[1.8rem] font-black uppercase leading-[0.92] tracking-tighter md:text-6xl md:leading-[0.88] lg:text-8xl"
            >
              Domine a lógica.
              <br />
              Entenda o{" "}
              <FlipWords
                words={[
                  "algoritmo",
                  "padrão",
                  "sistema",
                  "desafio",
                  "conceito",
                ]}
              />
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="max-w-xl border-l-[3px] border-primary/35 pl-6 text-lg leading-relaxed text-muted-foreground md:text-xl md:leading-relaxed"
            >
              Pare de decorar soluções. Domine os padrões e a complexidade por
              trás de cada linha com o{" "}
              <strong className="text-foreground">Code Player</strong>{" "}
              interativo e explicações em três níveis de profundidade.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45 }}
              className="flex flex-col gap-4 sm:flex-row sm:items-center"
            >
              <Button
                asChild
                size="xl"
                className="rounded-none px-10 font-bold uppercase tracking-wider"
              >
                <Link href="/problems">
                  Começar agora <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="xl"
                className="rounded-none border-2 px-8 font-bold uppercase tracking-wider"
              >
                <Link href="/course/fundamentos-fase-1">
                  Curso guiado
                  <Sparkles className="ml-2 h-4 w-4 opacity-70" aria-hidden />
                </Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="xl"
                className="rounded-none border-b-2 border-primary/40 hover:bg-primary/5 hover:border-primary px-8 font-bold uppercase tracking-wider"
              >
                <Link href="/problems/two-sum/brute-force">
                  Testar Player
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </div>

          <div className="hidden lg:flex justify-end">
            <MiniPlayer />
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </div>
  );
}
