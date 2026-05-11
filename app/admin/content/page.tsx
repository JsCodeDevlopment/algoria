import { requireContributor, isAdminRole } from '@/lib/admin/auth-guard';
import ContentDashboardClient from './content-dashboard-client';

export default async function AdminContentPage() {
  const session = await requireContributor();
  const isAdmin = isAdminRole(session.role);

  return <ContentDashboardClient isAdmin={isAdmin} />;
}
