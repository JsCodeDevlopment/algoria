import { sendEmail } from './email/config';
import { getWelcomeEmailTemplate } from './email/templates/welcome';

/**
 * Sends a welcome email to a newly registered user.
 * Imports layout templates and routes parameters to the Resend sending client.
 */
export async function sendWelcomeEmail(toEmail: string, name?: string | null): Promise<void> {
  const greetingName = name ? name.trim() : 'dev';
  const { subject, html } = getWelcomeEmailTemplate({ name: greetingName });

  await sendEmail({
    to: toEmail,
    subject,
    html,
  });
}
