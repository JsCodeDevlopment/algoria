import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  EngineeringWorkGuide,
  EngineeringWorkPillar,
} from "@/lib/content/schemas";
import { ArrowLeft, Clock } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

import { PILLAR_ICON, PILLAR_TAGLINE, PILLAR_TITLE } from "./ui-constants";

interface HubGuidesListProps {
  pillar: EngineeringWorkPillar;
  guides: EngineeringWorkGuide[];
}

export function HubGuidesList({ pillar, guides }: HubGuidesListProps) {
  return (
    <div className="space-y-12">
      <header className="mb-12">
        <Button
          asChild
          variant="outline"
          size="sm"
          className="mb-8 rounded-none border-2 font-bold uppercase tracking-widest"
        >
          <Link href="/engineering-work">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para categorias
          </Link>
        </Button>

        <div className="flex flex-col gap-6 border-l-4 border-primary pl-8">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center border border-primary/40 bg-primary/5 text-primary">
              {PILLAR_ICON[pillar]}
            </div>
            <div>
              <Badge
                variant="secondary"
                className="mb-1 rounded-none bg-primary/10 px-2 py-0 font-mono text-[9px] uppercase text-primary"
              >
                Pilar · {pillar}
              </Badge>
              <h1 className="text-3xl font-black uppercase tracking-tighter md:text-5xl">
                {PILLAR_TITLE[pillar]}
              </h1>
            </div>
          </div>
          <p className="max-w-2xl text-lg leading-relaxed tracking-tight text-muted-foreground">
            {PILLAR_TAGLINE[pillar]}
          </p>
        </div>
      </header>

      {guides.length === 0 ? (
        <div className="border border-dashed border-border py-20 text-center">
          <p className="text-muted-foreground">
            Conteúdo deste pilar em preparação. Volta em breve!
          </p>
        </div>
      ) : (
        <div className="grid gap-0 border border-border sm:grid-cols-2">
          {guides.map((g) => (
            <Link
              key={g.meta.slug}
              href={`/engineering-work/${g.meta.slug}`}
              className="group relative border border-border p-px hover:z-10"
            >
              <Card className="h-full rounded-none border-none bg-background transition-all duration-200 group-hover:bg-muted/50">
                <CardHeader className="px-6 pt-6">
                  <CardTitle className="text-lg font-black uppercase tracking-tight transition-colors group-hover:text-primary md:text-xl">
                    {g.meta.title}
                  </CardTitle>
                  <CardDescription className="mt-2 flex items-center gap-2 font-mono text-[10px] uppercase">
                    <Clock className="h-3 w-3 shrink-0" aria-hidden /> ~
                    {g.meta.estimatedMinutes} min de leitura
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {g.meta.summary}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <footer className="mt-20 border-l-[3px] border-primary/35 pl-6">
        <p className="text-sm leading-relaxed text-muted-foreground">
          Estás a ver guias de <strong>{PILLAR_TITLE[pillar]}</strong>. Estes
          conteúdos são focados em aplicação prática imediata.
        </p>
      </footer>
    </div>
  );
}
