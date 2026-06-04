import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

import { AlgoriaPostHogProvider } from "@/components/analytics/posthog-provider";
import { CookieBanner } from "@/components/analytics/cookie-banner";
import { AuthDialogProvider } from "@/components/auth/auth-dialog-context";
import { AuthDialog } from "@/components/auth/auth-dialog";
import { ProgressSyncOnLogin } from "@/components/billing/progress-sync";
import { Sidebar } from "@/components/layout/sidebar";
import { SidebarProvider } from "@/components/layout/sidebar-context";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { JsonLdScript } from "@/components/seo/json-ld";
import { ThemeProvider } from "@/components/theme-provider";
import { ToastContainer } from "@/components/ui/toast";
import { getMetadataBase, getSiteOrigin } from "@/lib/seo/site";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Acite — aprende algoritmos lendo código, não escrevendo",
    template: "%s · Acite",
  },
  description:
    "Plataforma onde aprendes problemas clássicos de algoritmos linha-a-linha, com explicações em três níveis de profundidade, comparação brute-force vs óptima, e mini-cursos de Big O.",
  keywords: [
    "algoritmos",
    "estruturas de dados",
    "leetcode",
    "big o",
    "preparação de entrevistas",
    "data structures",
    "aprender algoritmos",
  ],
  metadataBase: getMetadataBase(),
  openGraph: {
    title: "Acite — aprende algoritmos lendo código",
    description:
      "Linha por linha, com 3 níveis de profundidade. Foco em entender, não em decorar.",
    type: "website",
    locale: "pt_BR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const origin = getSiteOrigin();
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "EducationalOrganization",
        "@id": `${origin}/#organization`,
        name: "Acite",
        url: origin,
        description:
          "Plataforma para aprender algoritmos e estruturas de dados com leitura guiada de código, preparação para entrevistas e guias de engenharia aplicada.",
      },
      {
        "@type": "WebSite",
        "@id": `${origin}/#website`,
        url: origin,
        name: "Acite",
        inLanguage: "pt-BR",
        publisher: { "@id": `${origin}/#organization` },
      },
    ],
  };

  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://us.posthog.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://us-assets.i.posthog.com" crossOrigin="anonymous" />
      </head>
      <body className="flex min-h-full flex-col">
        <JsonLdScript data={structuredData} />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AlgoriaPostHogProvider>
            <AuthDialogProvider>
              <ProgressSyncOnLogin />
              <SiteHeader />
              <SidebarProvider>
                <Sidebar />
                <main className="flex flex-1 flex-col xl:ml-[var(--sidebar-width,48px)] transition-[margin-left] duration-300">
                  {children}
                </main>
              </SidebarProvider>
              <SiteFooter />
              <AuthDialog />
              <ToastContainer />
              <CookieBanner />
            </AuthDialogProvider>
          </AlgoriaPostHogProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
