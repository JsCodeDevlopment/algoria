export interface BaseEmailLayoutProps {
  title: string;
  previewText?: string;
  contentHtml: string;
}

/**
 * Wraps dynamic body content in the standard dark-mode Algoria email HTML shell.
 * Adheres strictly to the brand aesthetics (dark deep-slate backgrounds, sharp rounded-none edges).
 */
export function getBaseEmailLayout({ title, previewText, contentHtml }: BaseEmailLayoutProps): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const previewTextHtml = previewText
    ? `<span style="display:none;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">${previewText}</span>`
    : '';

  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #020617; color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
    ${previewTextHtml}
    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #0b0f19; border: 1px solid #1e293b; border-collapse: collapse; margin-top: 40px; margin-bottom: 40px;">
      <!-- Header (Centered logo, sharp borders) -->
      <tr>
        <td align="center" style="padding: 40px 0 20px 0; border-bottom: 1px solid #1e293b;">
          <img src="${appUrl}/Algoria-logo-dark.webp" alt="Algoria" style="height: 32px; max-height: 32px; display: block; margin: 0 auto; border: 0; outline: none; text-decoration: none;" />
          <p style="margin: 10px 0 0 0; font-size: 12px; color: #f97316; letter-spacing: 0.15em; text-transform: uppercase;">Aprenda lendo código</p>
        </td>
      </tr>
      <!-- Content Body -->
      <tr>
        <td style="padding: 40px 30px;">
          ${contentHtml}
        </td>
      </tr>
      <!-- Footer -->
      <tr>
        <td style="padding: 30px; background-color: #020617; border-top: 1px solid #1e293b; text-align: center; font-size: 12px; color: #64748b;">
          <p style="margin: 0 0 10px 0;">Algoria — Domine algoritmos de verdade</p>
          <p style="margin: 0;">Você recebeu este e-mail porque criou uma conta no Algoria. Se você não fez essa solicitação, por favor ignore este e-mail.</p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
