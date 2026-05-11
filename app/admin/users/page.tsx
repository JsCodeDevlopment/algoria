import { requireAdmin } from '@/lib/admin/auth-guard';
import AdminUsersClient from './users-admin-client';

export default async function AdminUsersPage() {
  await requireAdmin();
  return <AdminUsersClient />;
}
