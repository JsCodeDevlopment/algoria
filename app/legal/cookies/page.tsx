import { ArrowLeft, Cookie, Settings } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { buildPublicMetadata } from "@/lib/seo/build-metadata";

export const metadata: Metadata = buildPublicMetadata({
  title: "Cookies",
  description: "Declaração e Política de Cookies transparente da Acite em conformidade com as diretrizes da LGPD.",
  pathname: "/legal/cookies",
  keywords: ["cookies", "privacidade", "transparência", "gerenciamento de cookies", "Acite"],
});

export default function CookiesPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-20">
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
        <div className="inline-flex items-center gap-2 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary border border-primary/25 bg-primary/5 mb-4">
          <Cookie className="h-3 w-3" /> Gestão de Rastreabilidade
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl border-l-4 border-primary pl-6">
          Política de Cookies
        </h1>
        <p className="mt-4 text-muted-foreground">
          Última atualização: 18 de Maio de 2026
        </p>
      </header>

      <div className="prose prose-zinc dark:prose-invert max-w-none space-y-12">
        <section>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <span className="text-primary text-lg">01.</span> O que são Cookies e Tecnologias Semelhantes?
          </h2>
          <p className="leading-relaxed">
            Cookies são pequenos arquivos de texto armazenados em seu computador, smartphone ou tablet quando você visita um site. 
            Eles servem para viabilizar funções técnicas básicas, salvar suas preferências, proteger sua conta contra invasões e fornecer métricas de uso fundamentais para a melhoria de nosso software educacional.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <span className="text-primary text-lg">02.</span> Declaração Completa e Tabela de Cookies
          </h2>
          <p className="leading-relaxed mb-6">
            A fim de assegurar o princípio da **Transparência (Art. 6º, VI da LGPD)**, discriminamos detalhadamente todos os cookies e chaves de armazenamento local que nossa plataforma utiliza, categorizados por sua finalidade:
          </p>

          <div className="space-y-6 mt-6">
            <div className="border border-border p-5 bg-muted/20">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mt-0">
                1. Cookies Estritamente Necessários (Essenciais)
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed mt-2">
                Estes cookies são indispensáveis para garantir a segurança lógica do portal, autenticação de logins e prevenção a fraudes de pagamento. Eles **não podem** ser desativados, sob pena de inviabilizar o acesso à plataforma.
              </p>
              
              <div className="overflow-x-auto mt-4">
                <table className="min-w-full text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 font-bold uppercase tracking-wider">Identificador/Chave</th>
                      <th className="text-left py-2 font-bold uppercase tracking-wider">Provedor</th>
                      <th className="text-left py-2 font-bold uppercase tracking-wider">Finalidade</th>
                      <th className="text-left py-2 font-bold uppercase tracking-wider">Validade</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border/50">
                      <td className="py-2 font-mono">better-auth.session_token</td>
                      <td className="py-2">Acite (Interno)</td>
                      <td className="py-2">Armazena o token criptografado da sessão do usuário autenticado.</td>
                      <td className="py-2">30 dias</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-2 font-mono">__stripe_mid / __stripe_sid</td>
                      <td className="py-2">Stripe Inc.</td>
                      <td className="py-2">Cookies técnicos de prevenção à fraude em transações de cartão de crédito.</td>
                      <td className="py-2">1 ano / Sessão</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="border border-border p-5 bg-muted/20">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mt-0">
                2. Cookies Analíticos (Opcionais - Requer Opt-in)
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed mt-2">
                Utilizados para mapear a jornada de aprendizado do usuário na plataforma (lições concluídas, clicks e erros de carregamento) para identificação de falhas e melhorias na didática técnica. **Iniciam inativos** e dependem do seu consentimento explícito.
              </p>
              
              <div className="overflow-x-auto mt-4">
                <table className="min-w-full text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 font-bold uppercase tracking-wider">Identificador/Chave</th>
                      <th className="text-left py-2 font-bold uppercase tracking-wider">Provedor</th>
                      <th className="text-left py-2 font-bold uppercase tracking-wider">Finalidade</th>
                      <th className="text-left py-2 font-bold uppercase tracking-wider">Validade</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border/50">
                      <td className="py-2 font-mono">ph_&lt;key&gt;_posthog</td>
                      <td className="py-2">PostHog Inc.</td>
                      <td className="py-2">Registra eventos de navegação anonimizados para telemetria de produto.</td>
                      <td className="py-2">1 ano</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-2 font-mono">acite-cookie-consent</td>
                      <td className="py-2">Acite (Local)</td>
                      <td className="py-2">Registra no navegador a escolha do usuário de aceitar ou rejeitar cookies analíticos.</td>
                      <td className="py-2">Permanente</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <span className="text-primary text-lg">03.</span> Cookies de Terceiros e Salvaguardas
          </h2>
          <p className="leading-relaxed">
            Algumas páginas da Acite carregam componentes de parceiros certificados. A integração com o **Stripe** assegura a segurança transacional indispensável nas compras da assinatura Pro. O **PostHog** atua como ferramenta de telemetria interna sob estritas regras de mitigação de dados pessoais identificáveis.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <span className="text-primary text-lg">04.</span> Como Alterar ou Revogar seu Consentimento
          </h2>
          <p className="leading-relaxed">
            Você pode exercer sua liberdade de escolha a qualquer momento. Caso deseje alterar sua preferência (por exemplo, revogar um aceite analítico prévio):
          </p>
          <ol className="list-decimal pl-6 mt-4 space-y-3">
            <li>
              Você pode **limpar os cookies e o armazenamento local do seu navegador** (especificamente a chave `acite-cookie-consent`).
            </li>
            <li>
              Ao recarregar a página, o banner de consentimento reaparecerá imediatamente no rodapé, permitindo que você clique em **&quot;Rejeitar&quot;** para desativar a coleta do PostHog de forma definitiva.
            </li>
          </ol>
          <p className="mt-4">
            Você também pode desabilitar os cookies diretamente nas opções de segurança do seu próprio navegador. Abaixo listamos os links oficiais com tutoriais de configuração dos principais navegadores de mercado:
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2 text-xs">
            <li>
              <a
                href="https://support.google.com/chrome/answer/95647"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline hover:text-primary/80 transition-colors"
              >
                Google Chrome
              </a>
            </li>
            <li>
              <a
                href="https://support.mozilla.org/pt-BR/kb/cookies-informacoes-armazenadas-por-sites-em-seu-computador"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline hover:text-primary/80 transition-colors"
              >
                Mozilla Firefox
              </a>
            </li>
            <li>
              <a
                href="https://support.apple.com/pt-br/guide/safari/sfri11471/mac"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline hover:text-primary/80 transition-colors"
              >
                Safari
              </a>
            </li>
            <li>
              <a
                href="https://support.microsoft.com/pt-br/windows/microsoft-edge-dados-de-navega%C3%A7%C3%A3o-e-privacidade-bb8174ba-9d73-dcf2-9b4a-c582b4e640dd"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline hover:text-primary/80 transition-colors"
              >
                Microsoft Edge
              </a>
            </li>
          </ul>
        </section>

        <section className="bg-muted/30 p-6 rounded-none border border-border flex items-start gap-4">
          <Settings className="h-6 w-6 text-primary shrink-0 mt-0.5" />
          <div className="space-y-2">
            <h2 className="text-lg font-bold mt-0 flex items-center gap-2">Configurações e Contato</h2>
            <p className="text-sm leading-relaxed mb-0">
              Caso possua qualquer dúvida técnica acerca de nossos identificadores de faturamento ou análise qualitativa de código, consulte a nossa{" "}
              <Link href="/legal/privacy" className="text-primary underline hover:text-primary/80 transition-colors">
                Política de Privacidade
              </Link>{" "}
              ou acione nosso DPO diretamente no e-mail{" "}
              <a href="mailto:privacidade@acite.com.br" className="text-primary underline hover:text-primary/80 transition-colors">
                privacidade@acite.com.br
              </a>.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
