import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { buildPublicMetadata } from "@/lib/seo/build-metadata";

export const metadata: Metadata = buildPublicMetadata({
  title: "Termos de Uso",
  description: "Termos e condições de uso da plataforma Algoria.",
  pathname: "/legal/terms",
  keywords: ["termos de uso", "condições", "legal", "Algoria"],
});

export default function TermsPage() {
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
          Termos de Uso
        </h1>
        <p className="mt-4 text-muted-foreground">
          Última atualização: 07 de Maio de 2026
        </p>
      </header>

      <div className="prose prose-zinc dark:prose-invert max-w-none space-y-12">
        <section>
          <h2 className="text-2xl font-bold">1. Aceitação dos Termos</h2>
          <p>
            Ao acessar e utilizar a plataforma Algoria ("Serviço"), você
            concorda em cumprir e estar vinculado aos seguintes Termos de Uso.
            Se você não concordar com qualquer parte destes termos, não deverá
            utilizar o Serviço. Estes termos aplicam-se a todos os visitantes,
            usuários e outros que acessam ou usam o Serviço.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold">2. Elegibilidade e Conta</h2>
          <p>
            Para utilizar certas funcionalidades da Algoria, você deve criar uma
            conta. Ao fazê-lo, você garante que:
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li>As informações fornecidas são precisas, completas e atuais.</li>
            <li>
              Você é responsável por manter a confidencialidade da sua senha e
              conta.
            </li>
            <li>
              Você notificará imediatamente a Algoria sobre qualquer violação de
              segurança ou uso não autorizado de sua conta.
            </li>
          </ul>
          <p className="mt-4">
            Reservamo-nos o direito de recusar serviço, encerrar contas ou
            remover conteúdo a nosso critério exclusivo.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold">3. Propriedade Intelectual</h2>
          <p>
            O Serviço e seu conteúdo original (excluindo conteúdo fornecido
            pelos usuários), recursos e funcionalidades são e continuarão sendo
            propriedade exclusiva da Algoria e de seus licenciadores. O conteúdo
            é protegido por direitos autorais, marcas registradas e outras leis
            de propriedade intelectual.
          </p>
          <p className="mt-4 font-semibold text-destructive">
            É terminantemente proibido:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>
              Copiar, modificar ou distribuir o conteúdo da plataforma para fins
              comerciais ou recreativos fora do escopo do aprendizado pessoal.
            </li>
            <li>
              Realizar engenharia reversa, descompilar ou tentar extrair o
              código-fonte do Serviço.
            </li>
            <li>
              Utilizar "web scraping", "crawlers" ou qualquer método
              automatizado para extrair dados ou conteúdo de forma massiva.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold">4. Assinaturas e Pagamentos</h2>
          <p>
            Algumas partes do Serviço são faturadas em base de assinatura
            ("Algoria Pro"). Você será faturado antecipadamente em uma base
            recorrente e periódica (como mensal ou anual).
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li>
              Os pagamentos são processados via <strong>Stripe</strong>. Não
              armazenamos os dados do seu cartão de crédito em nossos
              servidores.
            </li>
            <li>
              A renovação ocorre automaticamente, a menos que o cancelamento
              seja solicitado antes da data de renovação.
            </li>
            <li>
              Reservamo-nos o direito de alterar as taxas de assinatura a
              qualquer momento, mediante aviso prévio razoável através da
              plataforma ou e-mail.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold">
            5. Conduta do Usuário e Segurança
          </h2>
          <p>
            Você concorda em não usar o Serviço para qualquer finalidade ilegal
            ou proibida por estes Termos. Você não deve:
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li>
              Tentar obter acesso não autorizado a qualquer parte do Serviço ou
              sistemas relacionados.
            </li>
            <li>
              Interferir na segurança ou abusar dos recursos do sistema, rede ou
              serviços da plataforma.
            </li>
            <li>
              Compartilhar sua conta com terceiros ("compartilhamento de
              login"), o que resultará no banimento imediato da conta sem
              direito a reembolso.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold">6. Isenção de Garantias</h2>
          <p>
            O uso do Serviço é por sua conta e risco. O Serviço é fornecido
            "COMO ESTÁ" e "CONFORME DISPONÍVEL". A Algoria não garante que (i) o
            Serviço funcionará de forma ininterrupta, segura ou disponível em
            qualquer momento ou local específico; (ii) quaisquer erros ou
            defeitos serão corrigidos; ou (iii) os resultados do uso do Serviço
            atenderão aos seus requisitos profissionais ou acadêmicos.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold">
            7. Limitação de Responsabilidade
          </h2>
          <p>
            Em nenhum caso a Algoria, seus diretores ou funcionários serão
            responsáveis por quaisquer danos indiretos, incidentais, especiais,
            consequenciais ou punitivos, incluindo, sem limitação, perda de
            lucros, dados, uso, fundo de comércio ou outras perdas intangíveis,
            resultantes do seu acesso ou uso do Serviço.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold">8. Alterações nos Termos</h2>
          <p>
            Reservamo-nos o direito, a nosso exclusivo critério, de modificar ou
            substituir estes Termos a qualquer momento. Se uma revisão for
            material, tentaremos fornecer um aviso com pelo menos 30 dias de
            antecedência antes que quaisquer novos termos entrem em vigor.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold">9. Legislação Aplicável e Foro</h2>
          <p>
            Estes Termos serão regidos e interpretados de acordo com as leis do
            Brasil, sem levar em conta suas disposições sobre conflitos de leis.
            Qualquer disputa decorrente destes termos será resolvida no foro da
            comarca da sede da empresa administradora da Algoria.
          </p>
        </section>

        <section className="bg-muted p-6 rounded-lg border border-border">
          <h2 className="text-xl font-bold mt-0">Dúvidas?</h2>
          <p className="mb-0">
            Se você tiver alguma dúvida sobre estes Termos, entre em contato
            através do nosso canal de suporte oficial ou pelo e-mail listado no
            rodapé da aplicação.
          </p>
        </section>
      </div>
    </div>
  );
}
