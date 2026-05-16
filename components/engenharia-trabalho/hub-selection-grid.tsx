import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ENGINEERING_WORK_PILLARS,
  EngineeringWorkPillar,
} from "@/lib/content/schemas";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { PILLAR_ICON, PILLAR_TAGLINE, PILLAR_TITLE } from "./ui-constants";

interface HubSelectionGridProps {
  guidesCount: Record<EngineeringWorkPillar, number>;
}

export function HubSelectionGrid({ guidesCount }: HubSelectionGridProps) {
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {ENGINEERING_WORK_PILLARS.map((pillar, idx) => {
        const count = guidesCount[pillar] || 0;

        return (
          <Link
            key={pillar}
            href={`/engineering-work?pillar=${pillar}`}
            className="group relative flex flex-col"
          >
            <Card className="relative flex h-full flex-col overflow-hidden rounded-none border-border bg-background p-8 transition-all duration-500 group-hover:-translate-y-2 group-hover:border-primary group-hover:bg-primary group-hover:shadow-[0_20px_50px_rgba(var(--primary-rgb),0.2)]">
              <CardHeader className="relative p-0">
                <div className="mb-10 flex h-16 w-16 items-center justify-center border-2 border-primary bg-primary/5 text-primary transition-all duration-500 group-hover:border-primary-foreground/40 group-hover:bg-primary-foreground/10 group-hover:text-primary-foreground">
                  {PILLAR_ICON[pillar]}
                </div>

                <div className="flex flex-col gap-1">
                  <Badge
                    variant="secondary"
                    className="mb-3 w-fit rounded-none border border-primary/20 bg-primary/5 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest text-primary transition-colors duration-500 group-hover:border-primary-foreground/30 group-hover:bg-primary-foreground group-hover:text-primary"
                  >
                    {count}{" "}
                    {count === 1 ? "Guia disponível" : "Guias disponíveis"}
                  </Badge>
                  <CardTitle className="text-3xl font-black uppercase leading-none tracking-tighter transition-colors duration-500 group-hover:text-primary-foreground">
                    {PILLAR_TITLE[pillar]}
                  </CardTitle>
                </div>
              </CardHeader>

              <CardContent className="relative mt-6 flex-grow p-0">
                <p className="text-sm font-medium leading-relaxed text-muted-foreground transition-colors duration-500 group-hover:text-primary-foreground/90">
                  {PILLAR_TAGLINE[pillar]}
                </p>
              </CardContent>

              <div className="relative mt-10 flex items-center justify-between border-t border-border pt-6 transition-colors duration-500 group-hover:border-primary-foreground/20">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary transition-colors duration-500 group-hover:text-primary-foreground">
                  Explorar trilha
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-primary/20 bg-primary/5 text-primary transition-all duration-500 group-hover:border-primary-foreground/40 group-hover:bg-primary-foreground group-hover:text-primary group-hover:translate-x-2">
                  <ArrowLeft className="h-4 w-4 rotate-180" />
                </div>
              </div>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
