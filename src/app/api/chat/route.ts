import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getClientConfig, buildSystemPrompt } from '@/config/clientConfig';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'edge';

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clientId, message, conversationHistory = [] } = body;

    if (!clientId || !message) {
      return NextResponse.json(
        { error: 'clientId and message are required' },
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

    // Check for buying intent
    const messageLower = message.toLowerCase();
    const hasBuyingIntent = config.buyingIntentKeywords.some(keyword =>
      messageLower.includes(keyword.toLowerCase())
    );

    const systemPrompt = buildSystemPrompt(config);

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.slice(-10), // Keep last 10 messages for context
      { role: 'user', content: message }
    ];

    const stream = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      stream: true,
      max_tokens: 500,
      temperature: 0.7,
    });

    const encoder = new TextEncoder();

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          // Send buying intent flag first if detected
          if (hasBuyingIntent) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ type: 'buying_intent', detected: true })}\n\n`)
            );
          }

          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ type: 'content', content })}\n\n`)
              );
            }
          }

          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new NextResponse(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
