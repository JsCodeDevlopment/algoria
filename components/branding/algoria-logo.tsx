import Link from "next/link";
import Image from "next/image";

import { cn } from "@/lib/utils";

type Size = "header" | "footer";

/** Marca: logo oficial em PNG, alinhado ao estilo técnico do site */
export function AlgoriaMark({ className }: { className?: string }) {
  return (
    <div className={cn("relative shrink-0 overflow-hidden", className)}>
      <Image
        src="/algoria-logo.png"
        alt="Algoria Logo"
        fill
        className="object-left object-contain"
        priority
      />
    </div>
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
  const markSize = size === "header" ? "h-10 w-36" : "h-9 w-32";

  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
    >
      <AlgoriaMark className={markSize} />
    </Link>
  );
}
