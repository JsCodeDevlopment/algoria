/**
 * Injeta JSON-LD no servidor (sem cliente).
 */
export function JsonLdScript(props: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(props.data) }}
    />
  );
}
