import type { Metadata } from "next";

import { RequireAuth } from "@/components/auth/require-auth";
import { ModuleCertificatePageContent } from "@/components/course/module-certificate-page-content";
import {
  buildCertificateMetadata,
  listCertificateParams,
  type CertificateParams,
} from "@/lib/courses/certificate";

export const dynamicParams = false;

export const generateStaticParams = listCertificateParams;

export async function generateMetadata({
  params,
}: {
  params: Promise<CertificateParams>;
}): Promise<Metadata> {
  return buildCertificateMetadata(await params);
}

export default async function ModuleCertificatePage({
  params,
}: {
  params: Promise<CertificateParams>;
}) {
  const { slug, moduleId } = await params;
  return (
    <RequireAuth>
      <ModuleCertificatePageContent slug={slug} moduleId={moduleId} />
    </RequireAuth>
  );
}
