import { and, desc, eq } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import type {
  Experience,
  Project,
} from "@/components/profile/profile-sections";
import { ExperienceSection } from "@/components/profile/public/experience-section";
import { ProfileDashboard } from "@/components/profile/public/profile-dashboard";
import { ProfileHeader } from "@/components/profile/public/profile-header";
import { ProjectsSection } from "@/components/profile/public/projects-section";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { user, userProfile, userProgress, technicalAssessmentResults } from "@/lib/db/schema";
import {
  calculateTotalExperienceMonths,
  formatExperienceString,
  processUserProgress,
} from "@/lib/profile/profile-utils";
import { buildPublicMetadata } from "@/lib/seo/build-metadata";
import { AssessmentCard } from "@/components/profile/public/assessment-card";


interface PublicProfileProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PublicProfileProps) {
  const { id } = await params;
  const userData = await db.select().from(user).where(eq(user.id, id)).limit(1);

  if (!userData[0]) {
    return buildPublicMetadata({
      title: "Perfil não encontrado",
      description: "Perfil de utilizador não encontrado.",
      pathname: `/user/${id}`,
    });
  }

  return buildPublicMetadata({
    title: `${userData[0].name} | Perfil Algoria`,
    description: `Vê o perfil público, tecnologias e progresso de ${userData[0].name} na Algoria.`,
    pathname: `/user/${id}`,
  });
}

export default async function PublicProfilePage({
  params,
}: PublicProfileProps) {
  const { id } = await params;

  const [userRows, profileRows, progressRows, assessmentRows] = await Promise.all([
    db.select().from(user).where(eq(user.id, id)).limit(1),
    db.select().from(userProfile).where(eq(userProfile.userId, id)).limit(1),
    db.select().from(userProgress).where(eq(userProgress.userId, id)).limit(1),
    db.select().from(technicalAssessmentResults).where(
      and(
        eq(technicalAssessmentResults.userId, id),
        eq(technicalAssessmentResults.isPublic, true)
      )
    ).orderBy(desc(technicalAssessmentResults.completedAt)),
  ]);


  const userData = userRows[0];
  if (!userData) {
    notFound();
  }

  const profile = profileRows[0];
  const experiences = profile?.experiences
    ? (JSON.parse(profile.experiences as string) as Experience[])
    : [];
  const externalProjects = profile?.projects
    ? (JSON.parse(profile.projects as string) as Project[])
    : [];

  const { completedProblems, solutionsOpened } = processUserProgress(
    progressRows[0]?.data || null,
  );

  const totalMonths = calculateTotalExperienceMonths(experiences);
  const experienceString =
    totalMonths > 0 ? formatExperienceString(totalMonths) : "";

  const initials =
    userData.name?.substring(0, 2).toUpperCase() ||
    userData.email?.substring(0, 2).toUpperCase() ||
    "U";

  return (
    <div className="relative flex-1 bg-grid-pattern pb-20">
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden
      >
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute right-0 top-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-12">
        <Button
          asChild
          variant="outline"
          size="sm"
          className="mb-10 rounded-none gap-2 text-xs font-bold uppercase tracking-wide"
        >
          <Link href="/">
            <ArrowLeft className="h-3.5 w-3.5" /> Início
          </Link>
        </Button>

        <ProfileHeader
          name={userData.name}
          image={userData.image}
          headline={profile?.headline || null}
          bio={profile?.bio || null}
          experienceString={experienceString}
          memberSince={new Date(userData.createdAt).getFullYear()}
          githubUrl={profile?.githubUrl || null}
          linkedinUrl={profile?.linkedinUrl || null}
          initials={initials}
        />

        <ProfileDashboard
          technologies={(profile?.technologies as string[]) || []}
          completedProblems={completedProblems}
          solutionsOpened={solutionsOpened}
        />

        <ExperienceSection experiences={experiences} />

        <ProjectsSection projects={externalProjects} />

        {assessmentRows.length > 0 && (
          <section className="mt-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-6 w-2 bg-primary" />
              <h2 className="text-2xl font-black uppercase tracking-widest">Avaliações Técnicas</h2>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              {assessmentRows.map((result) => (
                <AssessmentCard
                  key={result.id}
                  testSlug={result.testSlug}
                  testTitle={result.testTitle}
                  track={result.track}
                  level={result.level}
                  language={result.language}
                  quizScore={result.quizScore}
                  totalQuestions={result.totalQuestions}
                  codePassed={result.codePassed}
                  resolutionCode={result.resolutionCode}
                  explanation={result.explanation}
                  completedAt={result.completedAt.toISOString()}
                />


              ))}
            </div>

          </section>
        )}
      </div>

    </div>
  );
}
