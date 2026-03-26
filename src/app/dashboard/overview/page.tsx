import { auth, currentUser } from '@clerk/nextjs/server';

interface DashboardStats {
  monthlyVisitors: number; leadsCaptures: number; chatConversations: number;
  googleRanking: number | null; visitorsChange: number; leadsChange: number; chatsChange: number;
}

function StatCard({ label, value, change, icon, note }: {
  label: string; value: number | string; change?: number; icon: React.ReactNode; note?: string;
}) {
  const isPositive = (change ?? 0) >= 0;
  return (
    <div style={{ background: '#1a1a1a', border: '1px solid #252525' }} className="rounded-xl p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p style={{ color: '#A8B8C8' }} className="text-sm font-medium">{label}</p>
        <div style={{ background: '#1E3D8F22', color: '#A8B8C8' }} className="w-9 h-9 rounded-lg flex items-center justify-center">{icon}</div>
      </div>
      <div>
        <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
        {note ? (
          <p style={{ color: '#6b7280' }} className="text-xs mt-1">{note}</p>
        ) : change !== undefined ? (
          <p style={{ color: isPositive ? '#22c55e' : '#ef4444' }} className="text-sm mt-1 font-medium">
            {isPositive ? 'up' : 'dn'} {Math.abs(change)}% vs last month
          </p>
        ) : null}
      </div>
    </div>
  );
}

export default async function OverviewPage() {
  const { userId } = await auth();
  const user = await currentUser();
  const businessName = (user?.publicMetadata?.businessName as string) ?? 'My Business';

  let stats: DashboardStats = {
    monthlyVisitors: 0, leadsCaptures: 0, chatConversations: 0,
    googleRanking: null, visitorsChange: 0, leadsChange: 0, chatsChange: 0,
  };
  try {
    const base = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
    const res = await fetch(base + '/api/dashboard/stats', {
      headers: { 'x-clerk-user-id': userId ?? '' }, cache: 'no-store',
    });
    if (res.ok) stats = await res.json();
  } catch {}

  const month = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">{businessName}</h1>
        <p style={{ color: '#A8B8C8' }} className="text-sm mt-1">{month} Overview</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Monthly Visitors" value={stats.monthlyVisitors.toLocaleString()} change={stats.visitorsChange}
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>} />
        <StatCard label="Leads Captured" value={stats.leadsCaptures} change={stats.leadsChange}
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.5 2 2 0 0 1 3.6 1.32h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.93a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>} />
        <StatCard label="Chat Conversations" value={stats.chatConversations} change={stats.chatsChange}
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>} />
        <StatCard label="Google Ranking" value={stats.googleRanking ? '#' + stats.googleRanking : 'n/a'} note="Live ranking in Phase 2"
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>} />
      </div>
      <div style={{ background: '#1a1a1a', border: '1px solid #252525' }} className="rounded-xl p-6">
        <h2 className="text-white font-semibold mb-1">Recent Activity</h2>
        <p style={{ color: '#6b7280' }} className="text-sm mb-4">Live feed available once Neon DB is connected in Phase 2.</p>
        <div className="space-y-3">
          {[
            { time: '2 min ago', text: 'New lead captured via chatbot', color: '#22c55e' },
            { time: '14 min ago', text: 'Chatbot answered 3 questions about pricing', color: '#1E3D8F' },
            { time: '1 hr ago', text: 'New chatbot conversation started', color: '#1E3D8F' },
            { time: '3 hrs ago', text: 'Lead follow-up email sent via Resend', color: '#A8B8C8' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <div style={{ background: item.color }} className="w-2 h-2 rounded-full mt-1.5 shrink-0" />
              <div>
                <p className="text-sm text-white">{item.text}</p>
                <p style={{ color: '#6b7280' }} className="text-xs">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
