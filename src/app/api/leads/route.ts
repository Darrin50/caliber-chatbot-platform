import { NextRequest, NextResponse } from 'next/server';
import { getClientConfig } from '@/config/clientConfig';

interface Lead {
  id: string;
  clientId: string;
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  message?: string;
  createdAt: string;
  conversationSummary?: string;
}

// In-memory store (replace with database in production)
const leadStore: Lead[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clientId, name, email, phone, company, message, conversationSummary } = body;

    if (!clientId || !email) {
      return NextResponse.json(
        { error: 'clientId and email are required' },
        { status: 400 }
      );
    }

    const config = getClientConfig(clientId);
    if (!config) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }

    const lead: Lead = {
      id: crypto.randomUUID(),
      clientId,
      name,
      email,
      phone,
      company,
      message,
      createdAt: new Date().toISOString(),
      conversationSummary
    };

    leadStore.push(lead);

    // Send email notification via Resend
    if (process.env.RESEND_API_KEY && config.notificationEmail) {
      try {
        const emailBody = `
New lead from ${config.businessName} chatbot:

Name: ${name || 'Not provided'}
Email: ${email}
Phone: ${phone || 'Not provided'}
Company: ${company || 'Not provided'}
Message: ${message || 'Not provided'}

${conversationSummary ? `Conversation Summary:\n${conversationSummary}` : ''}

Received at: ${lead.createdAt}
        `.trim();

        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'Chatbot Leads <leads@caliberwebstudio.com>',
            to: [config.notificationEmail],
            subject: `New Lead from ${config.businessName} Chatbot - ${name || email}`,
            text: emailBody
          })
        });
      } catch (emailError) {
        console.error('Failed to send email notification:', emailError);
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json({
      success: true,
      leadId: lead.id,
      message: 'Lead captured successfully'
    });
  } catch (error) {
    console.error('Leads API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get('clientId');

  if (!clientId) {
    return NextResponse.json(
      { error: 'clientId is required' },
      { status: 400 }
    );
  }

  const leads = leadStore.filter(lead => lead.clientId === clientId);

  return NextResponse.json({
    leads,
    total: leads.length
  });
}
