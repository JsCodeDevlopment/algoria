import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { getChangelogHtml } from "@/lib/content/loader";
import { buildPublicMetadata } from "@/lib/seo/build-metadata";

export const metadata: Metadata = buildPublicMetadata({
  title: "Novidades",
  description:
    "Alterações recentes na Algoria: novas funcionalidades, conteúdo e melhorias para quem estuda algoritmos e preparação técnica.",
  pathname: "/changelog",
  keywords: ["changelog", "novidades", "Algoria", "actualizações"],
});

export default async function ChangelogPage() {
  const html = await getChangelogHtml();

  return (
    <div className="relative bg-grid-pattern">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <Button
          asChild
          variant="outline"
          size="sm"
          className="mb-8 rounded-none gap-2 text-xs font-bold uppercase tracking-wide"
        >
          <Link href="/">
            <ArrowLeft className="h-3.5 w-3.5" /> Início
          </Link>
        </Button>
        <main>
          <header className="mb-16 border-l-4 border-primary pl-8">
            <Badge
              variant="secondary"
              className="mb-4 rounded-none bg-primary/10 px-1.5 py-0 font-mono text-[10px] uppercase text-primary"
            >
              Últimas Atualizações
            </Badge>
            <h1 className="mb-4 text-4xl font-black uppercase tracking-tighter md:text-6xl">
              Novidades
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed tracking-tight text-muted-foreground">
              Descobre as últimas melhorias, novos conteúdos e funcionalidades
              desenhadas para levar o teu conhecimento técnico ao próximo nível.
            </p>
          </header>

          {html ? (
            <article
              className="prose prose-zinc dark:prose-invert max-w-none
                         prose-headings:font-semibold prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4
                         prose-code:text-blue-600 dark:prose-code:text-blue-400
                         prose-code:before:content-none prose-code:after:content-none"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          ) : (
            <p className="text-sm text-muted-foreground">
              Ainda não há <code className="text-xs">content/changelog.md</code>
              . Adiciona esse ficheiro na raíz de{" "}
              <code className="text-xs">content/</code> para preencher esta
              página.
            </p>
          )}
        </main>
      </div>
    </div>
  );
}
