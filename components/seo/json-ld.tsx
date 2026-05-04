/**
 * Injeta JSON-LD no servidor (sem cliente).
 */
export function JsonLdScript(props: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger -- JSON-LD é intencional
      dangerouslySetInnerHTML={{ __html: JSON.stringify(props.data) }}
    />
  );
}
