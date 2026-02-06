import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { prompt, business } = await req.json();

    // Send to Clawdbot Gateway
    const gatewayUrl = process.env.CLAWDBOT_GATEWAY_URL || 'http://localhost:3334';
    const gatewayToken = process.env.CLAWDBOT_GATEWAY_TOKEN;

    const response = await fetch(`${gatewayUrl}/api/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(gatewayToken ? { 'Authorization': `Bearer ${gatewayToken}` } : {}),
      },
      body: JSON.stringify({
        message: `[ACC Command]\nBusiness: ${business}\n\n${prompt}`,
        // Optionally specify channel/target if needed
      }),
    });

    if (!response.ok) {
      throw new Error('Gateway request failed');
    }

    return NextResponse.json({ success: true, reply: 'Command sent to Alyssa' });
  } catch (error) {
    console.error('Clawdbot API error:', error);
    return NextResponse.json({ error: 'Failed to send command' }, { status: 500 });
  }
}
