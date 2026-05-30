import { getBaseEmailLayout } from './base';

export interface WelcomeEmailData {
  name: string;
}

/**
 * Generates a highly engaging and comprehensive welcome onboarding email.
 * Outlines the main platform features and sets clear next steps for the user.
 */
export function getWelcomeEmailTemplate({ name }: WelcomeEmailData): { subject: string; html: string } {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const subject = 'Boas-vindas ao Algoria! Sua jornada dev começa aqui 🚀';

  const contentHtml = `
    <!-- Greeting -->
    <h2 style="margin: 0 0 16px 0; font-size: 22px; font-weight: 600; color: #f8fafc; letter-spacing: -0.02em;">
      Olá, ${name}! Seu acesso ao Algoria está liberado.
    </h2>
    <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #cbd5e1;">
      Ficamos muito empolgados em ter você aqui. A maioria das pessoas tenta aprender algoritmos e estruturas de dados decorando fórmulas e batendo a cabeça no teclado escrevendo código do zero sem entender o básico. 
    </p>
    <p style="margin: 0 0 30px 0; font-size: 15px; line-height: 1.6; color: #cbd5e1; border-left: 3px solid #f97316; padding-left: 16px; font-style: italic;">
      No Algoria, nós fazemos o oposto. Acreditamos que a melhor forma de se tornar um programador de elite é <strong>lendo e analisando código de alta qualidade, linha por linha</strong>.
    </p>

    <!-- Main Call to Action -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 40px;">
      <tr>
        <td align="center">
          <a href="${appUrl}/problems" style="display: inline-block; padding: 16px 36px; background-color: #4f46e5; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; border: none; border-radius: 0px; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);">
            Começar a Explorar a Plataforma
          </a>
        </td>
      </tr>
    </table>

    <!-- Platform Tour / What to find -->
    <div style="border-top: 1px solid #1e293b; padding-top: 30px; margin-top: 10px;">
      <h3 style="margin: 0 0 20px 0; font-size: 15px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #818cf8;">
        O que você vai encontrar na plataforma?
      </h3>
      
      <!-- Feature 1 -->
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 24px;">
        <tr>
          <td valign="top" style="padding-right: 15px; font-size: 20px; line-height: 1;">🧠</td>
          <td>
            <h4 style="margin: 0 0 6px 0; font-size: 15px; font-weight: 600; color: #f8fafc;">
              O Code Player Interativo
            </h4>
            <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #94a3b8;">
              Nosso visualizador de código funciona como um reprodutor de vídeo. Dê play e veja o ponteiro de execução passar linha por linha, com comentários dinâmicos em 3 níveis de profundidade (Fácil, Médio e Avançado).
            </p>
          </td>
        </tr>
      </table>

      <!-- Feature 2 -->
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 24px;">
        <tr>
          <td valign="top" style="padding-right: 15px; font-size: 20px; line-height: 1;">⚔️</td>
          <td>
            <h4 style="margin: 0 0 6px 0; font-size: 15px; font-weight: 600; color: #f8fafc;">
              Brute-Force vs. Solução Ótima
            </h4>
            <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #94a3b8;">
              Compare implementações ineficientes diretamente contra os códigos de alta performance. Entenda no visual a real diferença teórica e prática na otimização de CPU e Memória (Big O).
            </p>
          </td>
        </tr>
      </table>

      <!-- Feature 3 -->
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 24px;">
        <tr>
          <td valign="top" style="padding-right: 15px; font-size: 20px; line-height: 1;">⚡</td>
          <td>
            <h4 style="margin: 0 0 6px 0; font-size: 15px; font-weight: 600; color: #f8fafc;">
              Guias de Engenharia Aplicada
            </h4>
            <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #94a3b8;">
              Esqueça problemas abstratos que nunca acontecem na prática. Nos nossos guias, conectamos estruturas de dados com a realidade: sistemas de cache, pipelines RAG para IA, arquitetura de multi-agentes e segurança em produção.
            </p>
          </td>
        </tr>
      </table>

      <!-- Feature 4 -->
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 24px;">
        <tr>
          <td valign="top" style="padding-right: 15px; font-size: 20px; line-height: 1;">🗣️</td>
          <td>
            <h4 style="margin: 0 0 6px 0; font-size: 15px; font-weight: 600; color: #f8fafc;">
              Trilha de Inglês Técnico (Interview English)
            </h4>
            <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #94a3b8;">
              Prepare-se para vagas internacionais. Aprenda o vocabulário técnico preciso para dinâmicas de System Design, live coding e comunicação profissional em reuniões de engenharia.
            </p>
          </td>
        </tr>
      </table>

      <!-- Feature 5 -->
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 24px;">
        <tr>
          <td valign="top" style="padding-right: 15px; font-size: 20px; line-height: 1;">🔥</td>
          <td>
            <h4 style="margin: 0 0 6px 0; font-size: 15px; font-weight: 600; color: #f8fafc;">
              Desafio Diário (Daily Challenge)
            </h4>
            <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #94a3b8;">
              Construa consistência sem esforço. Precisa de apenas 3 minutos diários na página de código ativa para manter seu streak e fogo de estudos ativo na plataforma.
            </p>
          </td>
        </tr>
      </table>
    </div>

    <!-- First Mission -->
    <div style="border-top: 1px solid #1e293b; padding-top: 30px; margin-top: 24px; background-color: rgba(249, 115, 22, 0.03); padding: 20px 24px; border: 1px dashed rgba(249, 115, 22, 0.2); text-align: left;">
      <h3 style="margin: 0 0 10px 0; font-size: 14px; font-weight: 700; color: #f97316; text-transform: uppercase; letter-spacing: 0.05em;">Sua primeira missão:</h3>
      <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #cbd5e1;">
        Acesse a seção de <strong>Problemas</strong>, selecione o desafio clássico "Two Sum" e dê play na solução ótima para ver como o player ajuda a entender o funcionamento interno de hash maps.
      </p>
    </div>
  `;

  const html = getBaseEmailLayout({
    title: subject,
    previewText: 'Domine algoritmos lendo código de verdade com o Code Player.',
    contentHtml,
  });

  return { subject, html };
}
