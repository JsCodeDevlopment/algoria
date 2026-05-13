import type { Metadata } from "next";
import Image from "next/image";

import { isAdminRole, requireContributor } from "@/lib/admin/auth-guard";
import { AdminNav } from "./_components/admin-nav";

export const metadata: Metadata = {
  title: "Admin Panel",
  robots: { index: false, follow: false },
};

const ALL_NAV_ITEMS = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    adminOnly: true,
  },
  {
    href: "/admin/users",
    label: "Utilizadores",
    icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z",
    adminOnly: true,
  },
  {
    href: "/admin/categories",
    label: "Categorias",
    icon: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z",
    adminOnly: true,
  },
  {
    href: "/admin/content?access=pro",
    label: "Planos & Preços",
    icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    adminOnly: true,
  },
  {
    href: "/admin/content",
    label: "Conteúdos",
    icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireContributor();
  const isAdmin = isAdminRole(session.role);
  const navItems = ALL_NAV_ITEMS.filter((item) => !item.adminOnly || isAdmin);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-background">
      {/* Admin Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        {/* Row 1: Brand & User */}
        <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="flex h-9 w-9 items-center justify-center bg-primary/10">
              <svg
                className="h-5 w-5 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
                />
              </svg>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-foreground">Algoria Admin</p>
              <p className="text-[10px] tracking-widest text-muted-foreground">
                Management Panel
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 border border-border bg-secondary/50 px-3 py-1.5 shadow-sm">
              <div className="hidden text-right lg:block">
                <p className="text-xs font-semibold text-foreground leading-none">
                  {session.name}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {session.role}
                </p>
              </div>
              {session.image ? (
                <Image
                  src={session.image}
                  alt={session.name}
                  width={28}
                  height={28}
                  className="h-7 w-7 object-cover ring-2 ring-background"
                />
              ) : (
                <div className="flex h-7 w-7 items-center justify-center bg-primary text-[10px] font-bold text-primary-foreground">
                  {session.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Row 2: Horizontal Navigation */}
        <div className="border-t border-border bg-secondary/20">
          <div className="container mx-auto px-4 lg:px-8">
            <AdminNav navItems={navItems} />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto p-6 lg:p-10 animate-in">
        {children}
      </main>
    </div>
  );
}
