import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { getClientConfig } from '@/config/clientConfig';

// Generates seed-stable mock daily volume for last 30 days
function generateDailyVolume(clientId: string) {
  const days: { date: string; count: number }[] = [];
  const seed = clientId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const val = Math.floor(((seed * (i + 7)) % 17) + 2);
    days.push({ date: label, count: val });
  }
  return days;
}

// GET /api/dashboard/stats
// Requires: npm install @clerk/nextjs + CLERK_SECRET_KEY env var
export async function GET(_req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await currentUser();
  const clientId = (user?.publicMetadata?.clientId as string) ?? 'caliber';
  const plan = (user?.publicMetadata?.plan as string) ?? 'Starter';

  const config = getClientConfig(clientId);
  if (!config) return NextResponse.json({ error: 'Client not found' }, { status: 404 });

  // Mock stats — replace with Neon DB queries in Phase 2:
  //   SELECT COUNT(*) FROM leads WHERE client_id = $1 AND created_at > NOW() - INTERVAL '30 days'
  //   SELECT COUNT(*) FROM conversations WHERE client_id = $1 AND ...
  const seed = clientId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const monthlyVisitors = 1800 + (seed % 1200);
  const leadsCaptures = 15 + (seed % 20);
  const chatConversations = 90 + (seed % 100);
  const dailyVolume = generateDailyVolume(clientId);

  return NextResponse.json({
    clientId, plan,
    monthlyVisitors, leadsCaptures, chatConversations,
    googleRanking: null,       // Phase 2: Google Search Console API
    visitorsChange: 12, leadsChange: 8, chatsChange: 23,
    chatStats: {
      dailyVolume,
      topQuestions: [
        { question: 'What are your hours of operation?', count: 28 },
        { question: 'How much does it cost?', count: 21 },
        { question: 'Do you offer free consultations?', count: 17 },
        { question: 'What areas do you serve?', count: 14 },
        { question: 'How long does the process take?', count: 9 },
      ],
      totalThisMonth: chatConversations,
      avgPerDay: Math.round(chatConversations / 30),
    },
    chatbotSettings: {
      greeting: config.greeting,
      businessHoursEnabled: !!config.hours,
      businessHoursMessage: "We're closed. Leave your info and we'll call you back!",
    },
    businessSettings: {
      businessName: config.businessName,
      address: '',
      phone: '',
      email: config.notificationEmail ?? '',
      website: config.allowedDomains?.[0] ? 'https://' + config.allowedDomains[0] : '',
      hoursMonFri: '9:00 AM – 5:00 PM',
      hoursSat: 'Closed', hoursSun: 'Closed',
      plan,
    },
  });
}
