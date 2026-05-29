import { headers } from "next/headers";
import { notFound } from "next/navigation";

import { DailyChallengeTracker } from "@/components/gamification/daily-challenge-tracker";
import { auth } from "@/lib/auth";
import { userHasPro } from "@/lib/billing/entitlements";
import { isContentUnlockedForUser } from "@/lib/billing/tiering";
import { getProblem } from "@/lib/content/loader";

interface ProblemLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export default async function ProblemLayout({ children, params }: ProblemLayoutProps) {
  const { slug } = await params;
  const problem = await getProblem(slug);

  if (!problem) {
    return <>{children}</>;
  }

  const session = await auth.api.getSession({ headers: await headers() });
  const hasPro = await userHasPro(session?.user?.id);
  const isAccessible = isContentUnlockedForUser(problem.meta.access || 'pro', hasPro);
  
  const solutionSlugs = problem.solutions.map((s) => s.meta.slug);

  return (
    <>
      <DailyChallengeTracker 
        problemSlug={slug} 
        isAccessible={isAccessible} 
        solutionSlugs={solutionSlugs} 
      />
      {children}
    </>
  );
}
