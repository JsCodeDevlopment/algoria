import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { UpgradePrompt } from "@/components/billing/upgrade-prompt";
import { TestClient } from "@/components/tests/test-client";
import { auth } from "@/lib/auth";
import { userHasPro } from "@/lib/billing/entitlements";
import { isContentUnlockedForUser } from "@/lib/billing/tiering";
import { getContentRepository } from "@/lib/content/content-repository";
import { buildPublicMetadata } from "@/lib/seo/build-metadata";
import { headers } from "next/headers";

interface Params {
  track: string;
  slug: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const test = await getContentRepository().getTechnicalTest(slug);

  if (!test) return {};

  return buildPublicMetadata({
    title: `${test.title} · Testes Técnicos`,
    description: test.description,
    pathname: `/tests/run/${slug}`,
  });
}

export default async function TestExecutionPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;

  const test = await getContentRepository().getTechnicalTest(slug);

  if (!test) {
    notFound();
  }

  const session = await auth.api.getSession({ headers: await headers() });
  const hasPro = await userHasPro(session?.user?.id);
  const isLocked = !isContentUnlockedForUser(test.access, hasPro);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6">
      {isLocked ? (
        <UpgradePrompt hideLogin={!!session} />
      ) : (
        <TestClient test={test} />
      )}
    </div>
  );
}
