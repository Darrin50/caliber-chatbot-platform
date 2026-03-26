'use client';
import { useEffect, useState } from 'react';

interface ChatStats { dailyVolume: {date:string;count:number}[]; topQuestions:{question:string;count:number}[]; totalThisMonth:number; avgPerDay:number; }
interface ChatbotSettings { greeting:string; businessHoursEnabled:boolean; businessHoursMessage:string; }

function MiniBarChart({ data }: { data: {date:string;count:number}[] }) {
  const max = Math.max(...data.map(d=>d.count),1);
  return (
    <div className="flex items-end gap-1 h-20 w-full">
      {data.map((day,i) => (
        <div key={i} className="flex-1 flex flex-col items-center group">
          <div style={{ height: Math.max((day.count/max)*100,4)+'%', background: '#1E3D8F', borderRadius: '2px 2px 0 0', minHeight: '3px' }} className="w-full opacity-80 group-hover:opacity-100 transition-opacity" />
        </div>
      ))}
    </div>
  );
}

const DEFAULT: ChatbotSettings = { greeting: "Hi! How can I help you today?", businessHoursEnabled: false, businessHoursMessage: "We're closed. Leave your info and we'll call you back!" };

export default function ChatbotPage() {
  const [stats, setStats] = useState<ChatStats|null>(null);
  const [settings, setSettings] = useState<ChatbotSettings>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/dashboard/stats').then(r=>r.json()).then(d => {
      if(d.chatStats) setStats(d.chatStats);
      if(d.chatbotSettings) setSettings(d.chatbotSettings);
    }).catch(()=>{}).finally(()=>setLoading(false));
  },[]);

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r=>setTimeout(r,600));
    setSaving(false); setSaved(true);
    setTimeout(()=>setSaved(false),2500);
  };

  return (
    <div className="p-8 max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Chatbot</h1>
        <p style={{ color: '#A8B8C8' }} className="text-sm mt-1">Analytics and configuration for your AI assistant</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div style={{ background: '#1a1a1a', border: '1px solid #252525' }} className="rounded-xl p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-white font-semibold">Chat Volume</h2>
              <p style={{ color: '#6b7280' }} className="text-xs mt-0.5">Last 30 days</p>
            </div>
            {stats && <div className="text-right"><p className="text-2xl font-bold text-white">{stats.totalThisMonth}</p><p style={{ color: '#6b7280' }} className="text-xs">conversations</p></div>}
          </div>
          {loading ? <div className="h-20 flex items-center justify-center"><div style={{ borderColor: '#1E3D8F', borderTopColor: 'transparent' }} className="w-6 h-6 border-2 rounded-full animate-spin" /></div>
            : stats ? <><MiniBarChart data={stats.dailyVolume} /><div className="flex justify-between mt-2"><p style={{ color: '#6b7280' }} className="text-xs">{stats.dailyVolume[0]?.date}</p><p style={{ color: '#6b7280' }} className="text-xs">{stats.dailyVolume[stats.dailyVolume.length-1]?.date}</p></div></>
            : <p style={{ color: '#6b7280' }} className="text-sm text-center py-4">No data yet</p>}
        </div>

        <div style={{ background: '#1a1a1a', border: '1px solid #252525' }} className="rounded-xl p-5">
          <h2 className="text-white font-semibold mb-4">Top Questions</h2>
          {loading ? <div className="space-y-2">{[1,2,3].map(i=><div key={i} style={{ background:'#252525' }} className="h-8 rounded animate-pulse" />)}</div>
            : stats?.topQuestions?.length ? (
              <div className="space-y-2.5">
                {stats.topQuestions.slice(0,5).map((q,i)=>(
                  <div key={i} className="flex items-start gap-2">
                    <span style={{ background:'#1E3D8F33',color:'#A8B8C8',minWidth:'20px' }} className="text-xs px-1.5 py-0.5 rounded font-mono text-center">{q.count}</span>
                    <p style={{ color:'#A8B8C8' }} className="text-xs leading-relaxed">{q.question}</p>
                  </div>
                ))}
              </div>
            ) : <p style={{ color:'#6b7280' }} className="text-sm">No questions yet</p>}
        </div>
      </div>

      <div style={{ background: '#1a1a1a', border: '1px solid #252525' }} className="rounded-xl p-6">
        <h2 className="text-white font-semibold mb-5">Chatbot Settings</h2>
        <div className="space-y-5 max-w-xl">
          <div>
            <label className="block text-sm font-medium text-white mb-1.5">Greeting Message</label>
            <p style={{ color:'#6b7280' }} className="text-xs mb-2">First message visitors see when they open the chatbot</p>
            <textarea value={settings.greeting} onChange={e=>setSettings({...settings,greeting:e.target.value})} rows={3}
              style={{ background:'#141414',border:'1px solid #2a2a2a',color:'#fff',resize:'none' }}
              className="w-full rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#1E3D8F] transition-colors" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <label className="text-sm font-medium text-white">Business Hours Mode</label>
                <p style={{ color:'#6b7280' }} className="text-xs mt-0.5">Different message outside business hours</p>
              </div>
              <button onClick={()=>setSettings({...settings,businessHoursEnabled:!settings.businessHoursEnabled})}
                style={{ background:settings.businessHoursEnabled ? '#1E3D8F' : '#2a2a2a' }}
                className="relative w-10 h-5 rounded-full transition-colors duration-200 shrink-0">
                <span style={{ transform:settings.businessHoursEnabled?'translateX(20px)':'translateX(2px)' }} className="block w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform duration-200" />
              </button>
            </div>
            {settings.businessHoursEnabled && (
              <textarea value={settings.businessHoursMessage} onChange={e=>setSettings({...settings,businessHoursMessage:e.target.value})} rows={2}
                style={{ background:'#141414',border:'1px solid #2a2a2a',color:'#fff',resize:'none' }}
                className="w-full rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#1E3D8F] transition-colors" />
            )}
          </div>
          <div className="flex items-center gap-3 pt-1">
            <button onClick={handleSave} disabled={saving} style={{ background:saving?'#152d6b':'#1E3D8F' }}
              className="px-5 py-2 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-opacity disabled:cursor-not-allowed">
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
            {saved && <span style={{ color:'#22c55e' }} className="text-sm font-medium">Saved</span>}
          </div>
          <p style={{ color:'#6b7280',borderTop:'1px solid #252525' }} className="text-xs pt-4">Full config lives in clientConfig.ts — settings UI will sync to DB in Phase 2.</p>
        </div>
      </div>
    </div>
  );
}
