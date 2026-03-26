import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';

type LeadStatus = 'new' | 'contacted' | 'qualified' | 'closed';
interface Lead { id:string; clientId:string; name?:string; email?:string; phone?:string; company?:string; message?:string; conversationSummary?:string; status:LeadStatus; createdAt:string; }

// Seed data — replace with Neon DB query in Phase 2:
//   SELECT * FROM leads WHERE client_id = $1 ORDER BY created_at DESC LIMIT 100
// RLS policy enforces isolation at DB level too:
//   CREATE POLICY "clients_see_own_leads" ON leads FOR SELECT USING (client_id = current_setting('app.client_id'));
function getMockLeads(clientId: string): Lead[] {
  const now = new Date();
  const ago = (n: number) => new Date(now.getTime() - n * 86400000).toISOString();
  return [
    { id: clientId+'-001', clientId, name:'Marcus Johnson', email:'marcus.j@gmail.com', phone:'(313) 555-0142', message:'Interested in pricing for a new website. Can you call me?', status:'new', createdAt:ago(0) },
    { id: clientId+'-002', clientId, name:'Priya Patel', email:'priya@detroitbakery.com', phone:'(248) 555-0198', company:'Detroit Artisan Bakery', message:'Need an e-commerce site to sell our products online.', status:'contacted', createdAt:ago(2) },
    { id: clientId+'-003', clientId, name:'Tom Kowalski', email:'tom.kowalski@outlook.com', company:'Kowalski Plumbing', message:'Looking for a local SEO package and website redesign.', status:'qualified', createdAt:ago(5) },
    { id: clientId+'-004', clientId, name:'Angela Williams', email:'angela.w@greatlakelegal.com', phone:'(313) 555-0177', company:'Great Lakes Legal Group', conversationSummary:'Asked about law firm website packages and turnaround time.', status:'contacted', createdAt:ago(7) },
    { id: clientId+'-005', clientId, name:'Carlos Rivera', email:'carlos@riveraautoshop.com', phone:'(586) 555-0133', company:"Rivera's Auto Shop", message:'Want a chatbot for our site. How much?', status:'new', createdAt:ago(9) },
    { id: clientId+'-006', clientId, name:'Sarah Chen', email:'schen@chenrealty.com', phone:'(248) 555-0165', company:'Chen Realty Group', message:'Need a real estate site with IDX integration.', status:'closed', createdAt:ago(14) },
  ];
}

// GET /api/dashboard/leads
// clientId comes from Clerk JWT public metadata — NEVER from query params (prevents cross-client data leaks)
export async function GET(_req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await currentUser();
  const clientId = (user?.publicMetadata?.clientId as string) ?? 'caliber';

  const leads = getMockLeads(clientId);
  return NextResponse.json({ clientId, total: leads.length, leads });
}
