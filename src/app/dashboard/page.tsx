import { redirect } from 'next/navigation';

// /dashboard -> /dashboard/overview
export default function DashboardRootPage() {
  redirect('/dashboard/overview');
}
