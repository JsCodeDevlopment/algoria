import type {
  DidacticBarChart,
  DidacticFigure,
  DidacticLineChart,
  DidacticMetrics,
} from '@/lib/content/didactic-schemas';

function cn(...parts: (string | false | undefined)[]): string {
  return parts.filter(Boolean).join(' ');
}

export function DidacticMetricsView({ data }: { data: DidacticMetrics }) {
  const cols = data.columns ?? Math.min(4, data.items.length);
  const gridClass =
    cols === 1
      ? 'grid-cols-1'
      : cols === 2
        ? 'grid-cols-1 sm:grid-cols-2'
        : cols === 3
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
          : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';

  return (
    <section
      className="rounded-xl border border-border bg-muted/40 p-5 shadow-sm"
      aria-label={data.title ?? 'Métricas'}
    >
      {data.title ? (
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">{data.title}</h3>
      ) : null}
      <div className={cn('grid gap-4', gridClass)}>
        {data.items.map((item) => (
          <div
            key={`${item.label}-${item.value}`}
            className="rounded-lg border border-border bg-background p-4 text-center shadow-xs"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{item.label}</p>
            <p className="mt-2 font-mono text-2xl font-semibold tabular-nums text-foreground">{item.value}</p>
            {item.sublabel ? (
              <p className="mt-1 text-xs leading-snug text-muted-foreground">{item.sublabel}</p>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}

export function DidacticBarChartView({ data }: { data: DidacticBarChart }) {
  const values = data.bars.map((b) => b.value);
  const max = Math.max(...values, 1);
  const n = data.bars.length;
  const vbW = 400;
  const vbH = 220;
  const pad = { l: 8, r: 8, t: data.title ? 36 : 18, b: 52 };
  const innerW = vbW - pad.l - pad.r;
  const innerH = vbH - pad.t - pad.b;
  const slot = innerW / n;
  const barW = slot * 0.62;

  return (
    <figure className="rounded-xl border border-border bg-muted/30 p-4 shadow-sm">
      {data.title ? <div className="mb-3 text-center text-sm font-semibold text-foreground">{data.title}</div> : null}
      <svg
        viewBox={`0 0 ${vbW} ${vbH}`}
        className="h-auto w-full max-h-[280px] text-primary"
        role="img"
        aria-label={data.caption ?? data.title ?? 'Gráfico de barras'}
      >
        <title>{data.caption ?? data.title ?? 'Barras'}</title>
        {data.unit ? (
          <text x={pad.l} y={14} className="fill-muted-foreground text-[10px]" fontSize={10}>
            {data.unit}
          </text>
        ) : null}
        {data.bars.map((bar, i) => {
          const h = (bar.value / max) * innerH;
          const x = pad.l + i * slot + (slot - barW) / 2;
          const y = pad.t + innerH - h;
          return (
            <g key={bar.label}>
              <rect x={x} y={y} width={barW} height={Math.max(h, 2)} rx={4} className="fill-primary/85" />
              <text
                x={x + barW / 2}
                y={pad.t + innerH + 14}
                textAnchor="middle"
                className="fill-muted-foreground"
                fontSize={11}
              >
                {bar.label}
              </text>
              <text
                x={x + barW / 2}
                y={y - 6}
                textAnchor="middle"
                className="fill-foreground font-mono text-[11px]"
                fontSize={11}
              >
                {bar.value}
              </text>
            </g>
          );
        })}
      </svg>
      {data.caption ? (
        <figcaption className="mt-3 text-center text-xs leading-relaxed text-muted-foreground">{data.caption}</figcaption>
      ) : null}
    </figure>
  );
}

export function DidacticLineChartView({ data }: { data: DidacticLineChart }) {
  const ys = data.points.map((p) => p.y);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const span = maxY - minY || 1;
  const vbW = 420;
  const vbH = 200;
  const pad = { l: 36, r: 16, t: data.title ? 38 : 20, b: 44 };
  const innerW = vbW - pad.l - pad.r;
  const innerH = vbH - pad.t - pad.b;
  const n = data.points.length;

  const pts = data.points.map((p, i) => {
    const x = pad.l + (n === 1 ? innerW / 2 : (i / (n - 1)) * innerW);
    const ny = (p.y - minY) / span;
    const y = pad.t + innerH - ny * innerH;
    return { x, y, label: p.x };
  });

  const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <figure className="rounded-xl border border-border bg-muted/30 p-4 shadow-sm">
      {data.title ? <div className="mb-3 text-center text-sm font-semibold text-foreground">{data.title}</div> : null}
      <svg viewBox={`0 0 ${vbW} ${vbH}`} className="h-auto w-full max-h-[260px]" role="img" aria-label={data.caption ?? data.title ?? 'Gráfico de linhas'}>
        <title>{data.caption ?? data.title ?? 'Linha'}</title>
        <path d={d} fill="none" strokeWidth={2.5} className="stroke-primary" strokeLinecap="round" strokeLinejoin="round" />
        {pts.map((p, i) => (
          <circle key={`${p.label}-${i}`} cx={p.x} cy={p.y} r={5} className="fill-background stroke-primary stroke-[2]" />
        ))}
        {pts.map((p, i) => (
          <text key={`t-${p.label}-${i}`} x={p.x} y={vbH - 12} textAnchor="middle" className="fill-muted-foreground" fontSize={10}>
            {p.label}
          </text>
        ))}
      </svg>
      {data.caption ? (
        <figcaption className="mt-3 text-center text-xs leading-relaxed text-muted-foreground">{data.caption}</figcaption>
      ) : null}
    </figure>
  );
}

export function DidacticFigureView({ data }: { data: DidacticFigure }) {
  return (
    <figure className="my-6 overflow-hidden rounded-xl border border-border bg-muted/20 shadow-sm">
      {/* eslint-disable-next-line @next/next/no-img-element -- URLs estáticas em public/ ou CDN; dimensões fluidas no guia */}
      <img src={data.src} alt={data.alt} className="mx-auto block max-h-[420px] w-full max-w-full object-contain" loading="lazy" />
      {data.caption ? (
        <figcaption className="border-t border-border px-4 py-3 text-center text-xs leading-relaxed text-muted-foreground">
          {data.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
