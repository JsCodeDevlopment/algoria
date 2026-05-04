import Link from 'next/link';
import type { Metadata } from 'next';

import { Badge } from '@/components/ui/badge';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getAllStudyTracks } from '@/lib/content/track-loader';
import { buildPublicMetadata } from '@/lib/seo/build-metadata';

export const metadata: Metadata = buildPublicMetadata({
  title: 'Trilhos curados de problemas',
  description:
    'Listas editoriais ordenadas — fundamentos na ordem recomendada ou foco arrays & hashing — para estudar sem escolher tu próprio a sequência.',
  pathname: '/tracks',
  keywords: ['trilho estudo', 'roadmap algoritmos', 'arrays hashing', 'ordem recomendada'],
});

export default async function TracksIndexPage() {
  const tracks = await getAllStudyTracks();

  return (
    <div className="relative bg-grid-pattern">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <header className="mb-12 border-l-4 border-primary pl-8">
          <Badge variant="outline" className="mb-4 font-mono text-[10px] border-primary/30 text-primary">
            STUDY.TRACKS
          </Badge>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 uppercase">Trilhos curados</h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl font-medium">
            Cada trilho é uma lista ordenada de slugs em <code className="text-sm">content/tracks/</code> — mantém ritmo editorial sem backend.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          {tracks.map((t) => (
            <Link key={t.slug} href={`/tracks/${t.slug}`} className="group block">
              <Card className="h-full rounded-xl border-border bg-card/80 backdrop-blur-sm transition-colors hover:border-primary/40">
                <CardHeader>
                  <CardTitle className="text-xl font-black uppercase tracking-tight group-hover:text-primary transition-colors">
                    {t.title}
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed">{t.summary}</CardDescription>
                  <p className="text-[11px] font-mono text-muted-foreground pt-2">{t.problemSlugs.length} problemas</p>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>

        <p className="mt-12 text-center">
          <Link href="/problems" className="text-sm font-semibold text-primary underline-offset-4 hover:underline">
            Voltar ao catálogo completo
          </Link>
        </p>
      </div>
    </div>
  );
}
