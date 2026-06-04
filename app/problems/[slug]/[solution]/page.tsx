import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { RequireAuth } from "@/components/auth/require-auth";
import { UpgradePrompt } from "@/components/billing/upgrade-prompt";
import { DifficultyBadge } from "@/components/catalog/difficulty-badge";
import { DynamicPlayerWrapper } from "@/components/code-player/dynamic-player-wrapper";
import { ComplexityBadge } from "@/components/complexity/complexity-badge";
import { DailyChallengeTabVisit } from "@/components/gamification/daily-challenge-tab-visit";
import { JsonLdScript } from "@/components/seo/json-ld";
import { MarkdownArticle } from "@/components/markdown/markdown-article";
import { SolutionLanguageSelect } from "@/components/solution/solution-language-select";
import { SolutionVisitTracker } from "@/components/solution/solution-visit-tracker";
import { MermaidRenderer } from "@/components/markdown/mermaid-renderer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { auth } from "@/lib/auth";
import { userHasPro } from "@/lib/billing/entitlements";
import {
  getProblemAccess,
  isProblemUnlockedForUser,
} from "@/lib/billing/tiering";
import {
  LANGUAGE_LABEL_PT,
  LANGUAGE_ORDER_FOR_UI,
  LANGUAGE_READ_ONLY_PANEL_MD,
  isLineSyncLanguage,
  normalizeLanguage,
} from "@/lib/content/language";
import { getAllProblems, getConcept, getProblem } from "@/lib/content/loader";
import type { Language } from "@/lib/content/schemas";
import { highlightToLines } from "@/lib/content/shiki";
import {
  buildPublicMetadata,
  truncateMetaDescription,
} from "@/lib/seo/build-metadata";
import { stripHtmlLoose } from "@/lib/seo/strip-html";
import { learningResourceJsonLd } from "@/lib/seo/structured-data";

interface Params {
  slug: string;
  solution: string;
}

