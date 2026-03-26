import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import DashboardNav from '@/components/dashboard/DashboardNav';

export const metadata = {
  title: 'Dashboard | Caliber Web Studio',
  description: 'Manage your AI-powered business presence',
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Requires: npm install @clerk/nextjs
  // Set NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY in .env.local
  // Add <ClerkProvider> to src/app/layout.tsx
  const { userId } = await auth();
  if (!userId) {
    redirect('/sign-in');
  }

  // Set these in Clerk Dashboard -> Users -> [user] -> Public Metadata:
  // { "clientId": "caliber", "businessName": "Caliber Web Studio", "plan": "Growth" }
  const user = await currentUser();
  const businessName = (user?.publicMetadata?.businessName as string) ?? 'My Business';
  const plan = (user?.publicMetadata?.plan as string) ?? 'Starter';
  const firstName = user?.firstName ?? '';
  const lastName = user?.lastName ?? '';
  const email = user?.emailAddresses?.[0]?.emailAddress ?? '';
  const initials = `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase() || 'U';

  return (
    <div style={{ background: '#141414', minHeight: '100vh' }} className="flex h-screen overflow-hidden text-white">
      <DashboardNav
        businessName={businessName}
        plan={plan}
        user={{ firstName, lastName, email, initials }}
      />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
