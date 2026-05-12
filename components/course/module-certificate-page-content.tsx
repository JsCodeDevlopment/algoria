import { notFound } from "next/navigation";

import { ModuleCertificateView } from "@/components/course/module-certificate-view";
import { JsonLdScript } from "@/components/seo/json-ld";
import { getCertificateContext } from "@/lib/courses/certificate";
import { learningResourceJsonLd } from "@/lib/seo/structured-data";

interface Props {
  slug: string;
  moduleId: string;
}

export async function ModuleCertificatePageContent({ slug, moduleId }: Props) {
  const ctx = await getCertificateContext(slug, moduleId);
  if (!ctx) notFound();

  return (
    <>
      <JsonLdScript
        data={learningResourceJsonLd({
          name: ctx.moduleHydrated.certificateTitle,
          description: ctx.description,
          pathname: `/course/${slug}/module/${moduleId}/certificate`,
        })}
      />
      <ModuleCertificateView courseSlug={slug} module={ctx.moduleHydrated} />
    </>
  );
}
