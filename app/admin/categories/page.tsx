import { requireAdmin } from '@/lib/admin/auth-guard';
import CategoriesAdminClient from './categories-admin-client';

export default async function AdminCategoriesPage() {
  await requireAdmin();
  return <CategoriesAdminClient />;
}
