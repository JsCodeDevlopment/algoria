import { ArrowLeft, Scale, ShieldAlert, Award } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { buildPublicMetadata } from "@/lib/seo/build-metadata";

export const metadata: Metadata = buildPublicMetadata({
  title: "Termos de Uso",
  description: "Termos de Uso e condições gerais de contratação da plataforma Algoria em conformidade com o CDC e a LGPD.",
  pathname: "/legal/terms",
  keywords: ["termos de uso", "condições gerais", "reembolso", "CDC", "Algoria"],
});

export default function TermsPage() {
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
          <Scale className="h-3 w-3" /> Condições de Contratação e Uso
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl border-l-4 border-primary pl-6">
          Termos de Uso
        </h1>
        <p className="mt-4 text-muted-foreground">
          Última atualização: 18 de Maio de 2026
        </p>
      </header>

      <div className="prose prose-zinc dark:prose-invert max-w-none space-y-12">
        <section>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <span className="text-primary text-lg">01.</span> Vinculação Contratual
          </h2>
          <p className="leading-relaxed">
            Bem-vindo à <strong>Algoria</strong>. Ao criar uma conta, navegar ou contratar os planos pagos da plataforma (&quot;Serviço&quot;), você celebra um contrato de prestação de serviços educacionais juridicamente vinculativo e concorda integralmente com estes Termos de Uso.
          </p>
          <p className="mt-4">
            Caso discorde de qualquer cláusula ou regra estabelecida neste documento, você deve abster-se imediatamente de utilizar os serviços e funcionalidades da plataforma.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <span className="text-primary text-lg">02.</span> Cadastro de Contas e Segurança das Credenciais
          </h2>
          <p className="leading-relaxed">
            Para desfrutar de toda a jornada acadêmica e submissões práticas, é necessário realizar o registro de sua conta de usuário. 
            Você concorda em:
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-3">
            <li>Fornecer dados cadastrais estritamente verdadeiros, exatos e atualizados.</li>
            <li>Manter a guarda confidencial e secreta de suas senhas de acesso.</li>
            <li>Assumir total responsabilidade por todas as ações realizadas em sua conta.</li>
            <li>Notificar nosso suporte imediatamente caso suspeite de vazamentos ou acesso não autorizado à sua conta.</li>
          </ul>
          <p className="mt-4 font-semibold text-amber-500 flex items-center gap-1.5 text-xs">
            <ShieldAlert className="h-4 w-4" /> REGRAS DE COMPARTILHAMENTO:
          </p>
          <p className="text-xs leading-relaxed text-muted-foreground mt-1">
            Cada conta na Algoria é de natureza **individual e intransferível**. O compartilhamento de credenciais de login para acesso simultâneo de terceiros configura infração contratual de pirataria e quebra de propriedade intelectual, resultando no **bloqueio imediato e definitivo da conta**, sem qualquer direito a estorno ou reembolso das mensalidades pagas.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <span className="text-primary text-lg">03.</span> Assinatura Pro, Pagamentos e Renovação
          </h2>
          <p className="leading-relaxed">
            O plano **Algoria Pro** garante acesso integral ao catálogo premium de problemas resolvidos, trilhas de backend/frontend, testes técnicos simulados e explicações de código avançadas.
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-3">
            <li>
              <strong>Faturamento Recorrente:</strong> Os pagamentos são faturados de forma recorrente e antecipada (mensal ou anual, conforme opção selecionada na contratação).
            </li>
            <li>
              <strong>Checkout Seguro via Stripe:</strong> Todas as cobranças são operacionalizadas pelo processador de pagamentos certificado **Stripe Inc.**, garantindo conformidade com padrões PCI-DSS.
            </li>
            <li>
              <strong>Renovação Automática:</strong> A assinatura é renovada automaticamente pelo mesmo período contratado. Caso não deseje a renovação, o usuário deverá solicitar o cancelamento da recorrência no seu painel de faturamento antes da data do débito subsequente.
            </li>
          </ul>
        </section>

        <section className="bg-primary/5 border border-primary/20 p-6 rounded-none">
          <h2 className="text-xl font-bold mt-0 flex items-center gap-2 text-primary">
            <Award className="h-5 w-5" /> 04. Direito de Arrependimento e Reembolso (Artigo 49 do CDC)
          </h2>
          <p className="text-sm leading-relaxed mb-3">
            Em pleno respeito ao **Código de Defesa do Consumidor (Lei nº 8.078/1990 - CDC, Artigo 49)**, a Algoria assegura ao aluno o prazo de **7 (sete) dias corridos**, contados a partir da data de assinatura/compra inicial do plano Pro, para exercer seu direito de arrependimento.
          </p>
          <p className="text-sm leading-relaxed">
            Caso opte por desistir do plano Pro dentro deste prazo de reflexão de 7 dias, você receberá o **reembolso integral e incondicional** de todo o valor pago, sem qualquer cobrança de taxas administrativas ou burocracias. Para solicitar, basta formalizar o pedido diretamente pelo nosso e-mail oficial de suporte legal.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <span className="text-primary text-lg">05.</span> Exclusão de Contas, Direito ao Esquecimento e LGPD
          </h2>
          <p className="leading-relaxed">
            Você pode requerer a exclusão de seus dados a qualquer momento diretamente no seu painel de Perfil, clicando em **&quot;Excluir Conta&quot;**. 
            Nossa plataforma adota políticas estritas de proteção ao consumidor e titular de dados nos termos da LGPD:
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-3">
            <li>
              A exclusão da conta pelo usuário no painel aciona a Server Action que **cancela imediatamente e preventivamente a recorrência ativa de cobranças no Stripe**, de modo a resguardar sua segurança e afastar cobranças indevidas de contas inativas.
            </li>
            <li>
              Todos os seus registros de progresso acadêmico, testes técnicos concluídos e dados cadastrais serão permanentemente excluídos do banco de dados, sem possibilidade de recuperação posterior.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <span className="text-primary text-lg">06.</span> Propriedade Intelectual e Proteção Antiscraping
          </h2>
          <p className="leading-relaxed">
            Todo o código-fonte, didática textual explicativa em três níveis de profundidade, ilustrações técnicas e arquitetura lógica exposta na plataforma constituem propriedade intelectual exclusiva da Algoria ou de seus licenciadores. 
            É **expressamente proibido**:
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-3">
            <li>Copiar, republicar, traduzir ou redistribuir o material pedagógico sem autorização por escrito.</li>
            <li>Utilizar robôs, rastreadores automatizados (&quot;web scrapers&quot;, &quot;crawlers&quot;), inteligência artificial ou scripts manuais para varredura ou extração massiva de nossos códigos acadêmicos para alimentação de bases externas.</li>
            <li>A infração acarretará o banimento da conta e responsabilidade civil e penal sob a Lei de Direitos Autorais (Lei nº 9.610/98).</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <span className="text-primary text-lg">07.</span> Limitação de Responsabilidade
          </h2>
          <p className="leading-relaxed">
            Os conteúdos didáticos da Algoria servem como suporte e aprimoramento pedagógico profissional para engenharia de software. Não asseguramos aprovação garantida em processos seletivos ou entrevistas específicas de mercado, dependendo o aproveitamento exclusivamente do engajamento individual do estudante nas práticas recomendadas.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <span className="text-primary text-lg">08.</span> Legislação Aplicável e Resolução de Disputas
          </h2>
          <p className="leading-relaxed">
            Este termo é regido e deve ser interpretado em conformidade com as Leis da República Federativa do Brasil (incluindo o Código Civil, o Código de Defesa do Consumidor e a LGPD). 
            Para dirimir controvérsias decorrentes deste contrato, as partes elegem o foro da Comarca do domicílio do Consumidor, conforme garantia expressa na legislação de consumo brasileira.
          </p>
        </section>

        <section className="bg-muted/30 p-6 rounded-none border border-border">
          <h2 className="text-xl font-bold mt-0">Canal de Suporte e Ouvidoria</h2>
          <p className="text-sm leading-relaxed mb-0">
            Dúvidas acerca destes termos de contratação, pedidos de cancelamento, direito de arrependimento (7 dias) ou problemas com acesso Pro devem ser encaminhados ao suporte central em:{" "}
            <a href="mailto:suporte@algoria.com.br" className="text-primary underline hover:text-primary/80 transition-colors">
              suporte@algoria.com.br
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
}
