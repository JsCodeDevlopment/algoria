import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft, Shield, FileText, CheckCircle2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { buildPublicMetadata } from '@/lib/seo/build-metadata';

export const metadata: Metadata = buildPublicMetadata({
  title: 'Política de Privacidade',
  description: 'Declaração oficial de transparência e Política de Privacidade da Algoria em conformidade com a LGPD e o RGPD.',
  pathname: '/legal/privacy',
  keywords: ['privacidade', 'proteção de dados', 'LGPD', 'direitos do titular', 'Algoria'],
});

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-20">
      <Button asChild variant="outline" size="sm" className="rounded-none gap-2 text-xs font-bold uppercase tracking-wide">
        <Link href="/"><ArrowLeft className="h-3.5 w-3.5" /> Voltar ao Início</Link>
      </Button>

      <header className="mt-12 mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary border border-primary/25 bg-primary/5 mb-4">
          <Shield className="h-3 w-3" /> Transparência e Segurança
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl border-l-4 border-primary pl-6">
          Política de Privacidade
        </h1>
        <p className="mt-4 text-muted-foreground">Última atualização: 18 de Maio de 2026</p>
      </header>

      <div className="prose prose-zinc dark:prose-invert max-w-none space-y-12">
        <section>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <span className="text-primary text-lg">01.</span> Introdução e Escopo
          </h2>
          <p className="leading-relaxed">
            A <strong>Algoria</strong> preza pela segurança, privacidade e transparência no tratamento dos dados pessoais de seus alunos e visitantes. 
            Esta Política de Privacidade descreve, de forma clara e objetiva, como coletamos, armazenamos, utilizamos e protegemos seus dados pessoais em total conformidade com a <strong>Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018 - LGPD)</strong> no Brasil, e de forma subsidiária com o <strong>Regulamento Geral sobre a Proteção de Dados (GDPR - Regulamento UE 2016/679)</strong> na União Europeia.
          </p>
          <p className="mt-4">
            Ao se cadastrar ou navegar na nossa plataforma, você compreende e está ciente de que realizamos o tratamento de seus dados estritamente nos limites aqui especificados.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <span className="text-primary text-lg">02.</span> Dados Coletados e suas Bases Legais (Art. 7º da LGPD)
          </h2>
          <p className="mb-4">
            A LGPD exige que todo tratamento de dados pessoais tenha uma justificativa legal válida. Mapeamos os nossos fluxos abaixo:
          </p>
          
          <div className="space-y-6 mt-6">
            <div className="p-5 border border-border bg-muted/20">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2 mt-0">
                <CheckCircle2 className="h-4 w-4 text-primary" /> A. Dados Cadastrais e de Perfil
              </h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                <strong>Dados:</strong> Nome completo, endereço de e-mail, foto de perfil, biografia profissional, stack de tecnologias de preferência, links para redes de portfólio (GitHub, LinkedIn) e registros voluntários de experiência profissional.
              </p>
              <p className="text-sm mt-2">
                <strong>Base Legal:</strong> <em>Execução de Contrato (Art. 7º, V, LGPD)</em> para prover o ambiente de estudo e <em>Consentimento (Art. 7º, I, LGPD)</em> para a publicação e compartilhamento opcional do seu perfil profissional com terceiros ou recrutadores.
              </p>
            </div>

            <div className="p-5 border border-border bg-muted/20">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2 mt-0">
                <CheckCircle2 className="h-4 w-4 text-primary" /> B. Registros de Conexão e Segurança
              </h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                <strong>Dados:</strong> Endereço IP (Internet Protocol), metadados do navegador (User Agent), data/hora dos acessos e tokens de sessão.
              </p>
              <p className="text-sm mt-2">
                <strong>Base Legal:</strong> <em>Cumprimento de Obrigação Legal ou Regulatória (Art. 7º, II, LGPD)</em>, atendendo às exigências imperativas do <strong>Marco Civil da Internet (Lei nº 12.965/2014, Art. 15)</strong>, que obriga a guarda de logs de conexão pelo prazo mínimo de 6 (seis) meses sob sigilo.
              </p>
            </div>

            <div className="p-5 border border-border bg-muted/20">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2 mt-0">
                <CheckCircle2 className="h-4 w-4 text-primary" /> C. Informações de Pagamento e Assinatura Pro
              </h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                <strong>Dados:</strong> ID de cliente Stripe, ID da assinatura recorrente, status de pagamento da mensalidade/anuidade e término do período de faturamento.
              </p>
              <p className="text-sm mt-2">
                <strong>Base Legal:</strong> <em>Execução de Contrato ou Procedimentos Preliminares (Art. 7º, V, LGPD)</em>. 
                <br />
                <span className="font-semibold text-xs text-amber-500">IMPORTANTE:</span> A Algoria <strong>não coleta nem armazena</strong> dados de cartões de crédito em servidores próprios. Todo o checkout e custódia de dados de faturamento são feitos de forma segura e direta no ambiente certificado PCI-DSS do <strong>Stripe Inc.</strong>
              </p>
            </div>

            <div className="p-5 border border-border bg-muted/20">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2 mt-0">
                <CheckCircle2 className="h-4 w-4 text-primary" /> D. Dados Analíticos e Métricas de Uso
              </h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                <strong>Dados:</strong> Cliques de navegação, tempo de permanência em lições, acertos em testes técnicos e performance de carregamento das páginas.
              </p>
              <p className="text-sm mt-2">
                <strong>Base Legal:</strong> <em>Consentimento (Art. 7º, I, LGPD)</em>. O processamento é realizado via **PostHog** e inicia completamente desativado, necessitando de escolha ativa (Opt-in) do usuário em nosso banner de cookies antes de iniciar qualquer rastreamento.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <span className="text-primary text-lg">03.</span> Compartilhamento de Dados e Transferência Internacional
          </h2>
          <p className="leading-relaxed">
            Nós não comercializamos seus dados pessoais em nenhuma hipótese. Seus dados são compartilhados apenas com provedores de infraestrutura essenciais para a manutenção técnica do Serviço:
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-3">
            <li>
              <strong>Stripe, Inc. (EUA):</strong> Responsável pela segurança de faturamento das contas Pro.
            </li>
            <li>
              <strong>PostHog, Inc. (EUA):</strong> Análise qualitativa de uso da plataforma educacional (apenas com o seu consentimento ativo).
            </li>
            <li>
              <strong>Provedores de Computação em Nuvem (Neon/Vercel):</strong> Hospedagem lógica de dados e banco de dados distribuído para a execução física do portal.
            </li>
          </ul>
          <p className="mt-4">
            Como esses operadores mantêm servidores baseados nos Estados Unidos da América, o compartilhamento envolve **Transferência Internacional de Dados Pessoais (Art. 33 da LGPD)**. Garantimos que tais parceiros adotam salvaguardas de conformidade equivalentes à LGPD, como cláusulas contratuais padrão de segurança de dados.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <span className="text-primary text-lg">04.</span> Direitos Garantidos dos Titulares (Art. 18 da LGPD)
          </h2>
          <p>
            Você, como titular de seus dados pessoais, possui controle total sobre suas informações e pode exercer os seguintes direitos:
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-3">
            <li><strong>Acesso e Confirmação:</strong> Saber se tratamos seus dados e solicitar cópia estruturada dos dados sob custódia.</li>
            <li><strong>Correção:</strong> Retificar informações incorretas, incompletas ou desatualizadas em seu painel de Perfil.</li>
            <li><strong>Eliminação e Direito ao Esquecimento:</strong> Excluir seus dados cadastrais. A exclusão de sua conta pela plataforma **cancela automaticamente e imediatamente qualquer cobrança recorrente no Stripe**, eliminando seus registros de progresso e logins.</li>
            <li><strong>Revogação do Consentimento:</strong> Desativar cookies analíticos e revogar autorizações prévias a qualquer momento limpando os cookies ou alterando a preferência no rodapé do site.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <span className="text-primary text-lg">05.</span> Segurança e Retenção
          </h2>
          <p>
            Empregamos criptografia de ponta em repouso e em trânsito (SSL/TLS), práticas rigorosas de sanitização de banco de dados e controle de acessos restritos.
          </p>
          <p className="mt-4">
            Seus dados são retidos enquanto seu cadastro permanecer ativo. Mediante sua exclusão, eles são deletados fisicamente, exceto pelos dados de transações financeiras e registros de log de IPs necessários para o cumprimento de prazos de guarda previstos em lei brasileira (como o Marco Civil da Internet).
          </p>
        </section>

        <section className="bg-muted/30 p-6 rounded-none border border-border">
          <h2 className="text-xl font-bold mt-0 flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" /> Encarregado pelo Tratamento de Dados (DPO)
          </h2>
          <p className="text-sm leading-relaxed mb-4">
            Em cumprimento ao Artigo 41 da LGPD, o Encarregado pelo Tratamento de Dados Pessoais da Algoria responde a todas as dúvidas, solicitações ou requisições de titulares de dados e autoridades de fiscalização (ANPD).
          </p>
          <p className="text-sm font-semibold mb-0">
            Contato do DPO / Canal de Suporte Legal:{" "}
            <a href="mailto:privacidade@algoria.com.br" className="text-primary underline hover:text-primary/80 transition-colors">
              privacidade@algoria.com.br
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}

