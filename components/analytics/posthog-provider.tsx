'use client';

import { useEffect, useRef, Suspense } from 'react';
import { usePathname, useSearchParams } from "next/navigation";
import posthog from 'posthog-js';
import { PostHogProvider, usePostHog } from 'posthog-js/react';

const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const host =
  process.env.NEXT_PUBLIC_POSTHOG_HOST?.trim() ||
  process.env.POSTHOG_HOST?.trim() ||
  'https://eu.i.posthog.com';

/** 
 * Componente para capturar mudanças de página no Next.js App Router.
 * Precisa estar envolto em Suspense.
 */
function PostHogPageView(): null {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const ph = usePostHog();

  useEffect(() => {
    if (pathname && ph) {
      let url = window.origin + pathname;
      if (searchParams.toString()) {
        url = url + `?${searchParams.toString()}`;
      }
      ph.capture('$pageview', {
        '$current_url': url,
      });
    }
  }, [pathname, searchParams, ph]);

  return null;
}

/** Provedor de Analytics: Captura acessos, cliques e performance com consentimento da LGPD. */
export function AlgoriaPostHogProvider({ children }: { children: React.ReactNode }) {
  const didInit = useRef(false);

  useEffect(() => {
    if (!key || typeof window === 'undefined' || didInit.current) return;
    didInit.current = true;

    // Verificar consentimento prévio do usuário
    const consent = localStorage.getItem('algoria-cookie-consent');
    const isAccepted = consent === 'accepted';

    posthog.init(key, {
      api_host: host,
      persistence: 'localStorage',
      autocapture: true, // Captura cliques e interações de quem consentiu
      capture_pageview: false, // Desativado aqui para usar o PostHogPageView (evita duplicados no Next.js)
      capture_performance: true,
      opt_out_capturing_by_default: true, // LGPD Compliance: inicia bloqueado por padrão (opt-out por default)
    });

    if (isAccepted) {
      posthog.opt_in_capturing();
    } else {
      posthog.opt_out_capturing();
    }

    // Ouvir alterações dinâmicas de consentimento em tempo real (disparadas pelo CookieBanner)
    const handleConsentChange = () => {
      const currentConsent = localStorage.getItem('algoria-cookie-consent');
      if (currentConsent === 'accepted') {
        posthog.opt_in_capturing();
      } else {
        posthog.opt_out_capturing();
      }
    };

    window.addEventListener('algoria-cookie-consent-updated', handleConsentChange);
    
    return () => {
      window.removeEventListener('algoria-cookie-consent-updated', handleConsentChange);
    };
  }, []);

  if (!key) {
    return <>{children}</>;
  }

  return (
    <PostHogProvider client={posthog}>
      <Suspense fallback={null}>
        <PostHogPageView />
      </Suspense>
      {children}
    </PostHogProvider>
  );
}

/** Helper para capturar eventos manuais específicos (ex: checkout_success) */
export function analyticsCapture(event: string, props?: Record<string, unknown>): void {
  if (!key || typeof window === 'undefined') return;
  try {
    posthog.capture(event, props);
  } catch {
    /* ignorar */
  }
}
