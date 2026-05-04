import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import './globals.css';

import { AlgoriaPostHogProvider } from '@/components/analytics/posthog-provider';
import { ThemeProvider } from '@/components/theme-provider';
import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Algoria — aprende algoritmos lendo código, não escrevendo',
    template: '%s · Algoria',
  },
  description:
    'Plataforma onde aprendes problemas clássicos de algoritmos linha-a-linha, com explicações em três níveis de profundidade, comparação brute-force vs óptima, e mini-cursos de Big O.',
  keywords: [
    'algoritmos',
    'estruturas de dados',
    'leetcode',
    'big o',
    'preparação de entrevistas',
    'data structures',
    'aprender algoritmos',
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'Algoria — aprende algoritmos lendo código',
    description:
      'Linha por linha, com 3 níveis de profundidade. Foco em entender, não em decorar.',
    type: 'website',
    locale: 'pt_BR',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="flex min-h-full flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AlgoriaPostHogProvider>
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </AlgoriaPostHogProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
