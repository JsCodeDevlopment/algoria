"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { NAVIGATION_ITEMS } from "@/lib/navigation-data";

interface NavLinksProps {
  onNavigate?: () => void;
  className?: string;
}

export function NavLinks({ onNavigate, className }: NavLinksProps) {
  return (
    <ul className={cn("flex flex-col gap-2.5", className)}>
      {NAVIGATION_ITEMS.map(({ href, label, description, Icon }) => (
        <li key={href}>
          <Link
            href={href}
            onClick={onNavigate}
            className={cn(
              "group relative flex items-center gap-3 overflow-hidden border-2 border-border/90 bg-background/60 px-3 py-3 shadow-sm transition-all duration-200",
              "hover:border-primary/55 hover:bg-primary/6 hover:shadow-md",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            )}
          >
            <span
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center border-2 border-primary/25 bg-primary/5 text-primary transition-colors",
                "group-hover:border-primary/45 group-hover:bg-primary/10",
              )}
              aria-hidden
            >
              <Icon className="h-4 w-4" strokeWidth={2.25} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[10px] font-black uppercase tracking-[0.12em] text-foreground transition-colors group-hover:text-primary">
                {label}
              </span>
              <span className="mt-0.5 block text-[11px] leading-snug text-muted-foreground group-hover:text-muted-foreground/90">
                {description}
              </span>
            </span>
            <ArrowUpRight
              className="h-4 w-4 shrink-0 text-muted-foreground/40 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary"
              aria-hidden
            />
            <span
              className="pointer-events-none absolute inset-y-0 left-0 w-[3px] bg-primary opacity-0 transition-opacity group-hover:opacity-100"
              aria-hidden
            />
          </Link>
        </li>
      ))}
    </ul>
  );
}
