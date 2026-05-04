import Link from 'next/link';
import { Clock } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getAllConcepts } from '@/lib/content/loader';

export const metadata = {
  title: 'Conceitos',
  description: 'Mini-cursos sobre Big O, hash tables, e outros fundamentos que vais usar em todos os problemas.',
};

export default async function ConceptsPage() {
  const concepts = await getAllConcepts();
  concepts.sort((a, b) => a.meta.title.localeCompare(b.meta.title));

  return (
    <div className="relative bg-grid-pattern">
      <div className="mx-auto max-w-5xl px-6 py-24">
        <div className="mb-14 rounded-xl border border-primary/35 bg-background/95 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-primary">Nova trilha</p>
            <h2 className="text-xl font-bold tracking-tight">Prefere um programa com ordem fixa?</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              O mesmo conteúdo abaixo entra também no curso de Fundamentos: progresso no browser, dois níveis nos exemplos
              interativos e certificado próprio assim que resolveres a avaliação de cada módulo.
            </p>
          </div>
          <Link
            href="/curso/fundamentos-fase-1"
            className="shrink-0 inline-flex items-center justify-center border-2 border-primary px-6 py-3 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-primary hover:text-primary-foreground transition-colors text-center"
          >
            Ver curso de Fundamentos
          </Link>
        </div>
        <header className="mb-20 border-l-4 border-primary pl-8">
          <Badge variant="secondary" className="mb-4 font-mono text-[10px] px-1.5 py-0 rounded-none bg-primary/10 text-primary uppercase">
            Concepts.CORE
          </Badge>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 uppercase">
            Fundamental <br /> Concepts
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl font-medium uppercase tracking-tight">
            The essential tools that appear in almost every technical challenge. 
            Direct lessons to solidify your base understanding.
          </p>
        </header>

        <div className="grid sm:grid-cols-2 gap-0 border border-border">
          {concepts.map((c) => (
            <Link key={c.meta.slug} href={`/concepts/${c.meta.slug}`} className="group relative border border-border p-px hover:z-10">
              <Card className="h-full rounded-none border-none bg-background transition-all duration-200 group-hover:bg-muted/50">
                <CardHeader className="px-6 pt-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Badge variant="secondary" className="font-mono text-[9px] px-1.5 py-0 rounded-none bg-primary/10 text-primary uppercase">
                      {c.meta.category.replace('-', '_')}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-black uppercase tracking-tight group-hover:text-primary transition-colors">
                    {c.meta.title}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-2 font-mono text-[10px] uppercase">
                    <Clock className="h-3 w-3" /> {c.meta.estimatedMinutes}m Reading
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <p className="text-sm text-muted-foreground leading-relaxed">{c.meta.summary}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}


