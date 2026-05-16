import { buildPublicMetadata } from "@/lib/seo/build-metadata";
import type { Metadata } from "next";

import { EngineeringShowcase } from "@/components/landing-page/engineering-showcase";
import { FaqSection } from "@/components/landing-page/faq-section";
import { FeaturedProblems } from "@/components/landing-page/featured-problems";
import { FinalCTA } from "@/components/landing-page/final-cta";
import { Hero } from "@/components/landing-page/hero";
import { HowItWorks } from "@/components/landing-page/how-it-works";
import { MetricsMarquee } from "@/components/landing-page/metrics-marquee";
import { PedagogicalPillars } from "@/components/landing-page/pedagogical-pillars";
import { PlatformValueProps } from "@/components/landing-page/platform-value-props";
import { TargetAudience } from "@/components/landing-page/target-audience";
import { TechnicalJobTests } from "@/components/landing-page/technical-job-tests";

export const metadata: Metadata = buildPublicMetadata({
  titleAbsolute:
    "Algoria — Aprenda Algoritmos com Code Player Linha-a-Linha e Preparação Técnica para Elite",
  description:
    "Domine algoritmos, estruturas de dados e sistemas complexos. Explore soluções explicadas linha-a-linha com nosso Code Player, prepare-se para entrevistas em Big Techs e acesse guias práticos de Engenharia (Frontend, Backend, DevOps e IA).",
  pathname: "/",
  image: "/preview.webp",
  keywords: [
    "Algoria",
    "algoritmos e estruturas de dados",
    "preparação para entrevistas técnicas",
    "estudar algoritmos linha a linha",
    "code player educativo",
    "padrões de leetcode",
    "system design para engenheiros",
    "big o notation explicada",
    "curso de algoritmos online",
    "entrevista de código big tech",
    "aprendizado técnico interativo",
    "engenharia de software aplicada",
    "frontend backend devops ia roadmap",
    "boas práticas de programação",
    "estudo dirigido de código",
    "programação competitiva iniciante",
    "typescript para entrevistas",
    "node.js backend escalável",
    "performance web vitals",
    "arquitetura de sistemas distribuídos",
    "inteligência artificial para engenheiros",
    "treinamento de LLMs",
    "mentoria técnica software",
    "desafios de código comentados",
    "carreira sênior engenharia",
    "algoritmos de busca e ordenação",
  ],
});

export default async function HomePage() {
  return (
    <div className="relative">
      <div className="flex h-[calc(100dvh-4rem)] flex-col overflow-hidden">
        <Hero />
        <MetricsMarquee />
      </div>
      <PlatformValueProps />
      <HowItWorks />
      <TargetAudience />
      <PedagogicalPillars />
      <TechnicalJobTests />
      <EngineeringShowcase />
      <FeaturedProblems />
      <FaqSection />
      <FinalCTA />
    </div>
  );
}
