import { eq } from "drizzle-orm";
import { ArrowLeft, Trash2, User } from "lucide-react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import { EditProfileForm } from "@/components/profile/edit-profile-form";

import { DeleteAccountForm } from "@/components/auth/delete-account-form";
import { BecomeCreatorButton } from "@/components/profile/become-creator-button";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  subscription,
  technicalAssessmentResults,
  userProfile,
  userProgress,
} from "@/lib/db/schema";
import { desc } from "drizzle-orm";

import { ProfileActionsClient } from "@/components/profile/profile-actions-client";
import { ProfileAssessmentVisibilityToggle } from "@/components/profile/profile-assessment-visibility-toggle";
import { AssessmentCard } from "@/components/profile/public/assessment-card";
import { ProgressBlobSchema } from "@/lib/progress/local-progress-schema";
import { buildPublicMetadata } from "@/lib/seo/build-metadata";
import Image from "next/image";

export async function generateMetadata(): Promise<Metadata> {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;

  return buildPublicMetadata({
    title: "Meu Perfil",
    description:
      "Gerencia o teu perfil, progresso de estudo e subscrições na Algoria.",
    pathname: "/profile",
    image: user?.image || undefined,
    imageIsSquare: !!user?.image,
  });
}

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    redirect("/auth/sign-in");
  }

  const { user } = session;

  // Buscar progressos, subscrição e dados do user (role/status pedido)
  const [progressRows, subRows, profileRows, assessmentRows, dbUserRows] =
    await Promise.all([
      db
        .select()
        .from(userProgress)
        .where(eq(userProgress.userId, user.id))
        .limit(1),
      db
        .select()
        .from(subscription)
        .where(eq(subscription.userId, user.id))
        .limit(1),
      db
        .select()
        .from(userProfile)
        .where(eq(userProfile.userId, user.id))
        .limit(1),
      db
        .select()
        .from(technicalAssessmentResults)
        .where(eq(technicalAssessmentResults.userId, user.id))
        .orderBy(desc(technicalAssessmentResults.completedAt)),
      db
        .select({ 
          role: user.role, 
          creatorRequestStatus: user.creatorRequestStatus 
        })
        .from(user)
        .where(eq(user.id, session.user.id))
        .limit(1),
    ]);

  const dbUser = dbUserRows[0];
  const activeSub = subRows[0];
  const isPro = activeSub?.status === "active";

  // Processar o progresso
  let completedProblems = 0;
  let inProgressProblems = 0;
  let solutionsOpened = 0;

  if (progressRows[0]) {
    try {
      const data = JSON.parse(progressRows[0].data);
      const blob = ProgressBlobSchema.parse(data);
      const problems = Object.values(blob.problems);

      completedProblems = problems.filter((p) => !!p.markedCompleteAt).length;
      inProgressProblems = problems.filter((p) => !p.markedCompleteAt).length;
      solutionsOpened = problems.reduce(
        (acc, p) => acc + (p.openedSolutions?.length || 0),
        0,
      );
    } catch {
      // Ignorar erros de parse se houver
    }
  }

  const initials =
    user.name?.substring(0, 2).toUpperCase() ||
    user.email?.substring(0, 2).toUpperCase() ||
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

        <header className="mb-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 border-b-2 border-border pb-12">
          <div className="flex items-center gap-8">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary/50 opacity-25 group-hover:opacity-50 transition duration-500 blur" />
              <div className="relative flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden border-4 border-primary bg-background text-4xl font-black text-primary shadow-[8px_8px_0_0_rgba(var(--primary-rgb),0.2)]">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name}
                    width={128}
                    height={128}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  initials
                )}
              </div>
            </div>
            <div className="space-y-3">
              <h1 className="text-5xl font-black tracking-tighter uppercase leading-none">
                {user.name}
              </h1>
              <div className="flex items-center gap-4 text-muted-foreground">
                <span className="font-mono text-xs uppercase tracking-widest">
                  {user.email}
                </span>
                <span className="h-1 w-1 rounded-full bg-border" />
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  Desde {new Date(user.createdAt).getFullYear()}
                </span>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <Badge
                  variant={isPro ? "default" : "secondary"}
                  className="rounded-none uppercase font-black tracking-[0.2em] px-4 py-1 text-[9px]"
                >
                  {isPro ? "ALGORIA PRO" : "ALGORIA FREE"}
                </Badge>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="h-7 rounded-none text-[9px] uppercase font-black tracking-widest border-primary/20"
                >
                  <Link href={`/user/${user.id}`}>
                    Visualizar Perfil Público
                  </Link>
                </Button>
                <ProfileActionsClient userId={user.id} />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 w-full md:w-auto">
            <SignOutButton />
            {dbUser?.role === 'USER' && (
              <BecomeCreatorButton status={dbUser.creatorRequestStatus} />
            )}
            <form action="/api/customer-portal" method="POST">
              <Button
                type="submit"
                variant="outline"
                className="w-full rounded-none font-black uppercase tracking-widest text-[10px] border-2 border-border h-12"
              >
                Gerir Assinatura
              </Button>
            </form>
          </div>
        </header>

        {/* METRICS DASHBOARD */}
        <section className="mb-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="border-2 border-border p-6 bg-muted/5 flex flex-col gap-1">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">
              Problemas Resolvidos
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black tabular-nums">
                {completedProblems}
              </span>
              <span className="text-[10px] font-bold text-primary uppercase">
                Unidades
              </span>
            </div>
            <div className="mt-2 h-1 w-full bg-border">
              <div
                className="h-full bg-primary"
                style={{
                  width: `${Math.min((completedProblems / 100) * 100, 100)}%`,
                }}
              />
            </div>
          </div>
          <div className="border-2 border-border p-6 bg-muted/5 flex flex-col gap-1">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">
              Em Progresso
            </span>
            <span className="text-4xl font-black tabular-nums text-primary/70">
              {inProgressProblems}
            </span>
            <div className="mt-2 flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 ${i < inProgressProblems ? "bg-primary/40" : "bg-border"}`}
                />
              ))}
            </div>
          </div>
          <div className="border-2 border-border p-6 bg-muted/5 flex flex-col gap-1">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">
              Soluções Lidas
            </span>
            <span className="text-4xl font-black tabular-nums text-muted-foreground/60">
              {solutionsOpened}
            </span>
            <span className="text-[9px] font-medium text-muted-foreground uppercase">
              Insights de Engenharia
            </span>
          </div>
          <div className="border-2 border-border p-6 bg-primary/5 flex flex-col justify-between border-primary/20">
            <div>
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">
                Plano Atual
              </span>
              <p className="font-black uppercase tracking-tight text-xl">
                {isPro ? "PRO ACCESS" : "FREE TIER"}
              </p>
            </div>
            <Link
              href="/pricing"
              className="text-[9px] font-black uppercase tracking-widest text-primary hover:underline underline-offset-4"
            >
              {isPro ? "Ver Benefícios" : "Upgrade para Pro →"}
            </Link>
          </div>
        </section>

        {/* TECHNICAL ASSESSMENTS SECTION */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-6 w-2 bg-primary" />
            <h2 className="text-xl font-black uppercase tracking-widest">
              Resultados de Assessments
            </h2>
          </div>

          {assessmentRows.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {assessmentRows.map((result) => (
                <div
                  key={result.id}
                  className="border-2 border-border bg-background p-6 relative group overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-2">
                      <ProfileAssessmentVisibilityToggle
                        testSlug={result.testSlug}
                        initialIsPublic={result.isPublic}
                      />
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border/50">
                    <AssessmentCard
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
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="border-2 border-dashed border-border p-12 text-center">
              <p className="text-sm font-medium text-muted-foreground mb-4">
                Ainda não completaste nenhum assessment técnico.
              </p>
              <Button
                asChild
                variant="outline"
                className="rounded-none font-black uppercase tracking-widest text-[10px]"
              >
                <Link href="/tests">Explorar Simulados</Link>
              </Button>
            </div>
          )}
        </section>

        {/* MAIN PROFILE FORM */}

        <div className="space-y-12">
          <Card className="border-2 border-border bg-background/60 backdrop-blur-sm overflow-hidden rounded-none shadow-[12px_12px_0_0_rgba(0,0,0,0.05)]">
            <CardHeader className="border-b-2 border-border bg-muted/30 p-8">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-primary flex items-center justify-center text-white">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-xl font-black uppercase tracking-tighter">
                    Personalizar Perfil Profissional
                  </CardTitle>
                  <CardDescription className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mt-1">
                    Este formulário controla como o mundo te vê na Algoria.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <EditProfileForm profile={profileRows ? profileRows[0] : null} />
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-2 border-destructive/20 bg-destructive/5 shadow-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm uppercase tracking-widest text-destructive flex items-center gap-2">
                <Trash2 className="h-4 w-4" /> Danger Zone
              </CardTitle>
              <CardDescription className="text-destructive/80">
                Ações irreversiveis sobre a tua conta.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-t border-destructive/10">
              <div>
                <h4 className="font-bold text-foreground">Excluir Conta</h4>
                <p className="text-sm text-muted-foreground mt-1 max-w-xl">
                  Ao excluir a conta, o teu progresso, subscrição ativa e acesso
                  serão perdidos permanentemente. Esta ação não pode ser
                  desfeita.
                </p>
              </div>
              <DeleteAccountForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