export async function generateStaticParams(): Promise<Params[]> {
  const problems = await getAllProblems();
  return problems.flatMap((p) =>
    p.solutions.map((s) => ({ slug: p.meta.slug, solution: s.meta.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug, solution } = await params;
  const problem = await getProblem(slug);
  const sol = problem?.solutions.find((s) => s.meta.slug === solution);
  if (!problem || !sol) return {};
  const intro = stripHtmlLoose(sol.introHtml);
  const pitch =
    intro.length > 0
      ? intro
      : `Solução ${sol.meta.kind === "brute-force" ? "brute-force" : sol.meta.kind === "optimal" ? "ótima" : "alternativa"} de «${problem.meta.title}»: ${sol.meta.complexity.time} tempo, ${sol.meta.complexity.space} espaço — código com explicação linha-a-linha.`;
  const description = truncateMetaDescription(pitch);
  const kindPt =
    sol.meta.kind === "brute-force"
      ? "brute-force"
      : sol.meta.kind === "optimal"
        ? "solução ótima"
        : "alternativa";
  return buildPublicMetadata({
    title: `${problem.meta.title} · ${sol.meta.name}`,
    description,
    pathname: `/problems/${slug}/${solution}`,
    keywords: [
      problem.meta.title,
      sol.meta.name,
      kindPt,
      ...problem.meta.categories.map((c) => c.replace(/-/g, " ")),
      ...problem.meta.tags,
      "complexidade algorítmica",
      "code walkthrough",
    ],
    openGraphType: "article",
  });
}

export default async function SolutionPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams?: Promise<{ lang?: string }>;
}) {
  const { slug, solution: solutionSlug } = await params;
  const qs = (await searchParams) ?? {};

  const problem = await getProblem(slug);
  if (!problem) notFound();
  const solution = problem.solutions.find((s) => s.meta.slug === solutionSlug);
  if (!solution) notFound();

  const session = await auth.api.getSession({ headers: await headers() });
  const hasPro = await userHasPro(session?.user?.id);
  const access = getProblemAccess(problem.meta);
  const unlocked = isProblemUnlockedForUser(access, hasPro);

  const availableLanguages = LANGUAGE_ORDER_FOR_UI.filter((l) =>
    Boolean(solution.codeByLanguage[l]?.trim()),
  ) as Language[];
  const canonical = solution.meta.language;
  const fallback =
    (availableLanguages.includes(canonical as Language)
      ? canonical
      : availableLanguages[0]) ?? "typescript";

  const requested = normalizeLanguage(qs.lang);
  const resolvedLang: Language =
    requested && solution.codeByLanguage[requested]
      ? requested
      : (fallback as Language);

  const code = solution.codeByLanguage[resolvedLang];
  if (code === undefined || code === null) notFound();

  const lineSynced = isLineSyncLanguage(resolvedLang);
  const playerAnnotations = lineSynced ? solution.annotations : [];
  const readOnlyExplanationMd = lineSynced
    ? undefined
    : LANGUAGE_READ_ONLY_PANEL_MD;

  const lines = await highlightToLines(code, resolvedLang);

  const conceptSlugs = Array.from(
    new Set(solution.annotations.flatMap((a) => a.concepts ?? [])),
  );
  const conceptTitles: Record<string, string> = {};
  for (const cs of conceptSlugs) {
    const c = await getConcept(cs);
    if (c) conceptTitles[cs] = c.meta.title;
  }

  const otherSolutions = problem.solutions.filter(
    (s) => s.meta.slug !== solutionSlug,
  );

  const introPlain = stripHtmlLoose(solution.introHtml).trim();
  const jsonLdDescription =
    introPlain ||
    `Solução com explicação linha-a-linha para «${problem.meta.title}» (${solution.meta.name}). Complexidade ${solution.meta.complexity.time} tempo, ${solution.meta.complexity.space} espaço.`;

  if (!unlocked) {
    return (
      <RequireAuth>
        <div className="mx-auto max-w-7xl px-6 py-16">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="mb-8 rounded-none gap-2 text-xs font-bold uppercase tracking-wide"
          >
            <Link href={`/problems/${problem.meta.slug}`}>
              <ArrowLeft className="h-3.5 w-3.5" /> {problem.meta.title}
            </Link>
          </Button>
          <UpgradePrompt
            context="Player e soluções Pro"
            problemSlug={problem.meta.slug}
            hideLogin={!!session}
          />
        </div>
      </RequireAuth>
    );
  }

  return (
    <RequireAuth>
      <DailyChallengeTabVisit tab={`solution:${solutionSlug}`} />
      <div className="mx-auto max-w-7xl px-6 py-8">
      <JsonLdScript
        data={learningResourceJsonLd({
          name: `${problem.meta.title}: ${solution.meta.name}`,
          description: jsonLdDescription,
          pathname: `/problems/${problem.meta.slug}/${solutionSlug}`,
        })}
      />
      <SolutionVisitTracker
        problemSlug={problem.meta.slug}
        solutionSlug={solutionSlug}
      />

      <Button
        asChild
        variant="outline"
        size="sm"
        className="mb-4 rounded-none gap-2 text-xs font-bold uppercase tracking-wide"
      >
        <Link href={`/problems/${problem.meta.slug}`}>
          <ArrowLeft className="h-3.5 w-3.5" /> {problem.meta.title}
        </Link>
      </Button>

      <div className="flex items-baseline gap-3 flex-wrap mb-2">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
          {solution.meta.name}
        </h1>
        <DifficultyBadge difficulty={problem.meta.difficulty} />
      </div>
      <div className="flex items-center gap-2 flex-wrap mb-6">
        <Badge
          variant={solution.meta.kind === "optimal" ? "default" : "secondary"}
          className="capitalize"
        >
          {solution.meta.kind === "brute-force"
            ? "Brute-force"
            : solution.meta.kind === "optimal"
              ? "Óptima"
              : "Alternativa"}
        </Badge>
        <ComplexityBadge label={solution.meta.complexity.time} kind="time" />
        <ComplexityBadge label={solution.meta.complexity.space} kind="space" />
        <Suspense
          fallback={
            <span className="text-xs text-zinc-500 tabular-nums">
              {LANGUAGE_LABEL_PT[resolvedLang]}
            </span>
          }
        >
          <SolutionLanguageSelect
            available={availableLanguages}
            value={resolvedLang}
          />
        </Suspense>
        <span className="text-xs text-zinc-500">
          · explicações curadas em {LANGUAGE_LABEL_PT[canonical as Language]}
        </span>
      </div>

      {solution.introHtml ? (
        <>
          <MermaidRenderer containerId={`solution-intro-${solutionSlug}`} />
          <article
            id={`solution-intro-${solutionSlug}`}
            className="prose prose-zinc dark:prose-invert max-w-3xl mb-8
                       prose-h2:text-lg prose-h2:font-semibold prose-h2:tracking-tight
                       prose-code:text-blue-600 dark:prose-code:text-blue-400
                       prose-code:before:content-none prose-code:after:content-none"
            dangerouslySetInnerHTML={{ __html: solution.introHtml }}
          />
        </>
      ) : null}

      <DynamicPlayerWrapper
        lines={lines}
        annotations={playerAnnotations}
        conceptTitles={conceptTitles}
        readOnlyExplanationMd={readOnlyExplanationMd}
        executionTrace={lineSynced ? (solution.executionTrace ?? []) : []}
        problemSlug={problem.meta.slug}
        solutionSlug={solutionSlug}
        simulatorCode={solution.meta.simulatorCode}
        examples={problem.meta.examples}
      />

      <Separator className="my-10" />

      <section className="grid md:grid-cols-2 gap-4">
        <Card className="bg-zinc-50 dark:bg-zinc-900/50">
          <CardHeader>
            <CardTitle className="text-lg">Análise de complexidade</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <ComplexityBadge
                  label={solution.meta.complexity.time}
                  kind="time"
                />
              </div>
              <div
                className="prose prose-sm dark:prose-invert prose-code:text-blue-600 dark:prose-code:text-blue-400 prose-code:before:content-none prose-code:after:content-none"
                dangerouslySetInnerHTML={{
                  __html: renderInline(solution.meta.complexity.rationale),
                }}
              />
            </div>
          </CardContent>
        </Card>

        {otherSolutions.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Compara com outras soluções
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {otherSolutions.map((s) => (
                <Link
                  key={s.meta.slug}
                  href={`/problems/${problem.meta.slug}/${s.meta.slug}`}
                  className="flex items-center justify-between p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-blue-500/40 transition-colors"
                >
                  <div>
                    <div className="font-medium">{s.meta.name}</div>
                    <div className="flex gap-1.5 mt-1">
                      <ComplexityBadge
                        label={s.meta.complexity.time}
                        kind="time"
                        className="text-[10px]"
                      />
                      <ComplexityBadge
                        label={s.meta.complexity.space}
                        kind="space"
                        className="text-[10px]"
                      />
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-zinc-400" />
                </Link>
              ))}
            </CardContent>
          </Card>
        ) : null}
      </section>

      <div className="mt-10 flex justify-between items-center">
        <Button asChild variant="outline">
          <Link href={`/problems/${problem.meta.slug}`}>
            <ArrowLeft className="h-3.5 w-3.5" /> Voltar ao problema
          </Link>
        </Button>
      </div>
    </div>
    </RequireAuth>
  );
}

function renderInline(text: string): string {
  // Tiny inline markdown: backticks for code only.
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
}

export const dynamicParams = false;
