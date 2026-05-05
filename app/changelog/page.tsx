import type { Metadata } from "next";
import Link from "next/link";

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
      <div className="mx-auto max-w-3xl px-6 py-24">
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground mb-8 inline-block"
        >
          ← Início
        </Link>
        <main>
          <header className="mb-10 border-l-4 border-primary pl-8">
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-primary mb-2">
              Atualizações
            </p>
            <h1 className="text-4xl font-black tracking-tighter uppercase mb-3">
              Novidades
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Este registo complementa o repositório Git — útil para saberes o
              que mudou sem ler commits.
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
