import type { Metadata } from "next";

import { HubGuidesList } from "@/components/engenharia-trabalho/hub-guides-list";
import { HubSelectionGrid } from "@/components/engenharia-trabalho/hub-selection-grid";
import { Badge } from "@/components/ui/badge";
import { getAllEngineeringWorkGuides } from "@/lib/content/loader";
import {
  ENGINEERING_WORK_PILLARS,
  type EngineeringWorkPillar,
} from "@/lib/content/schemas";
import { buildPublicMetadata } from "@/lib/seo/build-metadata";

export const metadata: Metadata = buildPublicMetadata({
  title: "Engenharia no trabalho — categorias",
  description:
    "Escolha a sua trilha de especialização em engenharia: Frontend, Backend, DevOps, IA ou Soft Skills.",
  pathname: "/engineering-work",
});

export default async function EngineeringWorkHubPage({
  searchParams,
}: {
  searchParams: Promise<{ pillar?: string }>;
}) {
  const { pillar: selectedPillar } = await searchParams;
  const guides = await getAllEngineeringWorkGuides();

  const isValidPillar = (p: string | undefined): p is EngineeringWorkPillar =>
    !!p && (ENGINEERING_WORK_PILLARS as readonly string[]).includes(p);

  return (
    <div className="relative bg-grid-pattern min-h-[calc(100vh-4rem)]">
      <div className="mx-auto max-w-7xl px-6 py-24">
        {!isValidPillar(selectedPillar) ? (
          <>
            <header className="mb-20 border-l-4 border-primary pl-8">
              <Badge
                variant="secondary"
                className="mb-4 rounded-none bg-primary/10 px-1.5 py-0 font-mono text-[10px] uppercase text-primary"
              >
                Conteúdo prático de engenharia
              </Badge>
              <h1 className="mb-4 text-4xl font-black uppercase tracking-tighter md:text-6xl">
                Engenharia no trabalho
              </h1>
              <p className="max-w-2xl text-lg leading-relaxed tracking-tight text-muted-foreground">
                Escolha uma categoria para explorar guias aplicáveis na sprint
                real. Material pensado para elevar a tua maturidade técnica.
              </p>
            </header>

            <HubSelectionGrid
              guidesCount={ENGINEERING_WORK_PILLARS.reduce(
                (acc, pillar) => {
                  acc[pillar] = guides.filter(
                    (g) => g.meta.pillar === pillar,
                  ).length;
                  return acc;
                },
                {} as Record<EngineeringWorkPillar, number>,
              )}
            />
          </>
        ) : (
          <HubGuidesList
            pillar={selectedPillar}
            guides={guides.filter((g) => g.meta.pillar === selectedPillar)}
          />
        )}
      </div>
    </div>
  );
}
