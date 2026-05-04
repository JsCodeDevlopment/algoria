import { DIDACTIC_SCHEMA_BY_VARIANT, DidacticVariantSchema } from './didactic-schemas';

function payloadToBase64(json: string): string {
  return Buffer.from(json.trim(), 'utf8').toString('base64');
}

/**
 * Substitui blocos `:::didactic-<variant>` … `:::` por `<div data-algoria-didactic>` antes do marked,
 * para o cliente hidratar em métricas / gráficos / figuras.
 */
export function injectDidacticPlaceholders(markdown: string): { markdown: string; errors: string[] } {
  const errors: string[] = [];
  const blockRe = /^:::didactic-(metrics|bar-chart|line-chart|figure)\r?\n([\s\S]*?)^:::\s*\r?\n?/gm;

  const out = markdown.replace(blockRe, (_full, variantRaw: string, body: string) => {
    const vParsed = DidacticVariantSchema.safeParse(variantRaw);
    if (!vParsed.success) {
      errors.push(`Variant didático inválido: ${variantRaw}`);
      return `\n\n<!-- didactic error: invalid variant -->\n\n`;
    }
    const variant = vParsed.data;
    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(body.trim()) as unknown;
    } catch {
      errors.push(`JSON inválido em didactic-${variant}`);
      return `\n\n<!-- didactic error: invalid JSON (${variant}) -->\n\n`;
    }
    const schema = DIDACTIC_SCHEMA_BY_VARIANT[variant];
    const ok = schema.safeParse(parsedJson);
    if (!ok.success) {
      errors.push(`didactic-${variant}: ${ok.error.message}`);
      return `\n\n<!-- didactic error: schema (${variant}) -->\n\n`;
    }
    const b64 = payloadToBase64(JSON.stringify(ok.data));
    return `\n\n<div class="algoria-didactic-root not-prose my-8" data-algoria-didactic="${variant}" data-algoria-payload="${b64}"></div>\n\n`;
  });

  return { markdown: out, errors };
}
