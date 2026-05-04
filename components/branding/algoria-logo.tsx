import Link from "next/link";

import { cn } from "@/lib/utils";

type Size = "header" | "footer";

/** Marca SVG: mouldura + árvore binária mínima (decisões algorítmicas), alinhado ao estilo técnico do site */
export function AlgoriaMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      className={cn("shrink-0 text-current", className)}
      aria-hidden
    >
      <rect
        x={1}
        y={1}
        width={38}
        height={38}
        stroke="currentColor"
        strokeWidth={2}
        className="text-primary"
      />
      <path
        d="M20 11v7M20 18l-7 9M20 18l7 9M13 27v6M27 27v6"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="square"
        strokeLinejoin="miter"
        className="text-foreground"
      />
      <circle cx={20} cy={9} r={2} className="fill-primary" stroke="none" />
    </svg>
  );
}

export function AlgoriaBrand({
  href = "/",
  size = "header",
  className,
}: {
  href?: string;
  size?: Size;
  className?: string;
}) {
  const markSize = size === "header" ? "h-10 w-10" : "h-9 w-9";
  const titleSize =
    size === "header"
      ? "text-lg md:text-xl leading-none tracking-[0.12em]"
      : "text-base md:text-lg leading-none tracking-[0.14em]";
  const kickerHidden = size === "footer";

  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-3 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
    >
      <span className="relative flex shrink-0 items-center justify-center text-primary transition-colors group-hover:text-foreground">
        <AlgoriaMark className={markSize} />
      </span>
      <span className="flex min-w-0 flex-col gap-1">
        <span
          className={cn(
            "font-black uppercase tracking-tighter text-foreground",
            titleSize,
          )}
        >
          Algoria
        </span>
        {!kickerHidden ? (
          // <span className="hidden font-mono text-[9px] font-semibold uppercase tracking-[0.32em] text-muted-foreground sm:block">
          //   Leitura de código guiada
          // </span>
          <></>
        ) : (
          <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.32em] text-muted-foreground">
            Catálogo · Player · Curso
          </span>
        )}
      </span>
    </Link>
  );
}
