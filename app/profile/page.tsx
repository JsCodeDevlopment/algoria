import { eq } from "drizzle-orm";
import { ArrowLeft, BookOpen, Code2, Trash2, User } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import { EditProfileForm } from "@/components/profile/edit-profile-form";

import { DeleteAccountForm } from "@/components/auth/delete-account-form";
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
import { subscription, userProgress, userProfile } from "@/lib/db/schema";
import { ProgressBlobSchema } from "@/lib/progress/local-progress-schema";
import { buildPublicMetadata } from "@/lib/seo/build-metadata";
import Image from "next/image";

export const metadata = buildPublicMetadata({
  title: "Meu Perfil",
  description:
    "Gerencia o teu perfil, progresso de estudo e subscrições na Algoria.",
  pathname: "/profile",
});

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    redirect("/auth/sign-in");
  }

  const { user } = session;

  // Buscar progressos e subscrição
  const [progressRows, subRows, profileRows] = await Promise.all([
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
  ]);

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

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-12">
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

        <header className="mb-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-none border-4 border-background bg-primary/10 text-3xl font-black text-primary shadow-xl">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name}
                  width={24}
                  height={24}
                  className="h-full w-full object-cover"
                />
              ) : (
                initials
              )}
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tighter uppercase">
                {user.name}
              </h1>
              <p className="mt-1 font-mono text-sm text-muted-foreground">
                {user.email}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <Badge
                  variant={isPro ? "default" : "secondary"}
                  className="uppercase font-bold tracking-widest text-[10px]"
                >
                  {isPro ? "Plano Pro" : "Plano Free"}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Membro desde{" "}
                  {new Date(user.createdAt).toLocaleDateString("pt-PT")}
                </span>
                <Button asChild variant="link" className="h-auto p-0 text-xs font-bold uppercase tracking-widest text-primary">
                  <Link href={`/user/${user.id}`}>Ver Perfil Público →</Link>
                </Button>
              </div>
            </div>
          </div>
          <SignOutButton />
        </header>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Card de Edição de Perfil */}
          <Card className="col-span-full border-2 border-border shadow-sm bg-background/60 backdrop-blur-sm lg:col-span-2">
            <CardHeader className="border-b border-border bg-muted/20 pb-4">
              <CardTitle className="flex items-center gap-2 text-sm uppercase tracking-widest text-primary">
                <User className="h-4 w-4" /> Personalizar Perfil Público
              </CardTitle>
              <CardDescription>
                Adiciona informações sobre a tua carreira como developer para o teu perfil.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <EditProfileForm profile={profileRows ? profileRows[0] : null} />
            </CardContent>
          </Card>

          {/* Card de Desempenho */}
          <Card className="col-span-full border-2 border-border shadow-sm bg-background/60 backdrop-blur-sm lg:col-span-2">
            <CardHeader className="border-b border-border bg-muted/20 pb-4">
              <CardTitle className="flex items-center gap-2 text-sm uppercase tracking-widest text-primary">
                <Code2 className="h-4 w-4" /> Desempenho e Progresso
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-6">
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Problemas Resolvidos
                </span>
                <span className="text-5xl font-black tabular-nums">
                  {completedProblems}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Em Progresso
                </span>
                <span className="text-5xl font-black tabular-nums text-primary/70">
                  {inProgressProblems}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Soluções Lidas
                </span>
                <span className="text-5xl font-black tabular-nums text-muted-foreground/60">
                  {solutionsOpened}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Card de Subscrição */}
          <Card className="col-span-full lg:col-span-1 border-2 border-primary/20 bg-primary/5 shadow-sm">
            <CardHeader className="border-b border-primary/10 pb-4">
              <CardTitle className="flex items-center gap-2 text-sm uppercase tracking-widest text-primary">
                <BookOpen className="h-4 w-4" /> O Teu Plano
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 flex flex-col gap-6">
              <div>
                <h3 className="text-2xl font-black uppercase tracking-tight">
                  {isPro ? "Pro" : "Free"}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {isPro
                    ? "Tens acesso completo ao catálogo, code player passo-a-passo e funcionalidades premium."
                    : "Acesso a rotas públicas, changelog e problemas limitados (10 marcados como hero)."}
                </p>
              </div>

              {!isPro && (
                <Button
                  asChild
                  variant="default"
                  className="w-full rounded-none font-black uppercase"
                >
                  <Link href="/pricing">Fazer Upgrade</Link>
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="col-span-full border-2 border-destructive/20 bg-destructive/5 shadow-none mt-8">
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
