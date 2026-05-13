"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

export function AdminNav({
  navItems,
}: {
  navItems: NavItem[];
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function checkActive(href: string) {
    if (href.includes("?")) {
      const [path, query] = href.split("?");
      const params = new URLSearchParams(query);
      // Verifica se o path bate E se TODOS os query params do item estão presentes na URL atual
      return (
        pathname === path &&
        Array.from(params.entries()).every(
          ([k, v]) => searchParams.get(k) === v,
        )
      );
    }

    // Caso especial: se estamos na página de conteúdos mas com filtro de acesso,
    // o link geral de "Conteúdos" não deve ficar ativo.
    if (href === "/admin/content" && searchParams.get("access")) {
      return false;
    }

    return pathname === href;
  }

  return (
    <nav className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-hide">
      {navItems.map((item) => {
        const isActive = checkActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2 whitespace-nowrap px-4 py-2 text-sm transition-all duration-200 ${
              isActive
                ? "bg-primary text-primary-foreground shadow-md ring-1 ring-primary/20 font-bold"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            <svg
              className={`h-4 w-4 shrink-0 transition-colors ${isActive ? "text-primary-foreground" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={isActive ? 2.5 : 1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={item.icon}
              />
            </svg>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
