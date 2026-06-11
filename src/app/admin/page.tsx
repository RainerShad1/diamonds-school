import { isAdmin } from '@/lib/auth';
import { school } from '@/lib/config';
import AdminPanel from '@/components/AdminPanel';
import LoginForm from '@/components/LoginForm';

export const dynamic = 'force-dynamic';
export const metadata = { title: `Panel administrativo — ${school.name}` };

export default function AdminPage() {
  return isAdmin() ? <AdminPanel /> : <LoginForm />;
}
