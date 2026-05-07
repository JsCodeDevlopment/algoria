import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';

import { SignUpForm } from '@/components/auth/sign-up-form';
import { AlgoriaMark } from '@/components/branding/algoria-logo';
import { Button } from '@/components/ui/button';
import { buildPublicMetadata } from '@/lib/seo/build-metadata';

export const metadata: Metadata = buildPublicMetadata({
  title: 'Criar conta',
  description: 'Cria uma conta Algoria para guardar o progresso na nuvem e subscrever o catálogo Pro.',
  pathname: '/auth/sign-up',
  keywords: ['registo', 'conta', 'Algoria'],
});

export default function SignUpPage() {
  return (
    <div className="relative flex-1 bg-grid-pattern">
      {/* Decorative gradients */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-16">
        <Button asChild variant="outline" size="sm" className="mb-10 rounded-none gap-2 text-xs font-bold uppercase tracking-wide">
          <Link href="/"><ArrowLeft className="h-3.5 w-3.5" /> Início</Link>
        </Button>

        <div className="grid gap-16 lg:grid-cols-[1fr_minmax(0,480px)]">
          {/* Left — branding + value props */}
          <div className="flex flex-col justify-center">
            <div className="border-l-4 border-primary pl-8">
              <p className="text-[10px] font-black uppercase tracking-[0.35em] text-primary">Nova conta</p>
              <h1 className="mt-3 text-4xl font-black uppercase tracking-tight lg:text-5xl">
                Criar conta
              </h1>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-muted-foreground">
                Cria a tua conta gratuita e começa a estudar algoritmos com leitura guiada de código.
              </p>
            </div>

            <div className="mt-12 hidden lg:block">
              <div className="space-y-6">
                {[
                  { label: 'Gratuito para começar', desc: 'Acesso a problemas free, conceitos, inglês técnico e guias de engenharia.' },
                  { label: 'Progresso sincronizado', desc: 'O teu progresso local será fundido com a conta no primeiro login.' },
                  { label: 'Upgrade quando quiseres', desc: 'Plano Pro desbloqueia o catálogo completo de soluções e o code player.' },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center border border-primary/30 bg-primary/5 text-primary">
                      <span className="h-2 w-2 bg-primary" aria-hidden />
                    </span>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.1em] text-foreground">{item.label}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — form card */}
          <div className="flex flex-col justify-center">
            <div className="border-2 border-border/80 bg-background/80 shadow-2xl shadow-primary/5 backdrop-blur-xl">
              <div className="h-1 bg-gradient-to-r from-primary/30 via-primary/70 to-primary" aria-hidden />
              <div className="px-8 pb-10 pt-8">
                <div className="mb-6 flex items-center gap-3">
                  <AlgoriaMark className="h-8 w-8" />
                  <span className="text-lg font-black uppercase tracking-[0.12em]">Algoria</span>
                </div>
                <SignUpForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
