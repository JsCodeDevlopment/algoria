import { requireContributor, isAdminRole } from '@/lib/admin/auth-guard';

import { ContentTypeSelector } from './content-type-selector';

export default async function CreateContentSelectionPage() {
  const session = await requireContributor();
  const isAdmin = isAdminRole(session.role);

  return (
    <ContentTypeSelector
      userName={session.name}
      userRole={session.role}
      userImage={session.image}
      isAdmin={isAdmin}
    />
  );
}
