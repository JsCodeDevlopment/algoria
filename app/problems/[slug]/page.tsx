import Link from 'next/link';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, BookOpen } from 'lucide-react';

import { UpgradePrompt } from '@/components/billing/upgrade-prompt';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { JsonLdScript } from '@/components/seo/json-ld';
import { MarkdownArticle } from '@/components/markdown/markdown-article';
import { DifficultyBadge } from '@/components/catalog/difficulty-badge';
import { ComplexityBadge } from '@/components/complexity/complexity-badge';
import { RequireAuth } from '@/components/auth/require-auth';
import { MermaidRenderer } from '@/components/markdown/mermaid-renderer';
import { ProblemStudyCompletionBar } from '@/components/problem/problem-study-completion-bar';
import { ProblemStudyTabs } from '@/components/problem/problem-study-tabs';
import { DailyChallengeTabVisit } from '@/components/gamification/daily-challenge-tab-visit';
import { ContentNavigation } from '@/components/layout/content-navigation';
import { ProblemVisitTracker } from '@/components/problem/problem-visit-tracker';
import { auth } from '@/lib/auth';
import { userHasPro } from '@/lib/billing/entitlements';
import { getProblemAccess, isProblemUnlockedForUser } from '@/lib/billing/tiering';
import { getAllProblemSlugs, getProblem, getConcept, getAdjacentProblems } from '@/lib/content/loader';
import { buildPublicMetadata } from '@/lib/seo/build-metadata';
import { learningResourceJsonLd } from '@/lib/seo/structured-data';
import { stripHtmlLoose } from '@/lib/seo/strip-html';

interface Params {
  slug: string;
}

export async function generateStaticParams(): Promise<Params[]> {
  const slugs = await getAllProblemSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const problem = await getProblem(slug);
  if (!problem) return {};
  const plain = stripHtmlLoose(problem.descriptionHtml);
  const description =
    plain.length > 0
      ? plain
      : `Enunciado e várias soluções comentadas linha-a-linha para «${problem.meta.title}» (${problem.meta.difficulty}).`;
  const difficultyPt =
    problem.meta.difficulty === 'easy' ? 'fácil' : problem.meta.difficulty === 'medium' ? 'médio' : 'difícil';
  return buildPublicMetadata({
    title: problem.meta.title,
    description,
    pathname: `/problems/${slug}`,
    keywords: [
      problem.meta.title,
      difficultyPt,
      ...problem.meta.tags,
      ...problem.meta.categories.map((c) => c.replace(/-/g, ' ')),
      'algoritmo',
      'estruturas de dados',
      'soluções comentadas',
    ],
    openGraphType: 'article',
  });
}

