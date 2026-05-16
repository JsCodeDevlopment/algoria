export function SectionHeading(props: {
  kicker?: string;
  title: string;
  subtitle?: string;
  compact?: boolean;
}) {
  const { kicker, title, subtitle, compact } = props;
  return (
    <div className={`max-w-3xl space-y-4 ${compact ? "" : ""}`}>
      {kicker ? (
        <p className="text-[10px] font-black uppercase tracking-[0.38em] text-primary">
          {kicker}
        </p>
      ) : null}
      <h2 className="text-3xl font-black uppercase leading-tight tracking-tighter md:text-5xl md:leading-[1]">
        {title}
      </h2>
      {subtitle ? (
        <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
