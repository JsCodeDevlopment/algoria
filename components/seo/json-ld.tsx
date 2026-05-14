import Script from "next/script";

/**
 * Injeta JSON-LD usando o componente Script do Next.js para evitar avisos de hidratação
 * e garantir execução correta tanto no servidor quanto no cliente.
 */
export function JsonLdScript(props: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <Script
      id="json-ld-data"
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(props.data) }}
    />
  );
}
