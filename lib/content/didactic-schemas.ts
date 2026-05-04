import { z } from 'zod';

/** Blocos didáticos opcionais nos `body.md` de `content/engenharia-trabalho`. */

export const DidacticMetricsSchema = z.object({
  title: z.string().optional(),
  columns: z.number().int().min(1).max(4).optional(),
  items: z
    .array(
      z.object({
        label: z.string().min(1),
        value: z.string().min(1),
        sublabel: z.string().optional(),
      }),
    )
    .min(1),
});
export type DidacticMetrics = z.infer<typeof DidacticMetricsSchema>;

export const DidacticBarChartSchema = z.object({
  title: z.string().optional(),
  caption: z.string().optional(),
  unit: z.string().optional(),
  bars: z.array(z.object({ label: z.string().min(1), value: z.number() })).min(1),
});
export type DidacticBarChart = z.infer<typeof DidacticBarChartSchema>;

export const DidacticLineChartSchema = z.object({
  title: z.string().optional(),
  caption: z.string().optional(),
  points: z.array(z.object({ x: z.string().min(1), y: z.number() })).min(2),
});
export type DidacticLineChart = z.infer<typeof DidacticLineChartSchema>;

export const DidacticFigureSchema = z.object({
  src: z.string().min(1),
  alt: z.string().min(1),
  caption: z.string().optional(),
});
export type DidacticFigure = z.infer<typeof DidacticFigureSchema>;

export const DIDACTIC_VARIANTS = ['metrics', 'bar-chart', 'line-chart', 'figure'] as const;
export type DidacticVariant = (typeof DIDACTIC_VARIANTS)[number];

export const DidacticVariantSchema = z.enum(DIDACTIC_VARIANTS);

export const DIDACTIC_SCHEMA_BY_VARIANT = {
  metrics: DidacticMetricsSchema,
  'bar-chart': DidacticBarChartSchema,
  'line-chart': DidacticLineChartSchema,
  figure: DidacticFigureSchema,
} as const;

const BLOCK_RE =
  /^:::didactic-(metrics|bar-chart|line-chart|figure)\r?\n([\s\S]*?)^:::\s*\r?\n?/gm;

export function extractDidacticBlocksFromMarkdown(markdown: string): { variant: DidacticVariant; json: string }[] {
  const found: { variant: DidacticVariant; json: string }[] = [];
  let m: RegExpExecArray | null;
  const re = new RegExp(BLOCK_RE.source, BLOCK_RE.flags);
  while ((m = re.exec(markdown)) !== null) {
    const vr = DidacticVariantSchema.safeParse(m[1]);
    if (!vr.success) continue;
    found.push({ variant: vr.data, json: m[2]?.trim() ?? '' });
  }
  return found;
}

/** Para validação em CI (`pnpm validate:content`). */
export function validateDidacticBlocksInMarkdown(markdown: string): string[] {
  const errs: string[] = [];
  for (const { variant, json } of extractDidacticBlocksFromMarkdown(markdown)) {
    let parsed: unknown;
    try {
      parsed = JSON.parse(json) as unknown;
    } catch {
      errs.push(`[didactic-${variant}] JSON inválido`);
      continue;
    }
    const schema = DIDACTIC_SCHEMA_BY_VARIANT[variant];
    const ok = schema.safeParse(parsed);
    if (!ok.success) errs.push(`[didactic-${variant}] ${ok.error.message}`);
  }
  return errs;
}
