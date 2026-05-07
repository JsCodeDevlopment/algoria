import { eq } from 'drizzle-orm';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, BookOpen, Code2, Award, Link2 } from 'lucide-react';
import Link from 'next/link';

import { db } from '@/lib/db';
import { user, userProfile, userProgress } from '@/lib/db/schema';
import { ProgressBlobSchema } from '@/lib/progress/local-progress-schema';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { buildPublicMetadata } from '@/lib/seo/build-metadata';

interface PublicProfileProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PublicProfileProps) {
  const resolvedParams = await params;
  const userData = await db.select().from(user).where(eq(user.id, resolvedParams.id)).limit(1);
  if (!userData[0]) return buildPublicMetadata({ title: 'Perfil não encontrado', description: 'Perfil de utilizador não encontrado.', pathname: `/user/${resolvedParams.id}` });
  
  return buildPublicMetadata({
    title: `${userData[0].name} | Perfil Algoria`,
    description: `Vê o perfil público, tecnologias e progresso de ${userData[0].name} na Algoria.`,
    pathname: `/user/${resolvedParams.id}`,
  });
}

export default async function PublicProfilePage({ params }: PublicProfileProps) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const [userRows, profileRows, progressRows] = await Promise.all([
    db.select().from(user).where(eq(user.id, id)).limit(1),
    db.select().from(userProfile).where(eq(userProfile.userId, id)).limit(1),
    db.select().from(userProgress).where(eq(userProgress.userId, id)).limit(1),
  ]);

  const userData = userRows[0];
  if (!userData) {
    notFound();
  }

  const profile = profileRows[0];

  // Processar progresso
  let completedProblems = 0;
  let solutionsOpened = 0;
  
  if (progressRows[0]) {
    try {
      const data = JSON.parse(progressRows[0].data);
      const blob = ProgressBlobSchema.parse(data);
      const problems = Object.values(blob.problems);
      
      completedProblems = problems.filter((p) => !!p.markedCompleteAt).length;
      solutionsOpened = problems.reduce((acc, p) => acc + (p.openedSolutions?.length || 0), 0);
    } catch {
      // ignore
    }
  }

  const initials = userData.name?.substring(0, 2).toUpperCase() || userData.email?.substring(0, 2).toUpperCase() || 'U';

  return (
    <div className="relative flex-1 bg-grid-pattern pb-20">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
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

        <header className="mb-12 flex flex-col items-start gap-6 rounded-none border-2 border-border bg-background/80 p-8 shadow-sm backdrop-blur-sm md:flex-row md:items-center">
          <div className="flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-none border-4 border-background bg-primary/10 text-4xl font-black text-primary shadow-md">
            {userData.image ? (
              <Image
                src={userData.image}
                alt={userData.name || 'User avatar'}
                width={128}
                height={128}
                className="h-full w-full object-cover"
              />
            ) : (
              initials
            )}
          </div>
          <div className="flex-1 space-y-3">
            <div>
              <h1 className="text-4xl font-black tracking-tighter uppercase text-foreground">
                {userData.name}
              </h1>
              {profile?.headline && (
                <p className="text-lg font-medium text-muted-foreground mt-1">
                  {profile.headline}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="secondary" className="uppercase font-bold tracking-widest text-[10px]">
                Membro desde {new Date(userData.createdAt).getFullYear()}
              </Badge>
              {profile?.githubUrl && (
                <a href={profile.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-medium hover:text-primary transition-colors text-muted-foreground">
                  <Link2 className="h-4 w-4" /> GitHub
                </a>
              )}
              {profile?.linkedinUrl && (
                <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-medium hover:text-primary transition-colors text-muted-foreground">
                  <Link2 className="h-4 w-4" /> LinkedIn
                </a>
              )}
            </div>
            
            {profile?.bio && (
              <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed mt-4">
                {profile.bio}
              </p>
            )}
          </div>
        </header>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-1 space-y-8">
            <Card className="border-2 border-border bg-background/60 backdrop-blur-sm">
              <CardHeader className="border-b border-border bg-muted/20 pb-4">
                <CardTitle className="flex items-center gap-2 text-sm uppercase tracking-widest text-primary">
                  <Code2 className="h-4 w-4" /> Skills & Tecnologias
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {profile?.technologies && profile.technologies.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.technologies.map(tech => (
                      <Badge key={tech} variant="outline" className="font-mono text-xs font-medium bg-background">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">Nenhuma tecnologia listada.</p>
                )}
              </CardContent>
            </Card>

            <Card className="border-2 border-border bg-background/60 backdrop-blur-sm">
              <CardHeader className="border-b border-border bg-muted/20 pb-4">
                <CardTitle className="flex items-center gap-2 text-sm uppercase tracking-widest text-primary">
                  <BookOpen className="h-4 w-4" /> Desempenho
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Problemas Resolvidos</span>
                  <span className="text-2xl font-black tabular-nums text-foreground">{completedProblems}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Soluções Lidas</span>
                  <span className="text-2xl font-black tabular-nums text-muted-foreground">{solutionsOpened}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Card className="border-2 border-border bg-background/60 backdrop-blur-sm h-full">
              <CardHeader className="border-b border-border bg-muted/20 pb-4">
                <CardTitle className="flex items-center gap-2 text-sm uppercase tracking-widest text-primary">
                  <Award className="h-4 w-4" /> Certificados Algoria
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {/* Aqui poderemos no futuro listar os certificados reais do utilizador com base no progresso completo */}
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Award className="h-12 w-12 text-muted-foreground/30 mb-4" />
                  <p className="text-sm font-medium text-muted-foreground">
                    Os certificados obtidos por este utilizador irão aparecer aqui.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
