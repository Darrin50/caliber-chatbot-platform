'use client';
import { useEffect, useState } from 'react';

interface Lead {
  id: string; clientId: string; name?: string; email?: string; phone?: string;
  company?: string; message?: string; conversationSummary?: string;
  status: 'new' | 'contacted' | 'qualified' | 'closed'; createdAt: string;
}

const statusStyles: Record<string, string> = {
  new: 'bg-blue-500/15 text-blue-300 border border-blue-500/30',
  contacted: 'bg-yellow-500/15 text-yellow-300 border border-yellow-500/30',
  qualified: 'bg-green-500/15 text-green-300 border border-green-500/30',
  closed: 'bg-white/5 text-gray-400 border border-white/10',
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/dashboard/leads')
      .then(r => r.json()).then(d => setLeads(d.leads ?? []))
      .catch(() => setLeads([])).finally(() => setLoading(false));
  }, []);

  const filtered = leads.filter(l => {
    const q = search.toLowerCase();
    return !q || l.name?.toLowerCase().includes(q) || l.email?.toLowerCase().includes(q) ||
      l.phone?.includes(q) || l.company?.toLowerCase().includes(q);
  });

  return (
    <div className="p-8 max-w-6xl">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Leads</h1>
          <p style={{ color: '#A8B8C8' }} className="text-sm mt-1">Contacts captured by your AI chatbot</p>
        </div>
        <div className="relative">
          <svg style={{ color: '#6b7280' }} className="absolute left-3 top-1/2 -translate-y-1/2" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search leads..."
            style={{ background: '#1a1a1a', border: '1px solid #252525', color: '#fff' }}
            className="pl-9 pr-4 py-2 rounded-lg text-sm w-full sm:w-60 outline-none focus:border-[#1E3D8F] transition-colors" />
        </div>
      </div>

      <div style={{ background: '#1a1a1a', border: '1px solid #252525' }} className="rounded-xl overflow-hidden">
        <div style={{ borderBottom: '1px solid #252525' }} className="px-5 py-3 flex items-center gap-2">
          <span style={{ color: '#A8B8C8' }} className="text-sm">{filtered.length} lead{filtered.length !== 1 ? 's' : ''}</span>
          {search && <button onClick={() => setSearch('')} style={{ color: '#6b7280' }} className="text-xs hover:text-white ml-1">x clear</button>}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div style={{ borderColor: '#1E3D8F', borderTopColor: 'transparent' }} className="w-8 h-8 border-2 rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p style={{ color: '#A8B8C8' }} className="text-sm">No leads found</p>
            <p style={{ color: '#6b7280' }} className="text-xs mt-1">Leads appear once your chatbot captures them</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid #252525' }}>
                  {['Name','Contact','Company','Message','Date','Status'].map(col => (
                    <th key={col} style={{ color: '#6b7280' }} className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((lead, i) => (
                  <tr key={lead.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid #1f1f1f' : 'none' }} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3.5"><p className="text-white font-medium">{lead.name ?? '—'}</p></td>
                    <td className="px-5 py-3.5">
                      <p className="text-white">{lead.email ?? '—'}</p>
                      {lead.phone && <p style={{ color: '#6b7280' }} className="text-xs mt-0.5">{lead.phone}</p>}
                    </td>
                    <td className="px-5 py-3.5"><p style={{ color: '#A8B8C8' }}>{lead.company ?? '—'}</p></td>
                    <td className="px-5 py-3.5 max-w-xs"><p style={{ color: '#A8B8C8' }} className="truncate text-xs">{lead.message ?? lead.conversationSummary ?? '—'}</p></td>
                    <td className="px-5 py-3.5"><p style={{ color: '#6b7280' }} className="text-xs whitespace-nowrap">{new Date(lead.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p></td>
                    <td className="px-5 py-3.5"><span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${statusStyles[lead.status] ?? statusStyles.new}`}>{lead.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
