import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
export const resend = resendApiKey ? new Resend(resendApiKey) : null;

export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Algoria <onboarding@resend.dev>';

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

/**
 * Low-level email sending function.
 * Uses Resend if RESEND_API_KEY is set. In development, if Resend fails (e.g. sandbox domain restriction),
 * it gracefully prints a warning and falls back to logging the email to the console.
 */
export async function sendEmail({ to, subject, html }: SendEmailOptions): Promise<void> {
  const isDev = process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_ENVIRONMENT === 'development';

  if (resend) {
    try {
      const response = await resend.emails.send({
        from: FROM_EMAIL,
        to,
        subject,
        html,
      });

      if (response.error) {
        if (isDev) {
          console.warn(`\n⚠️  [Resend Sandbox/API Warning]: Falha no envio real para ${to} (Resend: ${response.error.message}).`);
          console.warn(`Exibindo cópia do e-mail no console devido ao ambiente de desenvolvimento:`);
          logEmailMock(to, subject, html);
          return;
        }

        console.error('[Resend Error sending email]:', response.error);
        throw new Error(response.error.message);
      } else {
        console.log(`[Resend Success]: Email sent to ${to} (ID: ${response.data?.id})`);
      }
    } catch (err) {
      if (isDev) {
        const errMsg = err instanceof Error ? err.message : String(err);
        console.warn(`\n⚠️  [Resend Sandbox/API Exception]: Falha no envio real para ${to} (Erro: ${errMsg}).`);
        console.warn(`Exibindo cópia do e-mail no console devido ao ambiente de desenvolvimento:`);
        logEmailMock(to, subject, html);
        return;
      }

      console.error('[Resend Exception sending email]:', err);
      throw err;
    }
  } else {
    logEmailMock(to, subject, html);
  }
}

function logEmailMock(to: string, subject: string, html: string) {
  console.log('\n========================================================================');
  console.log('📬 [EMAIL MOCK LOG]');
  console.log(`Para: ${to}`);
  console.log(`Assunto: ${subject}`);
  console.log(`De: ${FROM_EMAIL}`);
  console.log('Corpo HTML:');
  console.log(html);
  console.log('========================================================================\n');
}