export default async function ProblemPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const problem = await getProblem(slug);
  if (!problem) notFound();

  const session = await auth.api.getSession({ headers: await headers() });
  const hasPro = await userHasPro(session?.user?.id);
  const access = getProblemAccess(problem.meta);
  const strategiesLocked = !isProblemUnlockedForUser(access, hasPro);
  const adjacent = await getAdjacentProblems(slug);

  const prereqs = (
    await Promise.all(problem.meta.prerequisites.map((s) => getConcept(s).then((c) => (c ? { slug: s, title: c.meta.title } : null))))
  ).filter((c): c is { slug: string; title: string } => c !== null);

  const statement = (
    <>
      {prereqs.length > 0 ? (
        <Card className="mb-8 border-blue-500/20 bg-blue-500/5">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BookOpen className="h-4 w-4" /> Antes de começares
            </CardTitle>
            <CardDescription>
              Estes conceitos vão tornar a leitura das soluções muito mais fácil.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {prereqs.map((c) => (
              <Link key={c.slug} href={`/concepts/${c.slug}`}>
                <Badge variant="secondary" className="hover:bg-blue-500/10 cursor-pointer">
                  {c.title}
                </Badge>
              </Link>
            ))}
          </CardContent>
        </Card>
      ) : null}

      <MermaidRenderer containerId={`problem-statement-${slug}`} />
      <article
        id={`problem-statement-${slug}`}
        className="prose prose-zinc dark:prose-invert max-w-none mb-10
                   prose-h2:text-xl prose-h2:font-semibold prose-h2:tracking-tight
                   prose-code:text-blue-600 dark:prose-code:text-blue-400
                   prose-code:before:content-none prose-code:after:content-none"
      />

      {problem.meta.examples.length > 0 ? (
        <section className="mb-10">
          <h2 className="text-xl font-semibold tracking-tight mb-4">Exemplos</h2>
          <div className="space-y-3">
            {problem.meta.examples.map((ex, i) => (
              <Card key={i}>
                <CardContent className="p-4 grid sm:grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
                  <span className="text-zinc-500 font-medium">Input</span>
                  <code className="font-mono text-blue-600 dark:text-blue-400">{ex.input}</code>
                  <span className="text-zinc-500 font-medium">Output</span>
                  <code className="font-mono text-emerald-600 dark:text-emerald-400">{ex.output}</code>
                  {ex.explanation ? (
                    <>
                      <span className="text-zinc-500 font-medium">Nota</span>
                      <span className="text-zinc-600 dark:text-zinc-400">{ex.explanation}</span>
                    </>
                  ) : null}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      ) : null}

      {problem.meta.constraints.length > 0 ? (
        <section>
          <h2 className="text-xl font-semibold tracking-tight mb-3">Restrições</h2>
          <ul className="space-y-1.5 text-sm text-zinc-600 dark:text-zinc-400">
            {problem.meta.constraints.map((c, i) => (
              <li key={i} className="font-mono">
                • {c}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </>
  );

  const strategies = (
    <section>
      <h2 className="text-xl font-semibold tracking-tight mb-2">Escolhe uma estratégia</h2>
      <p className="text-zinc-600 dark:text-zinc-400 mb-6 text-sm">
        Recomendamos começar pela <span className="font-medium">Brute-force</span> para construires intuição, e
        depois passar pela solução <span className="font-medium">mais eficiente</span> para veres o ganho real.
      </p>

      <div className="grid sm:grid-cols-2 gap-4">
        {problem.solutions.map((s) => (
          <Link key={s.meta.slug} href={`/problems/${problem.meta.slug}/${s.meta.slug}`} className="group">
            <Card className="h-full transition-shadow group-hover:shadow-md group-hover:border-blue-500/40">
              <CardHeader>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant={s.meta.kind === 'optimal' ? 'default' : s.meta.kind === 'brute-force' ? 'secondary' : 'outline'}>
                    {s.meta.kind === 'brute-force' ? 'Brute-force' : s.meta.kind === 'optimal' ? 'Óptima' : 'Alternativa'}
                  </Badge>
                </div>
                <CardTitle className="text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {s.meta.name}
                </CardTitle>
                <CardDescription className="flex flex-wrap gap-2 mt-2">
                  <ComplexityBadge label={s.meta.complexity.time} kind="time" />
                  <ComplexityBadge label={s.meta.complexity.space} kind="space" />
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3">{firstParagraph(s.introHtml)}</p>
                <div className="mt-4 inline-flex items-center text-sm text-blue-600 dark:text-blue-400">
                  Abrir player <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );

  return (
    <RequireAuth>
      <div className="mx-auto max-w-7xl px-6 py-12">
        <JsonLdScript
        data={learningResourceJsonLd({
          name: problem.meta.title,
          description: stripHtmlLoose(problem.descriptionHtml) || problem.meta.title,
          pathname: `/problems/${slug}`,
        })}
      />
      <ProblemVisitTracker slug={slug} />

      <Button asChild variant="outline" size="sm" className="mb-6 rounded-none gap-2 text-xs font-bold uppercase tracking-wide">
        <Link href="/problems"><ArrowLeft className="h-3.5 w-3.5" /> Todos os problemas</Link>
      </Button>

      <div className="flex items-center gap-2 flex-wrap mb-3">
        <DifficultyBadge difficulty={problem.meta.difficulty} />
        {problem.meta.categories.map((c) => (
          <Badge key={c} variant="outline" className="capitalize">
            {c.replace('-', ' ')}
          </Badge>
        ))}
      </div>

      <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-6">{problem.meta.title}</h1>

      <Separator className="mb-10" />

      {strategiesLocked ? (
        <div className="py-12 border-y border-dashed border-zinc-200 dark:border-zinc-800 my-10 bg-zinc-50/50 dark:bg-zinc-900/20">
          <UpgradePrompt
            context="Conteúdo e Soluções Pro"
            problemSlug={slug}
            hideLogin={!!session}
          />
        </div>
      ) : (
        <>
          <DailyChallengeTabVisit tab="statement" />
          <ProblemStudyTabs
            statement={statement}
            strategies={strategies}
          />
        </>
      )}

      <ProblemStudyCompletionBar problemSlug={slug} solutionCount={problem.solutions.length} />

      <ContentNavigation
        sectionLabel="Navegar problemas"
        prev={adjacent.prev ? { slug: adjacent.prev.slug, title: adjacent.prev.title, href: `/problems/${adjacent.prev.slug}` } : null}
        next={adjacent.next ? { slug: adjacent.next.slug, title: adjacent.next.title, href: `/problems/${adjacent.next.slug}` } : null}
      />
    </div>
    </RequireAuth>
  );
}

function firstParagraph(html: string): string {
  const plain = stripHtmlLoose(html);
  return plain.length > 200 ? `${plain.slice(0, 200)}…` : plain;
}

export const dynamicParams = false;
