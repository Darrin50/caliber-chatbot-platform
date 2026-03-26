'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavUser {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  initials: string;
}

interface DashboardNavProps {
  businessName: string;
  plan: string;
  user: NavUser;
}

const navItems = [
  { href: '/dashboard/overview', label: 'Overview', icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>) },
  { href: '/dashboard/leads', label: 'Leads', icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>) },
  { href: '/dashboard/chatbot', label: 'Chatbot', icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>) },
  { href: '/dashboard/reviews', label: 'Reviews', icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>) },
  { href: '/dashboard/settings', label: 'Settings', icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2" /></svg>) },
];

const planBadgeStyle: Record<string, string> = {
  Domination: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
  Growth: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
  Starter: 'bg-white/5 text-[#A8B8C8] border border-white/10',
};

export default function DashboardNav({ businessName, plan, user }: DashboardNavProps) {
  const pathname = usePathname();
  return (
    <aside style={{ background: '#0d0d0d', borderRight: '1px solid #1f1f1f' }} className="w-60 flex flex-col shrink-0 h-full">
      <div style={{ borderBottom: '1px solid #1f1f1f' }} className="px-5 py-4 flex items-center gap-3">
        <div style={{ background: '#1E3D8F' }} className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
        </div>
        <div>
          <p className="text-white text-sm font-semibold leading-tight">Caliber</p>
          <p style={{ color: '#A8B8C8' }} className="text-xs">Web Studio</p>
        </div>
      </div>
      <div style={{ borderBottom: '1px solid #1f1f1f' }} className="px-5 py-3">
        <p style={{ color: '#A8B8C8' }} className="text-xs uppercase tracking-wider mb-1.5 font-medium">Workspace</p>
        <p className="text-white text-sm font-medium truncate">{businessName}</p>
        <span className={`inline-block mt-1.5 text-xs px-2 py-0.5 rounded-full font-medium ${planBadgeStyle[plan] ?? planBadgeStyle.Starter}`}>{plan} Plan</span>
      </div>
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {navItems.map(({ href, label, icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link key={href} href={href}
              style={isActive ? { background: '#1E3D8F22', color: '#fff', borderColor: '#1E3D8F66' } : { color: '#A8B8C8' }}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 border ${isActive ? 'border' : 'border-transparent hover:bg-white/5 hover:text-white'}`}
            >
              <span style={{ color: isActive ? '#A8B8C8' : '#6b7280' }}>{icon}</span>
              {label}
              {label === 'Reviews' && <span style={{ background: '#1E3D8F33', color: '#A8B8C8' }} className="ml-auto text-xs px-1.5 py-0.5 rounded">Soon</span>}
            </Link>
          );
        })}
      </nav>
      <div style={{ borderTop: '1px solid #1f1f1f' }} className="px-3 py-3">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors cursor-default">
          <div style={{ background: '#1E3D8F' }} className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0">{user.initials}</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white font-medium truncate leading-tight">{user.firstName} {user.lastName}</p>
            <p style={{ color: '#6b7280' }} className="text-xs truncate">{user.email}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
