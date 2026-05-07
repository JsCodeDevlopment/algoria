import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { buildPublicMetadata } from '@/lib/seo/build-metadata';

export const metadata: Metadata = buildPublicMetadata({
  title: 'Privacidade',
  description: 'Política de Privacidade e proteção de dados da Algoria.',
  pathname: '/legal/privacy',
  keywords: ['privacidade', 'proteção de dados', 'LGPD', 'RGPD', 'Algoria'],
});

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      <Button asChild variant="outline" size="sm" className="rounded-none gap-2 text-xs font-bold uppercase tracking-wide">
        <Link href="/"><ArrowLeft className="h-3.5 w-3.5" /> Voltar ao Início</Link>
      </Button>

      <header className="mt-12 mb-16">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl border-l-4 border-primary pl-6">
          Política de Privacidade
        </h1>
        <p className="mt-4 text-muted-foreground">Última atualização: 07 de Maio de 2026</p>
      </header>

      <div className="prose prose-zinc dark:prose-invert max-w-none space-y-12">
        <section>
          <h2 className="text-2xl font-bold">1. Introdução</h2>
          <p>
            A Algoria está comprometida em proteger a sua privacidade. Esta Política de Privacidade explica como coletamos, usamos, processamos e protegemos suas informações pessoais ao utilizar nossa plataforma. Operamos em conformidade com a Lei Geral de Proteção de Dados (LGPD) no Brasil e o Regulamento Geral sobre a Proteção de Dados (RGPD) na União Europeia.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold">2. Informações que Coletamos</h2>
          <p>Coletamos informações para fornecer melhores serviços a todos os nossos usuários:</p>
          <ul className="list-disc pl-6 mt-4 space-y-4">
            <li>
              <strong>Informações de Conta:</strong> Quando você se registra, coletamos seu nome, endereço de e-mail e credenciais de autenticação através do serviço <em>Better Auth</em>.
            </li>
            <li>
              <strong>Informações de Pagamento:</strong> Para assinaturas Pro, os pagamentos são processados pelo <strong>Stripe</strong>. A Algoria não armazena dados sensíveis de cartão de crédito; apenas recebemos a confirmação do pagamento e o ID da transação.
            </li>
            <li>
              <strong>Dados de Uso e Progresso:</strong> Coletamos dados sobre seu progresso nos cursos, problemas resolvidos e interações com a plataforma para personalizar sua experiência de aprendizado.
            </li>
            <li>
              <strong>Logs e Metadados:</strong> Endereço IP, tipo de navegador, sistema operacional e páginas visitadas podem ser coletados para fins de segurança e diagnóstico.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold">3. Como Usamos seus Dados</h2>
          <p>Utilizamos as informações coletadas para as seguintes finalidades:</p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li>Prover, operar e manter nossa plataforma.</li>
            <li>Processar transações e gerenciar sua assinatura Pro.</li>
            <li>Melhorar e personalizar sua experiência de aprendizado.</li>
            <li>Comunicar atualizações de produtos, novidades e suporte técnico.</li>
            <li>Prevenir fraudes e garantir a segurança do sistema.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold">4. Compartilhamento de Informações</h2>
          <p>
            Não vendemos seus dados pessoais a terceiros. Compartilhamos informações apenas com provedores de serviços essenciais:
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li><strong>Stripe:</strong> Para processamento de pagamentos e gestão de faturamento.</li>
            <li><strong>PostHog:</strong> Para análise de uso da plataforma (analytics), visando melhorias na interface e experiência do usuário.</li>
            <li><strong>Provedores de Infraestrutura:</strong> Serviços de hospedagem de banco de dados e servidores necessários para o funcionamento da aplicação.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold">5. Seus Direitos (LGPD/RGPD)</h2>
          <p>Como titular dos dados, você possui direitos garantidos por lei, incluindo:</p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li><strong>Acesso:</strong> Solicitar uma cópia dos seus dados pessoais que processamos.</li>
            <li><strong>Retificação:</strong> Corrigir dados incompletos, inexatos ou desatualizados.</li>
            <li><strong>Exclusão:</strong> Solicitar a eliminação dos seus dados pessoais (sujeito a retenções legais obrigatórias, como dados fiscais).</li>
            <li><strong>Portabilidade:</strong> Solicitar a transferência dos seus dados para outro fornecedor de serviço.</li>
            <li><strong>Revogação do Consentimento:</strong> Retirar seu consentimento para o processamento de dados a qualquer momento.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold">6. Segurança dos Dados</h2>
          <p>
            Implementamos medidas técnicas e organizacionais avançadas para proteger seus dados contra acesso não autorizado, alteração, divulgação ou destruição. Isso inclui criptografia de dados em repouso e em trânsito (SSL/TLS).
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold">7. Retenção de Dados</h2>
          <p>
            Mantemos seus dados pessoais apenas pelo tempo necessário para cumprir as finalidades para as quais foram coletados, inclusive para fins de cumprimento de obrigações legais, contratuais, de prestação de contas ou requisição de autoridades competentes.
          </p>
        </section>

        <section className="bg-muted p-6 rounded-lg border border-border">
          <h2 className="text-xl font-bold mt-0">Contato de Privacidade</h2>
          <p className="mb-0">
            Para exercer seus direitos ou tirar dúvidas sobre como tratamos seus dados, entre em contato com nosso Encarregado de Proteção de Dados através do suporte oficial da plataforma.
          </p>
        </section>
      </div>
    </div>
  );
}

