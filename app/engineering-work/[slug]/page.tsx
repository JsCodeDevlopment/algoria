import { ArrowLeft, Clock } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { RequireAuth } from "@/components/auth/require-auth";
import { UpgradePrompt } from "@/components/billing/upgrade-prompt";
import { AuthorInfo } from "@/components/engenharia-trabalho/author-info";
import { EngineeringGuideArticle } from "@/components/engenharia-trabalho/engineering-guide-article";
import { ContentNavigation } from "@/components/layout/content-navigation";
import { JsonLdScript } from "@/components/seo/json-ld";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { userHasPro } from "@/lib/billing/entitlements";
import { isContentUnlockedForUser } from "@/lib/billing/tiering";
import {
  getAdjacentEngineeringWork,
  getAllEngineeringWorkSlugs,
  getEngineeringWorkGuide,
} from "@/lib/content/loader";
import type { EngineeringWorkPillar } from "@/lib/content/schemas";
import { db } from "@/lib/db";
import { user } from "@/lib/db/schema";
import { buildPublicMetadata } from "@/lib/seo/build-metadata";
import { articleJsonLd } from "@/lib/seo/structured-data";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

interface Params {
  slug: string;
}

const PILLAR_LABEL: Record<EngineeringWorkPillar, string> = {
  frontend: "Frontend e produto",
  backend: "Backend e APIs",
  devops: "DevOps e sistema",
  softskills: "Carreira e Soft Skills",
  ia: "Inteligência Artificial",
};

export async function generateStaticParams(): Promise<Params[]> {
  const slugs = await getAllEngineeringWorkSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = await getEngineeringWorkGuide(slug);
  if (!guide) return {};
  const pillar = PILLAR_LABEL[guide.meta.pillar];
  return buildPublicMetadata({
    title: `${guide.meta.title} · Engenharia no trabalho`,
    description: guide.meta.summary,
    pathname: `/engineering-work/${slug}`,
    keywords: [
      guide.meta.title,
      pillar,
      "engenharia software",
      "boas práticas produção",
      "Acite guia",
    ],
    image: guide.meta.image,
    openGraphType: "article",
  });
}

export default async function EngineeringWorkGuidePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const guide = await getEngineeringWorkGuide(slug);
  if (!guide) notFound();

  const session = await auth.api.getSession({ headers: await headers() });
  const hasPro = await userHasPro(session?.user?.id);
  const isLocked = !isContentUnlockedForUser(guide.meta.access || 'pro', hasPro);

  const adjacent = await getAdjacentEngineeringWork(slug);

  let authorData = null;
  try {
    authorData = (await db.query.user.findFirst({
      where: eq(user.name, "Jonatas Silva"),
    })) ?? null;
  } catch {
    console.warn("Could not fetch author data from DB during build. Using fallback.");
  }

  return (
    <RequireAuth>
      <div className="mx-auto max-w-7xl px-6 py-12">
        <JsonLdScript
        data={articleJsonLd({
          headline: guide.meta.title,
          description: guide.meta.summary,
          pathname: `/engineering-work/${slug}`,
        })}
      />
      <Button
        asChild
        variant="outline"
        size="sm"
        className="mb-6 rounded-none gap-2 text-xs font-bold uppercase tracking-wide"
      >
        <Link href="/engineering-work">
          <ArrowLeft className="h-3.5 w-3.5" /> Engenharia no trabalho
        </Link>
      </Button>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Badge variant="outline" className="rounded-none text-[10px] uppercase">
          {PILLAR_LABEL[guide.meta.pillar]}
        </Badge>
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" aria-hidden /> ~
          {guide.meta.estimatedMinutes} min
        </span>
      </div>

      <h1 className="mb-3 text-3xl font-semibold tracking-tight md:text-4xl">
        {guide.meta.title}
      </h1>
      <p className="mb-4 text-lg leading-relaxed text-muted-foreground">
        {guide.meta.summary}
      </p>

      <AuthorInfo
        name="Jonatas Silva"
        role="Senior Fullstack Software Engineer"
        image={authorData?.image || "/author-jonatas.png"}
        href={authorData ? `/user/${authorData.id}` : "#"}
      />

      {isLocked ? (
        <div className="py-12 border-y border-dashed border-zinc-200 dark:border-zinc-800 my-10 bg-zinc-50/50 dark:bg-zinc-900/20">
          <UpgradePrompt hideLogin={!!session} />
        </div>
      ) : (
        <EngineeringGuideArticle html={guide.bodyHtml} />
      )}

      <ContentNavigation
        sectionLabel="Mais guias de engenharia"
        prev={
          adjacent.prev
            ? {
                slug: adjacent.prev.slug,
                title: adjacent.prev.title,
                href: `/engineering-work/${adjacent.prev.slug}`,
              }
            : null
        }
        next={
          adjacent.next
            ? {
                slug: adjacent.next.slug,
                title: adjacent.next.title,
                href: `/engineering-work/${adjacent.next.slug}`,
              }
            : null
        }
      />
    </div>
    </RequireAuth>
  );
}

export const dynamicParams = true;
