'use client';
import { useEffect, useState } from 'react';

interface BusinessSettings { businessName:string; address:string; phone:string; email:string; website:string; hoursMonFri:string; hoursSat:string; hoursSun:string; plan:string; }

const planInfo: Record<string,{label:string;style:string;description:string}> = {
  Starter: { label:'Starter', style:'bg-white/5 text-[#A8B8C8] border border-white/10', description:'AI chatbot + lead capture. Perfect for getting started.' },
  Growth:  { label:'Growth',  style:'bg-blue-500/20 text-blue-300 border border-blue-500/30', description:'Chatbot + leads + review management. Most popular.' },
  Domination: { label:'Domination', style:'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30', description:'Full platform + SEO + custom AI training. Maximum results.' },
};

function Field({ label, id, value, onChange, placeholder, type='text', readOnly=false }: { label:string;id:string;value:string;onChange?:(v:string)=>void;placeholder?:string;type?:string;readOnly?:boolean; }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-white mb-1.5">{label}</label>
      <input id={id} type={type} value={value} onChange={e=>onChange?.(e.target.value)} placeholder={placeholder} readOnly={readOnly}
        style={{ background:'#141414', border:`1px solid ${readOnly?'#1f1f1f':'#2a2a2a'}`, color:readOnly?'#6b7280':'#fff' }}
        className="w-full rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#1E3D8F] transition-colors" />
    </div>
  );
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<BusinessSettings>({ businessName:'',address:'',phone:'',email:'',website:'',hoursMonFri:'9:00 AM – 5:00 PM',hoursSat:'Closed',hoursSun:'Closed',plan:'Starter' });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    fetch('/api/dashboard/stats').then(r=>r.json()).then(d=>{ if(d.businessSettings) setSettings(p=>({...p,...d.businessSettings})); }).catch(()=>{}).finally(()=>setLoading(false));
  },[]);

  const set = (key:keyof BusinessSettings)=>(value:string)=>setSettings(p=>({...p,[key]:value}));

  const handleSave = async ()=>{
    setSaving(true); await new Promise(r=>setTimeout(r,700));
    setSaving(false); setSaved(true); setTimeout(()=>setSaved(false),3000);
  };

  const info = planInfo[settings.plan] ?? planInfo.Starter;

  return (
    <div className="p-8 max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p style={{ color:'#A8B8C8' }} className="text-sm mt-1">Manage your business profile and plan</p>
      </div>

      <div style={{ background:'#1a1a1a',border:'1px solid #252525' }} className="rounded-xl p-5 flex items-start gap-4">
        <div style={{ background:'#1E3D8F22',color:'#A8B8C8' }} className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-white font-semibold">Current Plan</p>
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${info.style}`}>{info.label}</span>
          </div>
          <p style={{ color:'#A8B8C8' }} className="text-sm mt-1">{info.description}</p>
          <p style={{ color:'#6b7280' }} className="text-xs mt-1.5">To upgrade, contact <a href="mailto:hello@caliberwebstudio.com" style={{ color:'#A8B8C8' }} className="hover:text-white transition-colors">hello@caliberwebstudio.com</a></p>
        </div>
      </div>

      <div style={{ background:'#1a1a1a',border:'1px solid #252525' }} className="rounded-xl p-6">
        <h2 className="text-white font-semibold mb-5">Business Information</h2>
        {loading ? <div className="space-y-4">{[1,2,3,4].map(i=><div key={i} style={{ background:'#252525' }} className="h-10 rounded-lg animate-pulse" />)}</div> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2"><Field label="Business Name" id="name" value={settings.businessName} onChange={set('businessName')} placeholder="e.g. Detroit Auto Detailing" /></div>
            <div className="sm:col-span-2"><Field label="Address" id="address" value={settings.address} onChange={set('address')} placeholder="e.g. 123 Main St, Detroit, MI 48201" /></div>
            <Field label="Phone" id="phone" value={settings.phone} onChange={set('phone')} placeholder="(313) 555-0100" type="tel" />
            <Field label="Email" id="email" value={settings.email} onChange={set('email')} placeholder="info@yourbusiness.com" type="email" />
            <div className="sm:col-span-2"><Field label="Website" id="website" value={settings.website} onChange={set('website')} placeholder="https://yourbusiness.com" /></div>
          </div>
        )}
      </div>

      <div style={{ background:'#1a1a1a',border:'1px solid #252525' }} className="rounded-xl p-6">
        <h2 className="text-white font-semibold mb-5">Business Hours</h2>
        <div className="space-y-3">
          <Field label="Monday – Friday" id="hours-mf" value={settings.hoursMonFri} onChange={set('hoursMonFri')} placeholder="9:00 AM – 6:00 PM" />
          <Field label="Saturday" id="hours-sat" value={settings.hoursSat} onChange={set('hoursSat')} placeholder="10:00 AM – 4:00 PM or Closed" />
          <Field label="Sunday" id="hours-sun" value={settings.hoursSun} onChange={set('hoursSun')} placeholder="Closed" />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button onClick={handleSave} disabled={saving} style={{ background:saving?'#152d6b':'#1E3D8F' }} className="px-6 py-2.5 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-opacity disabled:cursor-not-allowed">
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
        {saved && <span style={{ color:'#22c55e' }} className="text-sm font-medium">Changes saved</span>}
        <p style={{ color:'#6b7280' }} className="text-xs ml-auto">Settings sync to clientConfig.ts in Phase 2</p>
      </div>
    </div>
  );
}
