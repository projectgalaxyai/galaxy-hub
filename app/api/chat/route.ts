import { NextResponse } from 'next/server';

// This acts as a simple sub-space relay (clears on redeploy)
let messageQueue: any[] = [];
let lastResponse: string = "";

export async function GET() {
  // The M4 calls this to see if there are new messages
  const pending = [...messageQueue];
  messageQueue = []; // Clear queue after pickup
  return NextResponse.json({ pending });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Case 1: Message from the Architect (Web Terminal)
    if (body.message) {
      messageQueue.push({
        id: Date.now().toString(),
        content: body.message,
        timestamp: new Date().toISOString()
      });
      
      // Wait for a response to appear (Polling simulation)
      // For this MVP, we return 'acknowledged' and let the M4 push the real reply later
      return NextResponse.json({ status: 'relayed', reply: lastResponse || "Signal received. M4 processing..." });
    }

    // Case 2: Reply from the M4 (Orion Response)
    if (body.reply) {
      lastResponse = body.reply;
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid Payload' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Relay Failure' }, { status: 500 });
  }
}
