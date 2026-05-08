import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { buildPublicMetadata } from "@/lib/seo/build-metadata";

export const metadata: Metadata = buildPublicMetadata({
  title: "Cookies",
  description: "Como a Algoria utiliza cookies para melhorar sua experiência.",
  pathname: "/legal/cookies",
  keywords: ["cookies", "privacidade", "segurança", "Algoria"],
});

export default function CookiesPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      <Button
        asChild
        variant="outline"
        size="sm"
        className="rounded-none gap-2 text-xs font-bold uppercase tracking-wide"
      >
        <Link href="/">
          <ArrowLeft className="h-3.5 w-3.5" /> Voltar ao Início
        </Link>
      </Button>

      <header className="mt-12 mb-16">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl border-l-4 border-primary pl-6">
          Política de Cookies
        </h1>
        <p className="mt-4 text-muted-foreground">
          Última atualização: 07 de Maio de 2026
        </p>
      </header>

      <div className="prose prose-zinc dark:prose-invert max-w-none space-y-12">
        <section>
          <h2 className="text-2xl font-bold">1. O que são Cookies?</h2>
          <p>
            Cookies são pequenos arquivos de texto enviados pelo nosso servidor
            para o seu navegador e armazenados no seu dispositivo (computador,
            smartphone, tablet). Eles permitem que a plataforma &quot;lembre&quot; de suas
            ações ou preferências ao longo do tempo, garantindo uma navegação
            mais eficiente e segura.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold">2. Como Utilizamos os Cookies</h2>
          <p>A Algoria utiliza cookies para as seguintes finalidades:</p>
          <ul className="list-disc pl-6 mt-4 space-y-4">
            <li>
              <strong>Cookies Essenciais (Estritamente Necessários):</strong>{" "}
              São fundamentais para o funcionamento da plataforma. Eles permitem
              que você faça login de forma segura através do{" "}
              <em>Better Auth</em>, navegue entre as páginas e acesse áreas
              protegidas (como o conteúdo Algoria Pro). Sem esses cookies, o
              serviço não pode ser prestado corretamente.
            </li>
            <li>
              <strong>Cookies de Funcionalidade:</strong> Usados para reconhecer
              você quando retorna à nossa plataforma. Isso nos permite
              personalizar nosso conteúdo para você e lembrar suas preferências
              (como idioma ou configurações de interface).
            </li>
            <li>
              <strong>Cookies Analíticos e de Desempenho:</strong> Utilizamos o{" "}
              <strong>PostHog</strong> para entender como os visitantes
              interagem com a plataforma. Isso nos ajuda a identificar quais
              páginas são mais populares e se ocorrem erros. Todos os dados são
              coletados de forma a proteger sua identidade.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold">3. Cookies de Terceiros</h2>
          <p>
            Alguns cookies são definidos por serviços de terceiros que aparecem
            em nossas páginas:
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li>
              <strong>Stripe:</strong> Define cookies necessários para processar
              pagamentos e prevenir fraudes durante o checkout.
            </li>
            <li>
              <strong>PostHog:</strong> Define cookies para rastrear métricas de
              uso e comportamento do usuário dentro da aplicação.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold">4. Como Controlar os Cookies</h2>
          <p>
            Você pode gerenciar ou desativar cookies diretamente nas
            configurações do seu navegador. No entanto, observe que a
            desativação de cookies essenciais pode impedir o acesso a
            funcionalidades críticas da plataforma, como a manutenção da sua
            sessão de usuário ativa.
          </p>
          <p className="mt-4">
            Para mais informações sobre como gerenciar cookies nos principais
            navegadores:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>
              <a
                href="https://support.google.com/chrome/answer/95647"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                Google Chrome
              </a>
            </li>
            <li>
              <a
                href="https://support.mozilla.org/pt-BR/kb/cookies-informacoes-armazenadas-por-sites-em-seu-computador"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                Mozilla Firefox
              </a>
            </li>
            <li>
              <a
                href="https://support.apple.com/pt-br/guide/safari/sfri11471/mac"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                Safari
              </a>
            </li>
            <li>
              <a
                href="https://support.microsoft.com/pt-br/windows/microsoft-edge-dados-de-navega%C3%A7%C3%A3o-e-privacidade-bb8174ba-9d73-dcf2-9b4a-c582b4e640dd"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                Microsoft Edge
              </a>
            </li>
          </ul>
        </section>

        <section className="bg-muted p-6 rounded-lg border border-border">
          <h2 className="text-xl font-bold mt-0">Mais Informações</h2>
          <p className="mb-0">
            Se você tiver dúvidas sobre nossa política de cookies, consulte
            também nossa{" "}
            <Link href="/legal/privacy" className="text-primary underline">
              Política de Privacidade
            </Link>{" "}
            ou entre em contato conosco.
          </p>
        </section>
      </div>
    </div>
  );
}
