import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { TestClient } from "@/components/tests/test-client";
import { getTestBySlug } from "@/lib/content/tests-data";
import { buildPublicMetadata } from "@/lib/seo/build-metadata";

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
  const test = getTestBySlug(slug);
  
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
  
  const test = getTestBySlug(slug);

  if (!test) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TestClient test={test} />
    </div>
  );
}
