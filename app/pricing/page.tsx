import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { CheckoutButton } from "@/components/billing/checkout-button";
import { ManageSubscriptionButton } from "@/components/billing/manage-subscription-button";
import { PricingPageAnalytics } from "@/components/billing/pricing-analytics";
import { AuthDialogTriggerButton } from "@/components/auth/auth-dialog-trigger";
import { getPricingPlans, getPricingFeatures, getPricingInventory } from "@/lib/actions/admin";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { auth } from "@/lib/auth";
import { userHasPro } from "@/lib/billing/entitlements";
import { checkoutAvailable, formatFreeTierPrice, formatPricingDisplay } from "@/lib/billing/pricing-env";
import { getContentRepository } from "@/lib/content/content-repository";
import { buildPublicMetadata } from "@/lib/seo/build-metadata";
import { headers } from "next/headers";
import { CheckoutSuccessAnalytics } from "./checkout-success-analytics";

export const metadata: Metadata = buildPublicMetadata({
  title: "Preços e Acite Pro",
  description:
    "Compara o plano gratuito com a subscrição Pro: catálogo completo, sync de progresso e traces de execução.",
  pathname: "/pricing",
  keywords: ["preços", "Pro", "subscrição", "Acite"],
});

export default async function PricingPage() {
  const { monthly, yearlyNote } = formatPricingDisplay();
  const canPay = checkoutAvailable();
  const session = await auth.api.getSession({ headers: await headers() });
  const hasPro = await userHasPro(session?.user?.id);


  const plans = await getPricingPlans();
  const proPlan = plans.find((p) => p.id === "pro");

  const freeFeatures = await getPricingFeatures("free");
  const proFeatures = await getPricingFeatures("pro");
  const inventory = await getPricingInventory();



  const title = proPlan?.title || "Planos e Preços";
  const description =
    proPlan?.description ||
    "Compara o plano gratuito com a subscrição Pro: desbloqueia o catálogo completo, sincronização de progresso e investimento contínuo em conteúdo.";

  const finalFreePerks = freeFeatures.map((f) => f.label || "");
  const finalProPerks = proFeatures.map((f) => f.label || "");

  const monthlyDisplay = proPlan?.priceDisplay || monthly;
  const yearlyNoteDisplay = proPlan?.yearlyNote || yearlyNote;

  return (
    <div className="relative bg-grid-pattern">
      <CheckoutSuccessAnalytics />
      <PricingPageAnalytics />
      <div className="mx-auto max-w-7xl px-6 py-24">
        <Button
          asChild
          variant="outline"
          size="sm"
          className="mb-8 rounded-none gap-2 text-xs font-bold uppercase tracking-wide"
        >
          <Link href="/">
            <ArrowLeft className="h-3.5 w-3.5" /> Início
          </Link>
        </Button>
        <header className="mb-16 border-l-4 border-primary pl-8">
          <Badge
            variant="secondary"
            className="mb-4 rounded-none bg-primary/10 px-1.5 py-0 font-mono text-[10px] uppercase text-primary"
          >
            Monetização Transparente
          </Badge>
          <h1 className="mb-4 text-4xl font-black uppercase tracking-tighter md:text-6xl">
            {title}
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed tracking-tight text-muted-foreground">
            {description}
          </p>
        </header>

        <div className="grid gap-8 md:grid-cols-2">
          <section className="group relative flex flex-col border-2 border-border p-8 transition-colors hover:bg-muted/30">
            <div className="mb-8">
              <h2 className="text-md font-black uppercase tracking-[0.3em] text-muted-foreground">
                Free
              </h2>
              <p className="mt-6 font-mono text-5xl font-black tracking-tighter">
                {formatFreeTierPrice().replace(",00", "")}
              </p>
              <p className="mt-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Acesso Vitalício
              </p>
            </div>

            <div className="mb-12 flex-1 space-y-5">
              <p className="text-sm leading-relaxed text-muted-foreground">
                Ideal para experimentares o método Acite e dominares os
                fundamentos.
              </p>
              <ul className="space-y-4">
                {finalFreePerks.map((perk) => (
                  <li
                    key={perk}
                    className="flex items-center gap-3 text-xs uppercase tracking-tight text-foreground"
                  >
                    <div className="h-1.5 w-1.5 bg-border" /> {perk}
                  </li>
                ))}
              </ul>
            </div>

            <Button
              asChild
              variant="outline"
              className="h-14 w-full rounded-none border-2 font-black uppercase tracking-widest"
            >
              <Link href="/problems">Explorar Catálogo</Link>
            </Button>
          </section>

          <section className="relative flex flex-col border-2 border-primary bg-primary/[0.03] p-8 shadow-[20px_20px_60px_rgba(0,0,0,0.05)] dark:shadow-[20px_20px_60px_rgba(0,0,0,0.3)]">
            <div className="absolute -top-4 right-8 bg-primary px-4 py-1 font-mono text-[10px] font-black uppercase tracking-[0.2em] text-primary-foreground">
              Recomendado
            </div>

            <div className="mb-8">
              <h2 className="text-md font-black uppercase tracking-[0.3em] text-primary">
                Pro
              </h2>
              <div className="mt-6 flex items-baseline gap-2">
                <p className="font-mono text-5xl font-black tracking-tighter text-foreground">
                  {monthlyDisplay.replace("/mês", "")}
                </p>
                <span className="font-mono text-sm font-bold uppercase tracking-widest text-muted-foreground">
                  / mês
                </span>
              </div>
              <p className="mt-2 text-xs font-bold uppercase tracking-widest text-primary">
                {yearlyNoteDisplay}
              </p>
            </div>

            <div className="mb-12 flex-1 space-y-5">
              <p className="text-sm leading-relaxed text-foreground font-medium">
                Desbloqueia a experiência completa e acelera a tua progressão
                técnica.
              </p>
              <ul className="space-y-4">
                {finalProPerks.map((perk) => (
                  <li
                    key={perk}
                    className="flex items-center gap-3 text-xs font-bold uppercase tracking-tight text-foreground"
                  >
                    <div className="flex h-5 w-5 items-center justify-center border border-primary/30 bg-primary/10">
                      <div className="h-1.5 w-1.5 bg-primary" />
                    </div>
                    {perk}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-auto">
              {hasPro ? (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-center gap-2 border-2 border-primary bg-primary/10 py-4 font-mono text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
                    </span>
                    Assinatura Ativa
                  </div>
                  <ManageSubscriptionButton />
                </div>
              ) : canPay ? (
                <div className="flex flex-col gap-4">
                  {session ? (
                    <CheckoutButton />
                  ) : (
                    <AuthDialogTriggerButton
                      className="h-14 w-full rounded-none font-black uppercase tracking-widest cursor-pointer"
                    >
                      Subscrever Agora
                    </AuthDialogTriggerButton>
                  )}
                  <p className="text-center font-mono text-[9px] uppercase tracking-tighter text-muted-foreground">
                    Pagamento processado de forma segura e encriptada
                  </p>
                </div>
              ) : (
                <div className="border-2 border-dashed border-primary/30 p-4 text-center">
                  <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary/60">
                    Módulo de Pagamentos em Manutenção
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>

        <section className="mt-16 border border-border bg-muted/30 p-8">
          <h2 className="text-sm font-black uppercase tracking-widest text-primary">
            Perguntas rápidas
          </h2>
          <dl className="mt-6 space-y-4 text-sm">
            <div>
              <dt className="font-semibold text-foreground">
                O que acontece ao meu progresso local?
              </dt>
              <dd className="mt-1 text-muted-foreground">
                Ao iniciar sessão, o site tenta fundir o que tens no browser com
                o que está na conta (última linha lida, problemas visitados).
                Faz backup ocasional em JSON pelo catálogo.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-foreground">
                Posso pedir reembolso?
              </dt>
              <dd className="mt-1 text-muted-foreground">
                Vê a página{" "}
                <Link
                  href="/legal/refunds"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  Política de reembolso
                </Link>
                .
              </dd>
            </div>
          </dl>
        </section>
      </div>
    </div>
  );
}
